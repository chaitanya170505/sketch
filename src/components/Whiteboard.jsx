"use client";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow, Text } from "react-konva";

const Whiteboard = forwardRef(
  ({ currentTool, strokeColor, strokeWidth, bgFill, shapes, setShapes, onActionStart }, ref) => {
    const stageRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [pointerPos, setPointerPos] = useState(null);

    const getCursor = () => {
      if (currentTool === "select") return "move";
      if (currentTool === "eraser") return "not-allowed";
      if (currentTool === "text") return "text";
      return "crosshair";
    };

    useImperativeHandle(ref, () => ({
      download: () => {
        if (!stageRef.current) return;
        const dataURL = stageRef.current.toDataURL({
          pixelRatio: 2,
          backgroundColor: bgFill,
        });
        const link = document.createElement("a");
        link.download = `whiteboard-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
      },
    }));

    useEffect(() => {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth - 80,
          height: window.innerHeight - 180,
        });
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePointerDown = (e) => {
      // Prevent default browser behavior (scrolling/scrolling)
      if (e.evt && e.evt.cancelable) e.evt.preventDefault();

      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      if (!pos) return;

      setPointerPos(pos);

      if (currentTool === "select") return;

      if (onActionStart) onActionStart();

      if (currentTool === "text" && e.target.name() === "background") {
        const textInput = prompt("Enter text:");
        if (!textInput) return;

        const newShape = {
          id: `shape-${Date.now()}`,
          tool: "text",
          x: pos.x,
          y: pos.y,
          text: textInput,
          fontSize: 24,
          color: strokeColor,
        };
        setShapes([...shapes, newShape]);
        return;
      }

      setIsDrawing(true);

      const newShape = {
        id: `shape-${Date.now()}`,
        tool: currentTool,
        points: [pos.x, pos.y, pos.x, pos.y],
        color: currentTool === "eraser" ? bgFill : strokeColor,
        strokeWidth: currentTool === "eraser" ? strokeWidth * 6 : strokeWidth, // Fat eraser for touch
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      };

      setShapes([...shapes, newShape]);
    };

    const handlePointerMove = (e) => {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      if (!point) return;

      setPointerPos(point);

      if (!isDrawing) return;
      if (e.evt && e.evt.cancelable) e.evt.preventDefault();

      const updatedShapes = shapes.map((s, i) => {
        if (i !== shapes.length - 1) return s;
        const lastShape = { ...s };

        if (currentTool === "pen" || currentTool === "eraser") {
          lastShape.points = lastShape.points.concat([point.x, point.y]);
        } else if (currentTool === "line" || currentTool === "arrow") {
          lastShape.points = [lastShape.x, lastShape.y, point.x, point.y];
        } else if (currentTool === "rect" || currentTool === "circle") {
          lastShape.width = point.x - lastShape.x;
          lastShape.height = point.y - lastShape.y;
        }
        return lastShape;
      });

      setShapes(updatedShapes);
    };

    const handlePointerUp = () => {
      setIsDrawing(false);
    };

    const handleTextDrag = (e, id) => {
      const updatedShapes = shapes.map((shape) =>
        shape.id === id ? { ...shape, x: e.target.x(), y: e.target.y() } : shape
      );
      setShapes(updatedShapes);
    };

    return (
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4">
        {/* CSS to disable touch gestures while drawing */}
        <style jsx global>{`
          canvas {
            touch-action: none;
            -webkit-user-select: none;
            user-select: none;
          }
        `}</style>
        
        <div
          className="rounded-3xl transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: bgFill,
            boxShadow: "0 0 15px #535353, 0 0 10px #565656, 0 0 10px #676767",
          }}
        >
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={stageRef}
            className={getCursor()}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill={bgFill}
                name="background"
              />

              {shapes.map((shape) => {
                const commonProps = {
                  stroke: shape.color,
                  strokeWidth: shape.strokeWidth,
                  draggable: currentTool === "select" && shape.tool !== "text",
                  lineCap: "round",
                  lineJoin: "round",
                };

                if (shape.tool === "pen" || shape.tool === "eraser")
                  return <Line key={shape.id} {...commonProps} points={shape.points} tension={0.5} />;

                if (shape.tool === "line")
                  return <Line key={shape.id} {...commonProps} points={shape.points} />;

                if (shape.tool === "rect")
                  return <Rect key={shape.id} {...commonProps} x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;

                if (shape.tool === "circle") {
                  const radius = Math.sqrt(shape.width ** 2 + shape.height ** 2);
                  return <Circle key={shape.id} {...commonProps} x={shape.x} y={shape.y} radius={radius} />;
                }

                if (shape.tool === "arrow")
                  return <Arrow key={shape.id} {...commonProps} points={shape.points} fill={shape.color} pointerLength={10} pointerWidth={10} />;

                if (shape.tool === "text")
                  return <Text key={shape.id} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize} fill={shape.color} draggable onDragEnd={(e) => handleTextDrag(e, shape.id)} />;

                return null;
              })}

              {pointerPos && (currentTool === "pen" || currentTool === "eraser") && (
                <Circle
                  x={pointerPos.x}
                  y={pointerPos.y}
                  radius={currentTool === "eraser" ? (strokeWidth * 6) / 2 : strokeWidth / 2}
                  fill={currentTool === "eraser" ? "#e5e7eb" : strokeColor}
                  stroke={currentTool === "eraser" ? "#374151" : "none"}
                  strokeWidth={1}
                  opacity={0.6}
                  listening={false}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
);

export default Whiteboard;
