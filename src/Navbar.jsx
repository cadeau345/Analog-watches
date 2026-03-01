import { Link } from "react-router-dom";
import { useContext } from "react";
import { OrderContext } from "./OrderContext";

function Navbar() {
  const { cart } = useContext(OrderContext);

  // حساب إجمالي الكمية
  const totalQuantity = cart.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold">
          Analog Watches
        </Link>

      <div className="flex flex-wrap gap-4 text-gray-600 font-medium justify-center">
          <Link to="/">Home</Link>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/new">New Arrivals</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="flex items-center gap-4">

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative bg-gray-200 px-5 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Cart

            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                {totalQuantity}
              </span>
            )}
          </Link>

          <Link
            to="/orders"
            className="bg-black text-white px-6 py-2 rounded-full hover:scale-105 transition"
          >
            My Orders
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;