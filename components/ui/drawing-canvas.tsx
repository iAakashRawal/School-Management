'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  lineColor?: string;
  lineWidth?: number;
  className?: string;
  onChange?: (dataUrl: string) => void;
}

export function DrawingCanvas({
  width = 600,
  height = 400,
  backgroundColor = 'white',
  lineColor = 'black',
  lineWidth = 2,
  className,
  onChange,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [canvasContent, setCanvasContent] = useState<ImageData | null>(null);

  // Initialize canvas and set background color
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Fill with background color
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // If we have saved content, restore it after changing background
    if (canvasContent) {
      // Store current pixel data before applying background
      const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Apply the background
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Put saved content back
      context.putImageData(canvasContent, 0, 0);
    }

    // Notify parent component of changes
    if (onChange && canvas) {
      onChange(canvas.toDataURL());
    }
  }, [width, height, backgroundColor]);

  // Save canvas content when drawing
  const saveCanvasContent = () => {
    if (!canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    // Store current drawing
    setCanvasContent(context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
  };

  // Get canvas coordinates from mouse/touch event
  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Mouse event
    if ('clientX' in event) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    // Touch event
    else if (event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return null;
  };

  // Draw a line between two points
  const drawLine = (start: Point, end: Point) => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  // Handle drawing start
  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const point = getCoordinates(event);
    if (!point) return;

    setIsDrawing(true);
    setLastPoint(point);
  };

  // Handle drawing movement
  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint) return;

    const currentPoint = getCoordinates(event);
    if (!currentPoint) return;

    drawLine(lastPoint, currentPoint);
    setLastPoint(currentPoint);

    // Notify parent component of changes
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  // Handle drawing end
  const endDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    
    // Save the current state of the canvas
    saveCanvasContent();
  };

  // Clear the canvas
  const clearCanvas = () => {
    if (!canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Reset saved content
    setCanvasContent(null);

    // Notify parent component of changes
    if (onChange && canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-md touch-none"
        style={{ backgroundColor }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
} 