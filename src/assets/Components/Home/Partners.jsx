const Partners = ({ clients = [] }) => {
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Featured Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We collaborate with the best brands and suppliers to ensure quality service
          </p>
        </div>

        <div className="relative w-full py-10 overflow-hidden">
          <div className="flex animate-scroll-infinite space-x-8">
            {duplicatedClients.map((client, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-105"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                  decoding="async"
                  width="112"
                  height="112"
                />
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll 8s linear infinite;
          display: flex;
          width: max-content;
        }
          
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Partners;
