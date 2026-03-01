import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "./OrderContext";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useContext(OrderContext);

  const total = cart.reduce(
    (acc, item) =>
      acc + (parseInt(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="pt-32 pb-20 max-w-6xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
              >
                <div className="flex gap-6 items-center">
                  <img
                    src={item.mainImage || item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div>
                    <h3 className="font-bold text-lg">
                      {item.name}
                    </h3>
                    <p>Color: {item.selectedColor}</p>
                    <p>
                      {item.price} EGP
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.selectedColor
                          )
                        }
                        className="border px-3 py-1 rounded"
                      >
                        -
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.selectedColor
                          )
                        }
                        className="border px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(
                      item.id,
                      item.selectedColor
                    )
                  }
                  className="bg-red-500 text-white px-6 py-2 rounded-full"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-right mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Total: {total} EGP
            </h2>

            <button
              onClick={() => navigate("/checkout")}
              className="bg-black text-white px-8 py-3 rounded-full"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;