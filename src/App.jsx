import { Routes, Route } from "react-router-dom";
import { motion, useScroll } from "framer-motion";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Products from "./Products";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "./Footer";
import ProductDetails from "./ProductDetails";
import Checkout from "./Checkout";
import Success from "./Success";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";
import Men from "./men";
import Women from "./Women";
import NewArrivals from "./NewArrivals";
import Cart from "./Cart";
import Contact from "./Contact";
import Orders from "./Orders";

/* 🔥 Scroll Progress Bar */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-black origin-leftz-[9999]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />

      <div className="pt-20">
        <Routes>

          {/* 🏠 Home */}
          <Route
            path="/"
            element={
              <>
                <Hero />

                {/* 🔥 ID علشان الهيرو يعمل Scroll */}
                <div id="products-section">
                  <Products />
                </div>

                <WhyChooseUs />

                {/* 🔥 New Section ID */}
                <div id="new-section">
                  <NewArrivals />
                </div>

                <Footer />
              </>
            }
          />

          {/* 🛍 Product Page */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* 🛒 Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* 💳 Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* ✅ Success */}
          <Route path="/success" element={<Success />} />

          {/* 👑 Admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Collections */}
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/new" element={<NewArrivals />} />

          {/* 📞 Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* 📦 Orders */}
          <Route path="/orders" element={<Orders />} />

        </Routes>
      </div>
    </>
  );
}

export default App;