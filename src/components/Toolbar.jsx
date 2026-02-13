"use client";
import React from "react";
import {
  Pencil, Square, Circle, ArrowUpRight,
  Eraser, Type, Undo2, Redo2, MousePointer2, Minus
} from "lucide-react";

export default function Toolbar({
  currentTool, setTool, strokeColor, setStrokeColor,
  strokeWidth, setStrokeWidth, onUndo, onRedo, canUndo, canRedo
}) {
  const tools = [
    { id: "select", icon: MousePointer2 },
    { id: "pen", icon: Pencil },
    { id: "line", icon: Minus },
    { id: "rect", icon: Square },
    { id: "circle", icon: Circle },
    { id: "arrow", icon: ArrowUpRight },
    { id: "text", icon: Type },
    { id: "eraser", icon: Eraser },
  ];

  const toolbarStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#16a34a", // green background
    padding: "12px 16px",
    borderRadius: "24px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    border: "2px solid #15803d",
    height:"30px",
    zIndex: 50
  };

  const sectionDividerStyle = {
    width: "2px",
    height: "24px",
    backgroundColor: "#15803d",
  };

  const undoRedoButtonStyle = (disabled) => ({
    padding: "8px",
    borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    color: "white",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    transition: "all 0.2s",
    opacity: disabled ? 0.4 : 1,
  });

  const toolButtonStyle = (selected) => ({
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: selected ? "#15803d" : "#16a34a",
    color: "white",
    boxShadow: selected ? "0 0 15px rgba(34,197,94,0.7)" : "none",
    border: selected ? "2px solid #22c55e" : "2px solid transparent",
    transition: "all 0.2s",
  });

  const inputStyle = {
    width: "32px",
    height: "32px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
  };

  const rangeStyle = {
    width: "80px",
    cursor: "pointer",
  };

  return (
    <div style={toolbarStyle}>
      {/* Undo / Redo */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={undoRedoButtonStyle(!canUndo)} onClick={onUndo} disabled={!canUndo}>
          <Undo2 size={20} />
        </button>
        <button style={undoRedoButtonStyle(!canRedo)} onClick={onRedo} disabled={!canRedo}>
          <Redo2 size={20} />
        </button>
      </div>

      {/* Divider */}
      <div style={sectionDividerStyle} />

      {/* Tools */}
      <div style={{ display: "flex", gap: "8px" }}>
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
            style={toolButtonStyle(currentTool === t.id)}
          >
            <t.icon size={20} />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={sectionDividerStyle} />

      {/* Color + Width */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          style={inputStyle}
        />
        <input
          type="range"
          min="1"
          max="15"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(+e.target.value)}
          style={rangeStyle}
        />
      </div>
    </div>
  );
}
