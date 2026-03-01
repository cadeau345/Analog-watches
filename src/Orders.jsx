import { useContext } from "react";
import { OrderContext } from "./OrderContext";

function Orders() {
  const { orders } = useContext(OrderContext);

  return (
    <div className="pt-32 max-w-6xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-6 rounded-2xl shadow-sm"
            >
              <h3 className="font-bold text-lg mb-2">
                {order.product?.name}
              </h3>

              <p>Status: 
                <span className="ml-2 font-semibold">
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;