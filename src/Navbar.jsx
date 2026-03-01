import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { OrderContext } from "./OrderContext";

function Navbar() {
  const { cart } = useContext(OrderContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Analog Watches
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <Link to="/">Home</Link>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
          <Link to="/new">New Arrivals</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <Link
            to="/cart"
            className="relative bg-gray-200 px-5 py-2 rounded-full"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-black text-white px-4 py-2 rounded-full"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-gray-700 font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/men" onClick={() => setMenuOpen(false)}>Men</Link>
          <Link to="/women" onClick={() => setMenuOpen(false)}>Women</Link>
          <Link to="/new" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;