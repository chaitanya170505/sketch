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
  const headerStyle = {
    position: "sticky",
    top: 0,
    width: "100%",
    backgroundColor: "#f4f7f4",
    zIndex: 50,
  };

  const containerStyle = {
    maxWidth: "1600px",
    margin: "0 auto",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoBoxStyle = {
    width: "48px",
    height: "48px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    padding: "4px",
  };

  const titleStyle = {
    color: "#01823b",
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "1px",
  };

  const slidesContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  // Reversed colors
  const slideButtonStyle = (isActive) => ({
    padding: "4px 12px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    backgroundColor: isActive ? "#15803d" : "#ffffff", // green if selected, white if not
    color: isActive ? "#ffffff" : "#16a34a",           // white text if selected, green if not
    border: "none",
    outline: "none",
    transition: "all 0.2s",
  });

  const addSlideButtonStyle = (disabled) => ({
    padding: "4px 12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "#d1d5db" : "#ffffff",
    color: disabled ? "#6b7280" : "#16a34a",
    border: "none",
    outline: "none",
    transition: "all 0.2s",
  });

  const downloadButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "#16a34a",
    padding: "6px 16px",
    borderRadius: "16px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* LOGO */}
        <div style={logoContainerStyle}>
          <div style={logoBoxStyle}>
            <Image
              src="/icon.png"
              alt="Manorekha Logo"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <span style={titleStyle}>Manorekha</span>
        </div>

        {/* SLIDES */}
        <div style={slidesContainerStyle}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              style={slideButtonStyle(index === activeSlide)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={onAddSlide}
            disabled={slides.length >= 15}
            style={addSlideButtonStyle(slides.length >= 15)}
          >
            <Plus size={16} />
            Add Slide
          </button>
        </div>

        {/* DOWNLOAD */}
        <button onClick={onDownload} style={downloadButtonStyle}>
          <Download size={18} />
          Download PNG
        </button>
      </div>
    </header>
  );
}
