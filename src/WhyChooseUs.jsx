import { motion } from "framer-motion";

function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16"
        >
          Why Choose Analog Watches?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <div className="text-5xl mb-6">🚚</div>
            <h3 className="text-xl font-semibold mb-3">Cash on Delivery</h3>
            <p className="text-gray-600">
              Pay only when your watch arrives at your doorstep.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Fast Shipping</h3>
            <p className="text-gray-600">
              Delivered within 24–48 hours nationwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <div className="text-5xl mb-6">🔄</div>
            <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
            <p className="text-gray-600">
              7-day replacement guarantee for peace of mind.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;