import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaPlay } from 'react-icons/fa';

const GameSwiper = ({ games }) => {
  const getPrice = (value) => Number(value) || 0;
  const getDiscount = (value) => Number(value) || 0;

  return (
    <div className="relative rounded-xl overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-[500px]"
      >
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="relative h-full">
              <img
                src={game.image_url}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-2xl">
                  <span className="bg-steam-accent text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    Featured
                  </span>
                  <h2 className="text-5xl font-bold text-white mb-4">
                    {game.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {getDiscount(game.discount) > 0 && (
                      <div className="bg-steam-green text-white px-4 py-2 rounded-lg font-bold text-2xl">
                        -{getDiscount(game.discount)}%
                      </div>
                    )}
                    <div className="text-white">
                      <div className="text-3xl font-bold">
                        ${(
                          getPrice(game.price) * (1 - getDiscount(game.discount) / 100)
                        ).toFixed(2)}
                      </div>
                      {getDiscount(game.discount) > 0 && (
                        <div className="text-gray-400 line-through">
                          ${getPrice(game.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <button className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2 transition-all">
                      <FaPlay />
                      Buy Now
                    </button>
                    <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-lg transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameSwiper;