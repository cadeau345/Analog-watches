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
import Men from "./Men";
import Women from "./Women";
import NewArrivals from "./NewArrivals";
import Cart from "./Cart";
import Contact from "./Contact";
import Orders from "./Orders";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";

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
const [ordersCount, setOrdersCount] = useState(0);

useEffect(() => {

  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {

      const newOrders = snapshot.docChanges().filter(
        change => change.type === "added"
      );

      if (newOrders.length > 0) {

        setOrdersCount(prev => prev + newOrders.length);

        // صوت
        const audio = new Audio("/notification.mp3");
        audio.volume = 1;
        audio.play();

        // إشعار
        toast.success("🛒 New Order Received!");

      }

    }
  );

  return () => unsubscribe();

}, []);
function App() {
  return (
    <>
    <Toaster position="top-right" />
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
<div className="bg-red-500 text-white px-3 py-1 rounded-full">
{ordersCount}
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