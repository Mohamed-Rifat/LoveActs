import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const positionMap = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right"
};
const AUTO_DELAY = 5000;

const HeroSlider = ({ slides, currentSlide, setCurrentSlide }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragEndX = useRef(0);
  const x = useMotionValue(0);
  const dragProgress = useTransform(x, [-500, 0, 500], [-1, 0, 1]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(() => {
      handleNext();
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, currentSlide]);

  const handleDragStart = (e, info) => {
    setIsPaused(true);
    setIsDragging(true);
    dragStartX.current = info.point.x;
  };

  const handleDragEnd = (e, info) => {
    setIsDragging(false);
    const dragDistance = info.offset.x;
    const threshold = 50;

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        handlePrev();
        animate(x, 0, { duration: 0.3 });
      } else {
        handleNext();
        animate(x, 0, { duration: 0.3 });
      }
    } else {
      animate(x, 0, { duration: 0.3 });
    }

    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleDrag = (e, info) => {
    x.set(info.offset.x);
  };

  useEffect(() => {
    x.set(0);
  }, [currentSlide, x]);

  const slide = slides[currentSlide];
  const nextSlide = slides[(currentSlide + 1) % slides.length];
  const prevSlide = slides[(currentSlide - 1 + slides.length) % slides.length];

  return (
    <div
      ref={containerRef}
      className="relative h-96 md:h-screen max-h-[600px] overflow-hidden container mx-auto px-4 rounded-sm mt-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <motion.div
        className="absolute inset-0"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.subheading}
            className="w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`} />
        </div>

        <div className={`relative h-full flex items-center ${positionMap[slide.position]} px-4 md:px-16`}>
          <div className="max-w-2xl mx-0 lg:mx-16 text-white z-10 w-full">
            <motion.h2
              className={`text-4xl lg:text-8xl font-semibold mb-4 ${slide.headingColor}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {slide.heading}
            </motion.h2>

            <motion.h1
              className={`text-4xl lg:text-7xl font-bold lg:mb-4 ${slide.subheadingColor}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              {slide.subheading}
            </motion.h1>

            {slide.description && (
              <motion.p
                className="text-base lg:text-2xl mt-4 lg:mt-6 mb-4 max-w-md lg:max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                {slide.description}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: useTransform(dragProgress, [0, 1], ["0%", "100%"]),
          opacity: useTransform(dragProgress, [0, 0.5, 1], [0, 0.5, 1])
        }}
      >
        <div className="absolute inset-0">
          <img
            src={nextSlide.image}
            alt={nextSlide.subheading}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${nextSlide.bgColor} opacity-90`} />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: useTransform(dragProgress, [-1, 0], ["-100%", "0%"]),
          opacity: useTransform(dragProgress, [-1, -0.5, 0], [1, 0.5, 0])
        }}
      >
        <div className="absolute inset-0">
          <img
            src={prevSlide.image}
            alt={prevSlide.subheading}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${prevSlide.bgColor} opacity-90`} />
        </div>
      </motion.div>

      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 group focus:outline-none"
        aria-label="Previous slide"
      >
        <motion.div
          className="relative w-12 h-12 md:w-16 md:h-16"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0, -4, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 group focus:outline-none"
        aria-label="Next slide"
      >
        <motion.div
          className="relative w-12 h-12 md:w-16 md:h-16"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </button>

      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-2 z-10">
        <motion.p
          className="text-md md:text-2xl italic text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Love is in every sip.
        </motion.p>

        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 2000);
              }}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/50 group-hover:bg-white/70'
                }`} />
              {index === currentSlide && (
                <motion.div
                  className="absolute -inset-1 rounded-full bg-white/20"
                  layoutId="activeDot"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;