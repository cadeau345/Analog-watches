import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const section = document.getElementById("products-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-black">
            Timeless Analog <br /> Watches
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Discover premium analog watches designed for elegance, precision,
            and confidence. Pay on delivery available.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={scrollToProducts}
              className="bg-black text-white px-8 py-3 rounded-full hover:scale-105 hover:shadow-xl transition duration-300"
            >
              Shop Now
            </button>

            <button
              onClick={() => navigate("/new")}
              className="border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition duration-300"
            >
              New Arrivals
            </button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
            alt="Analog Watch"
            className="w-[400px]md:w-[500px] object-contain drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;