import React from 'react';
import { FiShoppingCart, FiCoffee, FiStar } from "react-icons/fi";
import { motion } from 'framer-motion';

const WhyChoose = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Love Acts?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-amber-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy & Secure Shopping</h3>
            <p className="text-gray-600">Seamless shopping experience with secure payment and fast delivery</p>
          </motion.div>

          <motion.div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCoffee className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unique Cafe Experience</h3>
            <p className="text-gray-600">Enjoy comfortable atmospheres and specialty drinks at our cafes</p>
          </motion.div>

          <motion.div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">High Quality</h3>
            <p className="text-gray-600">Premium quality products carefully selected to ensure your satisfaction</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
