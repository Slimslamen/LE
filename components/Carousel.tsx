"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableImage from "./AdminEdit/EditableImage";

const Carousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{ id: number; url: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { imagesMap } = useSupabase();


  const allImages = [
    { id: 1, url: imagesMap?.["carousel_background_pic_1"] ?? "" },
    { id: 2, url: imagesMap?.["carousel_background_pic_2"] ?? "" },
    { id: 3, url: imagesMap?.["carousel_background_pic_3"] ?? "" },
    { id: 4, url: imagesMap?.["carousel_background_pic_4"] ?? "" },
    { id: 6, url: imagesMap?.["carousel_background_pic_6"] ?? "" },
    { id: 5, url: imagesMap?.["carousel_background_pic_5"] ?? "" },
    { id: 8, url: imagesMap?.["carousel_background_pic_8"] ?? "" },
    { id: 7, url: imagesMap?.["carousel_background_pic_7"] ?? "" },
    { id: 9, url: imagesMap?.["carousel_background_pic_9"] ?? "" },
    { id: 10, url: imagesMap?.["carousel_background_pic_10"] ?? "" },
    { id: 11, url: imagesMap?.["carousel_background_pic_11"] ?? "" },
    { id: 12, url: imagesMap?.["carousel_background_pic_12"] ?? "" },
  ];

  // Layout configurations for different pages
  const layouts = {
    page1: [
      { col: 1, row: 2 },
      { col: 2, row: 2 },
      { col: 1, row: 2 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
      { col: 1, row: 2 },
    ],
    page2: [
      { col: 1, row: 2 },
      { col: 2, row: 1 },
      { col: 1, row: 2 },
      { col: 2, row: 1 },
      { col: 2, row: 1 },
      { col: 2, row: 1 },
    ],
  };

  const imagesPerPage = 6;
  const totalPages = Math.ceil(allImages.length / imagesPerPage);

  const getCurrentImages = () => {
    const start = currentPage * imagesPerPage;
    return allImages.slice(start, start + imagesPerPage);
  };

  const getCurrentLayout = () => {
    return currentPage === 0 ? layouts.page1 : layouts.page2;
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const currentImages = getCurrentImages();
  const currentLayout = getCurrentLayout();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-2 -translate-x-8 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-95 w-10 md:h-10 h-96"
            aria-label="Previous images"
          >
            <Image
              src="/svg/left-chevron-svgrepo-com.svg"
              alt="left icon"
              width={24}
              height={24}
              loading="lazy"
              className="w-6 h-6 absolute top-2 left-2"
            />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 md:-translate-x-2 translate-x-8 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-95 w-10 md:h-10 h-96"
            aria-label="Next images"
          >
            <Image
              src="/svg/right-chevron-svgrepo-com.svg"
              alt="right icon"
              width={24}
              height={24}
              loading="lazy"
              className="w-6 h-6 absolute top-2 right-2"
            />
          </button>

          {/* Gallery Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[1fr] lg:auto-rows-[1fr] h-auto sm:h-[520px] lg:h-[600px] transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {currentImages.map((image, index) => {
              const layout = currentLayout[index];
              const colClass = layout?.col === 2 ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-1";
              const rowClass = layout?.row === 2 ? "sm:row-span-2 lg:row-span-2" : "sm:row-span-1 lg:row-span-1";
              return (
                <div
                  key={image.id}
                  className={`col-span-1 row-span-1 ${colClass} ${rowClass} relative overflow-hidden rounded-lg shadow-xl group cursor-pointer`}
                  onClick={() => setSelectedImage(image)}
                >
                  <EditableImage
                    imageKey={`carousel_background_pic_${image.id}`}
                    value={image.url}
                    alt="auto"
                    fill
                    priority="lazy"
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110 absolute"
                    editButtonClassName="w-40 absolute right-5"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Indicator */}
        <div className="flex justify-center items-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              id="CarouselBtn"
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentPage ? "bg-[#66BEF0] w-8" : "bg-[#66bdf06f] hover:bg-[#66BEF0]"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="md:fixed hidden inset-0 bg-black/85 z-1000 md:h-[90vh] 2xl:h-[60vh] md:flex items-center justify-center p-4 rounded-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Bildförhandsvisning"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white font-bold bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 w-8 h-8 flex items-center justify-center"
            aria-label="Stäng"
          >
            X
          </button>

          <Image
            fill
            src={selectedImage.url}
            alt="Förstorad bild"
            className=" max-h-[80vh] 2xl:max-h-[50vh] object-contain rounded-lg shadow-2xl mt-10"
            onClick={() => setSelectedImage(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
