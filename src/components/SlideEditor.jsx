"use client";
import { useState, useRef } from "react";
import Header from "./Header";
import Whiteboard from "./Whiteboard";

export default function SlideEditor() {
  const [slides, setSlides] = useState([
    { id: `slide-1`, shapes: [], bgFill: "#ffffff" },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const whiteboardRef = useRef(null);

  const currentSlide = slides[currentSlideIndex];

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${slides.length + 1}`,
      shapes: [],
      bgFill: "#ffffff",
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length); // switch to new slide
  };

  const handleDownload = () => {
    if (whiteboardRef.current) {
      whiteboardRef.current.download();
    }
  };

  const updateShapes = (newShapes) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlideIndex].shapes = newShapes;
    setSlides(updatedSlides);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onDownload={handleDownload} />

      {/* Slide Controls */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b shadow-sm">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlideIndex(index)}
            className={`px-3 py-1 rounded-md font-semibold ${
              index === currentSlideIndex
                ? "bg-green-700 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleAddSlide}
          className="ml-2 px-3 py-1 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600"
        >
          + Add Slide
        </button>
      </div>

      {/* Whiteboard */}
      <div className="flex-1">
        <Whiteboard
          ref={whiteboardRef}
          currentTool="pen"
          strokeColor="#000000"
          strokeWidth={3}
          bgFill={currentSlide.bgFill}
          shapes={currentSlide.shapes}
          setShapes={updateShapes}
          onDrawEnd={() => {}}
        />
      </div>
    </div>
  );
}
