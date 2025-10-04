import React from 'react';
import { motion } from "framer-motion";

const positionMap = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right"
};

const HeroSlider = ({ slides, currentSlide, setCurrentSlide }) => {
  return (
    <div className="relative h-96 md:h-screen max-h-[600px] overflow-hidden container mx-auto px-4 rounded-sm mt-2">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.subheading}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`}></div>
          </div>

          <div className={`relative h-full flex items-center ${positionMap[slide.position]} px-4 md:px-16`}>
            <div className="max-w-2xl mx-0 lg:mx-16 text-white">
              <motion.h2
                className={`text-4xl lg:text-8xl font-semibold mb-4 ${slide.headingColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {slide.heading}
              </motion.h2>
              <motion.h1
                className={`text-4xl lg:text-7xl font-bold lg:mb-4 max-w-xs md:max-w-full ${slide.subheadingColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {slide.subheading}
              </motion.h1>
              {slide.description && (
                <motion.p
                  className={`text-base lg:text-2xl mt-2 lg:me-2 lg:mb-4 max-w-md mx-auto ${slide.id === 2 ? "max-w-xs md:max-w-md" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.description}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-2">
        <motion.p
          className="text-md md:text-2xl italic text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Love is in every sip.
        </motion.p>

        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
