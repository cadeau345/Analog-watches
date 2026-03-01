import { useContext, useEffect, useRef, useState } from "react";
import { OrderContext } from "./OrderContext";
import { Navigate, useNavigate } from "react-router-dom";
import ProductManager from "./ProductManager";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Admin() {
  const navigate = useNavigate();

  /* 🔐 NEW: Auth Protection */
  const { currentUser } = useContext(OrderContext);

  // غير الايميل ده بايميلك انت
  const ADMIN_EMAIL = "moazmahmoud@email.com";

  if (!currentUser) {
    return <Navigate to="/admin-login" />;
  }

  if (currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  /* 👇 سيبنا شرط localStorage زي ما هو علشان مفيش حاجة تبوظ */
  if (localStorage.getItem("isAdmin") !== "true") {
    return <Navigate to="/admin-login" />;
  }

  const { orders, updateStatus } = useContext(OrderContext);

  /* 🔔 Notification System */
  const [showNotification, setShowNotification] = useState(false);
  const prevOrdersCount = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevOrdersCount.current) {
      setShowNotification(true);

      const audio = new Audio(
        "https://actions.google.com/sounds/v1/alarms/notification_alert.ogg"
      );

      audio.play().catch(() => {
        console.log("User interaction required before playing sound.");
      });

      setTimeout(() => setShowNotification(false), 4000);
    }

    prevOrdersCount.current = orders.length;
  }, [orders]);

  /* 💰 Revenue */
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce(
      (acc, curr) => acc + (parseInt(curr.product?.price) || 0),
      0
    );

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const chartData = [
    { name: "Pending", value: pendingCount },
    { name: "Delivered", value: deliveredCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  /* 📊 Coupon Stats */
  const couponStats = orders.reduce((acc, order) => {
    if (!order.couponCode) return acc;

    if (!acc[order.couponCode]) {
      acc[order.couponCode] = [];
    }

    acc[order.couponCode].push(order);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">

      {showNotification && (
        <div className="fixed top-5 right-5 bg-black text-white px-6 py-4 rounded-xl shadow-xl z-50 animate-bounce">
          🛒 New Order Received!
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-6 py-2 rounded-full hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-16">
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3>Total Orders</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3>Pending</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3>Delivered</h3>
          <p className="text-3xl font-bold text-green-600">
            {deliveredCount}
          </p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <h3>Revenue</h3>
          <p className="text-3xl font-bold">
            {totalRevenue} EGP
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-16">
        <h2 className="text-2xl font-bold mb-6">
          Sales Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Manage Products */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Manage Products
        </h2>
        <ProductManager />
      </div>

      {/* Orders */}
      <div className="max-w-7xl mx-auto space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md p-6 rounded-2xl border"
          >
            <div className="flex justify-between flex-wrap gap-6">

              <div>
                <h3 className="font-bold text-lg">
                  {order.product?.name}
                </h3>

                <p><strong>Name:</strong> {order.fullName}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Price:</strong> {order.product?.price} EGP</p>

                {order.couponCode && (
                  <div className="mt-2 bg-green-50 p-3 rounded-lg text-sm">
                    <p><strong>Coupon:</strong> {order.couponCode}</p>
                    <p><strong>Discount:</strong> {order.discountAmount} EGP</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {order.status !== "Delivered" && (
                  <button
                    onClick={() => updateStatus(order.id, "Delivered")}
                    className="bg-green-500 text-white px-4 py-2 rounded-full"
                  >
                    Mark Delivered
                  </button>
                )}

                {order.status !== "Cancelled" && (
                  <button
                    onClick={() => updateStatus(order.id, "Cancelled")}
                    className="bg-red-500 text-white px-4 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Coupon Detailed Usage */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-20">
        <h2 className="text-2xl font-bold mb-6">
          Coupon Detailed Usage
        </h2>

        {Object.keys(couponStats).length === 0 ? (
          <p>No coupon orders yet.</p>
        ) : (
          Object.keys(couponStats).map((code) => {
            const relatedOrders = couponStats[code];

            const totalDiscount = relatedOrders.reduce(
              (acc, order) =>
                acc + (order.discountAmount || 0),
              0
            );

            return (
              <div
                key={code}
                className="mb-8 border p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold mb-4">
                  Coupon: {code}
                </h3>

                <p>Total Uses: {relatedOrders.length}</p>
                <p>Total Discount: {totalDiscount} EGP</p>

                <div className="space-y-3 mt-4">
                  {relatedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gray-50 p-4 rounded-lg text-sm"
                    >
                      <p><strong>Name:</strong> {order.fullName}</p>
                      <p><strong>Phone:</strong> {order.phone}</p>
                      <p><strong>Product:</strong> {order.product?.name}</p>
                      <p><strong>Discount:</strong> {order.discountAmount} EGP</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default Admin;