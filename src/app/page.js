"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import Footer from "@/components/Footer";

const Whiteboard = dynamic(() => import("@/components/Whiteboard"), { ssr: false });

export default function WhiteboardApp() {
  const whiteboardRef = useRef(null);

  const [slides, setSlides] = useState([
    { id: Date.now(), shapes: [], undoStack: [], redoStack: [], bg: "#ffffff" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#166534");
  const [width, setWidth] = useState(3);

  const currentSlide = slides[activeSlide];

  const updateShapes = (newShapes) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[activeSlide] = { ...updated[activeSlide], shapes: [...newShapes] };
      return updated;
    });
  };

  // Push undo BEFORE drawing new action
  const pushUndo = () => {
    setSlides((prev) => {
      const updated = [...prev];
      const slide = { ...updated[activeSlide] };
      slide.undoStack = slide.undoStack || [];
      slide.redoStack = slide.redoStack || [];

      slide.undoStack.push(JSON.parse(JSON.stringify(slide.shapes)));
      slide.redoStack = [];

      updated[activeSlide] = slide;
      return updated;
    });
  };

  const handleUndo = () => {
    setSlides((prev) => {
      const updated = [...prev];
      const slide = { ...updated[activeSlide] };
      if (!slide.undoStack || slide.undoStack.length === 0) return prev;

      slide.redoStack = slide.redoStack || [];
      slide.redoStack.push(JSON.parse(JSON.stringify(slide.shapes)));

      slide.shapes = slide.undoStack.pop();

      updated[activeSlide] = slide;
      return updated;
    });
  };

  const handleRedo = () => {
    setSlides((prev) => {
      const updated = [...prev];
      const slide = { ...updated[activeSlide] };
      if (!slide.redoStack || slide.redoStack.length === 0) return prev;

      slide.undoStack = slide.undoStack || [];
      slide.undoStack.push(JSON.parse(JSON.stringify(slide.shapes)));

      slide.shapes = slide.redoStack.pop();

      updated[activeSlide] = slide;
      return updated;
    });
  };

  const handleAddSlide = () => {
    if (slides.length >= 15) {
      alert("Maximum of 15 slides allowed");
      return;
    }

    setSlides((prev) => [
      ...prev,
      { id: Date.now(), shapes: [], undoStack: [], redoStack: [], bg: "#ffffff" },
    ]);
    setActiveSlide(slides.length);
  };

  const handleDownload = () => {
    whiteboardRef.current?.download();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        handleUndo();
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        handleRedo();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides, activeSlide]);

  return (
    <div className="h-screen w-full flex flex-col bg-green-700">
      <Header
        onDownload={handleDownload}
        slides={slides}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        onAddSlide={handleAddSlide}
      />

      <div className="flex justify-center py-2 bg-[#f4f7f4]">
  <Toolbar
    currentTool={tool}
    setTool={setTool}
    strokeColor={color}
    setStrokeColor={setColor}
    strokeWidth={width}
    setStrokeWidth={setWidth}
    onUndo={handleUndo}
    onRedo={handleRedo}
    canUndo={currentSlide.undoStack.length > 0}
    canRedo={currentSlide.redoStack.length > 0}
  />
</div>


      <main className="flex-1 overflow-auto p-6 lg:p-10">
        <div className="w-full h-full max-w-[1600px] mx-auto flex items-center justify-center">
          <Whiteboard
            ref={whiteboardRef}
            currentTool={tool}
            strokeColor={color}
            strokeWidth={width}
            bgFill={currentSlide.bg}
            shapes={currentSlide.shapes}
            setShapes={updateShapes}
            onActionStart={pushUndo} // push BEFORE drawing starts
          />
        </div>
      </main>

    </div>
  );
}
