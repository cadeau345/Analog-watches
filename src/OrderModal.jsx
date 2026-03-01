import { motion } from "framer-motion";

function OrderModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-[90%]md:w-[500px] rounded-3xl p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Order: {product.name}
        </h2>

        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black"
          />

          <input
            type="text"
            placeholder="Address"
            className="border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black"
          />

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-full hover:scale-105 transition"
          >
            Confirm Order
          </button>

        </form>

      </motion.div>
    </div>
  );
}

export default OrderModal;