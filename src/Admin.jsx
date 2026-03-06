import { useContext, useEffect, useState } from "react";
import { OrderContext } from "./OrderContext";
import { Navigate, useNavigate } from "react-router-dom";
import ProductManager from "./ProductManager";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

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

  const { currentUser, orders, updateStatus } = useContext(OrderContext);

  const ADMIN_EMAIL = "moazmahmoud@gmail.com";

  if (!currentUser) {
    return <Navigate to="/admin-login" />;
  }

  if (currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  if (localStorage.getItem("isAdmin") !== "true") {
    return <Navigate to="/admin-login" />;
  }

  const [showNotification, setShowNotification] = useState(false);

  /* 🔔 Real Time Order Notification */

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {

        const newOrders = snapshot.docChanges().filter(
          change => change.type === "added"
        );

        if (newOrders.length > 0) {

          setShowNotification(true);

          const audio = new Audio("/notification.mp3");
          audio.volume = 1;
          audio.play().catch(()=>{});

          setTimeout(() => {
            setShowNotification(false);
          }, 4000);

        }

      }
    );

    return () => unsubscribe();

  }, []);

  /* 💰 Revenue */

  const totalRevenue = orders
    .filter(o => o.status === "Delivered")
    .reduce(
      (acc, curr) => acc + (parseInt(curr.product?.price) || 0),
      0
    );

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

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

        <h1 className="text-4xl font-bold flex items-center gap-3">

          Admin Dashboard

          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
            {pendingCount}
          </span>

        </h1>

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
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="value" fill="#000000"/>
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Manage Products */}

      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">
          Manage Products
        </h2>
        <ProductManager/>
      </div>

      {/* Orders */}

      <div className="max-w-7xl mx-auto space-y-6">

        {orders.map(order => (

          <div
            key={order.id}
            className="bg-white shadow-md p-6 rounded-2xl border"
          >

            <div className="flex justify-between flex-wrap gap-6">

              <div className="flex items-center gap-6">

                <img
                  src={order.product?.mainImage || order.product?.image}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div>

                  <h3 className="font-bold text-lg">
                    {order.product?.name}
                  </h3>

                  <p><strong>Name:</strong> {order.fullName}</p>

                  <p><strong>Phone:</strong> {order.phone}</p>

                  <p><strong>Color:</strong> {order.selectedColor}</p>

                  <p><strong>Address:</strong> {order.address}</p>

                  <p><strong>Governorate:</strong> {order.governorate}</p>

                  <p><strong>Price:</strong> {order.product?.price} EGP</p>

                </div>

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

    </div>

  );

}

export default Admin;