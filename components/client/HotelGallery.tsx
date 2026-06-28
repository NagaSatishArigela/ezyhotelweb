"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "";
  };

  // Cleanup if component unmounts while modal is open
  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((i) => (i + 1) % images.length);

  return (
    <>
      <div className="w-full rounded-2xl overflow-hidden shadow-md bg-white p-1 border border-gray-100">
        {/* Main image */}
        <div
          className="w-full h-[300px] md:h-[450px] relative group cursor-pointer overflow-hidden rounded-xl"
          onClick={() => openModal(currentIndex)}
        >
          <Image
            src={images[currentIndex]}
            alt={hotelName}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[11px] px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border border-white/20 font-bold uppercase tracking-widest shadow-xl">
            <Camera className="w-4 h-4" />
            See all {images.length} photos
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative min-w-[120px] md:min-w-[150px] h-[75px] md:h-[94px] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                currentIndex === i
                  ? "border-orange-500 ring-4 ring-orange-500/10 scale-95 shadow-inner"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${hotelName} photo ${i + 1}`} fill className="object-cover" sizes="150px" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          <button onClick={closeModal} className="absolute top-6 right-6 text-white p-3 bg-white/10 rounded-full hover:bg-white/20 transition z-10">
            <X className="w-8 h-8" />
          </button>
          <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition z-10">
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition z-10">
            <ChevronRight className="w-12 h-12" />
          </button>
          <div className="relative w-full max-w-5xl px-20 h-[70vh]">
            <Image
              src={images[currentIndex]}
              alt={`${hotelName} photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
          <p className="mt-4 text-white/60 text-sm font-medium tracking-widest">
            {currentIndex + 1} / {images.length}
          </p>
          <div className="absolute bottom-10 flex gap-2 overflow-x-auto px-10 max-w-full scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition ${
                  idx === currentIndex ? "border-orange-500 scale-110 shadow-lg" : "border-transparent opacity-40"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
