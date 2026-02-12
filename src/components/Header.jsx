"use client";

import Image from "next/image";
import { Download, Plus } from "lucide-react";

export default function Header({
  onDownload,
  slides,
  activeSlide,
  setActiveSlide,
  onAddSlide,
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-green-700 shadow-md">
      <div className="max-w-[1600px] mx-auto h-16 flex items-center justify-between px-4 sm:px-6">

        {/* LOGO */}
        <div className="flex items-center gap-3">
  <div className="
    w-12 h-12 
    bg-white 
    rounded-2xl 
    flex items-center justify-center 
    shadow-sm
  ">
    <Image
      src="/icon.png"
      alt="Manorekha Logo"
      width={40}
      height={40}
      className="object-contain"
      priority
    />
  </div>

  <span className="ml-4 text-green-600 font-bold text-2xl tracking-wide">
  Manorekha
</span>

</div>


        {/* SLIDES */}
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              className={`px-3 py-1 rounded-md font-semibold ${
                index === activeSlide
                  ? "bg-white text-green-700"
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={onAddSlide}
            className="ml-2 px-3 py-1 rounded-md bg-white text-green-700 font-semibold flex items-center gap-1"
          >
            <Plus size={16} />
            Add Slide
          </button>
        </div>

        {/* DOWNLOAD */}
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-xl font-semibold"
        >
          <Download size={18} />
          Download PNG
        </button>

      </div>
    </header>
  );
}
