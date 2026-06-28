"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";

const carouselImages = [
  { url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/680709485.jpg?k=d130a8c2a89187cc4597ad79e4f5aee1c0011f44a1897c574a857f4516ee2081&o=", title: "Oceanfront Luxury Awaits", subtitle: "Up to 60% off premium stays" },
  { url: "https://thumbs.dreamstime.com/b/tropical-sunset-view-dark-silhouette-coconut-palm-tree-vivid-colors-orange-yellow-sky-warm-sunlight-reflects-ocean-388297687.jpg", title: "Tropical Sunset Paradise", subtitle: "Escape with exclusive deals" },
  { url: "https://thumbs.dreamstime.com/b/infinity-pool-overlooking-sunset-clouds-cliffside-resort-luxury-yellow-orange-sky-top-relaxing-scenic-view-420189707.jpg", title: "Infinity Pool Dreams", subtitle: "Relax in pure luxury" },
  { url: "https://www.christravelblog.com/wp-content/uploads/2019/01/beach-sunset-st-lucia-jade-mountain-resort-hotel-review-a-luxury-destination-on-its-own-IMG_2160-1024x683.jpg", title: "Mountain Retreat Bliss", subtitle: "Breathtaking views included" },
  { url: "https://content.paulreiffer.com/wp-content/uploads/2014/12/The-New-Yorker-Sunrise-Red-Orange-Yellow-Colours-Silhouette-Manhattan-Skyline-Cityscape-River-New-Jersey-Lincoln-Harbor-View-Paul-Reiffer-Photographer-Hotel@2x.jpg", title: "City Skyline Elegance", subtitle: "Urban luxury at sunset" },
];

export function ExclusiveDeals() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Carousel */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl h-96">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 md:bg-gradient-to-r md:from-orange-700/80 md:via-orange-600/40 md:to-transparent bg-gradient-to-t from-orange-900/70 to-transparent flex md:items-center md:pl-16 items-end p-8">
                <div className="text-white max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{image.title}</h2>
                  <p className="text-xl md:text-2xl mt-2 md:mt-4 font-semibold drop-shadow">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${currentSlide === index ? "bg-white w-10" : "bg-white/60 w-3"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white border-2 border-orange-200 rounded-3xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-40 -z-10" />
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative">
              <Zap className="w-12 h-12 text-white" />
              <div className="absolute -bottom-1 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-lg font-black text-orange-600">%</span>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-extrabold text-gray-900">Exclusive Deals, Just for You</h3>
              <p className="text-gray-600 mt-2 text-lg">Be the first to grab secret offers & flash sales</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <input type="email" placeholder="your@email.com" className="w-full h-14 border-2 border-orange-300 rounded-2xl px-6 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-lg" />
              <label className="absolute -top-3 left-6 bg-white px-3 text-sm font-semibold text-orange-600">Enter your email</label>
            </div>
            <button className="h-14 px-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold rounded-2xl transition-all shadow-xl active:scale-95">
              Get Deals
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
