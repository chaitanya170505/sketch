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
      switch (currentTool) {
        case "pen":
        case "line":
          return "crosshair";
        case "eraser":
          return "not-allowed";
        case "rect":
          return "cell";
        case "circle":
          return "zoom-in";
        case "arrow":
          return "alias";
        case "select":
          return "move";
        case "text":
          return "text";
        default:
          return "default";
      }
    };

    useImperativeHandle(ref, () => ({
      download: () => {
        if (!stageRef.current) return;
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2, backgroundColor: bgFill });
        const link = document.createElement("a");
        link.download = `slide-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
      },
    }));

    // Resize Stage
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

    const handleMouseDown = (e) => {
      const stage = stageRef.current;
      const pos = stage.getPointerPosition();
      setPointerPos(pos);

      if (currentTool === "select") return;

      // Call undo push BEFORE starting new action
      if (onActionStart) onActionStart();

      // Text tool
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
        strokeWidth,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      };

      setShapes([...shapes, newShape]);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing) return;
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      setPointerPos(point);

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

    const handleMouseUp = () => {
      if (isDrawing) setIsDrawing(false);
    };

    const handleTextDrag = (e, id) => {
      const updatedShapes = shapes.map((shape) =>
        shape.id === id ? { ...shape, x: e.target.x(), y: e.target.y() } : shape
      );
      setShapes(updatedShapes);
    };

    return (
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4">
        <div
          className="rounded-3xl shadow-2xl border-4 transition-all duration-200 overflow-hidden"
          style={{ backgroundColor: bgFill, borderColor: "#22c55e" }}
        >
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
                  shadowBlur: 0,
                  shadowColor: shape.color,
                };

                if (shape.tool === "pen" || shape.tool === "eraser")
                  return <Line key={shape.id} {...commonProps} points={shape.points} tension={0.5} />;
                if (shape.tool === "line") return <Line key={shape.id} {...commonProps} points={shape.points} />;
                if (shape.tool === "rect")
                  return <Rect key={shape.id} {...commonProps} x={shape.x} y={shape.y} width={shape.width} height={shape.height} />;
                if (shape.tool === "circle") {
                  const radius = Math.sqrt(shape.width ** 2 + shape.height ** 2);
                  return <Circle key={shape.id} {...commonProps} x={shape.x} y={shape.y} radius={radius} />;
                }
                if (shape.tool === "arrow")
                  return <Arrow key={shape.id} {...commonProps} points={shape.points} fill={shape.color} pointerLength={10} pointerWidth={10} />;
                if (shape.tool === "text")
                  return (
                    <Text
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      text={shape.text}
                      fontSize={shape.fontSize}
                      fill={shape.color}
                      draggable
                      onDragEnd={(e) => handleTextDrag(e, shape.id)}
                    />
                  );
                return null;
              })}

              {pointerPos && (currentTool === "pen" || currentTool === "eraser") && (
                <Circle
                  x={pointerPos.x}
                  y={pointerPos.y}
                  radius={strokeWidth / 2}
                  fill={currentTool === "eraser" ? bgFill : strokeColor}
                  opacity={0.5}
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
