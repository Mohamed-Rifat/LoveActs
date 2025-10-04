import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Partners = ({ clients = [] }) => {
  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Featured Partners</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We collaborate with the best brands and suppliers to ensure quality service</p>
        </div>

        <div className="relative w-full py-10">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={2000} 
            loop={true}
            slidesPerView={2}
            spaceBetween={40}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="overflow-hidden"
            style={{
              transitionTimingFunction: "linear", 
            }}
          >
            {clients.map((client, i) => (
              <SwiperSlide key={i} className="flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-14 md:h-20 transition duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width="160"
                  height="80"
                />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
    </section>
  );
};

export default Partners;
