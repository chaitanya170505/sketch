"use client";
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
    { id: "line", icon: Minus }, // Added Line tool
    { id: "rect", icon: Square },
    { id: "circle", icon: Circle },
    { id: "arrow", icon: ArrowUpRight },
    { id: "text", icon: Type },
    { id: "eraser", icon: Eraser },
  ];

  return (
    <div className="
      flex items-center gap-2
      bg-white/95 backdrop-blur-md
      px-3 py-2
      rounded-2xl
      shadow-xl
      border border-gray-200
    ">
      {/* Undo / Redo */}
      <div className="flex gap-1 border-r border-gray-100 pr-2">
        <button
          disabled={!canUndo}
          onClick={onUndo}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
        >
          <Undo2 size={18} />
        </button>
        <button
          disabled={!canRedo}
          onClick={onRedo}
          className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Tools */}
      <div className="flex gap-1">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.id.charAt(0).toUpperCase() + t.id.slice(1)}
            className={`p-2.5 rounded-xl transition-all
              ${
                currentTool === t.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
          >
            <t.icon size={18} />
          </button>
        ))}
      </div>

      {/* Color + Width */}
      <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
          className="w-6 h-6 rounded-md cursor-pointer border-none"
        />
        <div className="flex flex-col">
          <input
            type="range"
            min="1"
            max="15"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(+e.target.value)}
            className="w-16 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}