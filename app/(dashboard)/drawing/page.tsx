'use client';

import { useState } from 'react';
import { DrawingCanvas } from '@/components/ui/drawing-canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DrawingPage() {
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [activeTab, setActiveTab] = useState('canvas');
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const handlePresetBgColor = (color: string) => {
    setBackgroundColor(color);
  };

  const handlePresetLineColor = (color: string) => {
    setLineColor(color);
  };

  const bgColorPresets = [
    { color: '#ffffff', label: 'White' },
    { color: '#f0f0f0', label: 'Light Gray' },
    { color: '#e6f7ff', label: 'Light Blue' },
    { color: '#f5f0ff', label: 'Light Purple' },
    { color: '#fff8e6', label: 'Light Yellow' },
    { color: '#f0fff0', label: 'Light Green' },
  ];

  const lineColorPresets = [
    { color: '#000000', label: 'Black' },
    { color: '#ff0000', label: 'Red' },
    { color: '#0000ff', label: 'Blue' },
    { color: '#008000', label: 'Green' },
    { color: '#800080', label: 'Purple' },
    { color: '#ffa500', label: 'Orange' },
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Drawing Canvas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Canvas</CardTitle>
              <CardDescription>Draw anything you want on the canvas</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="canvas">Canvas</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="canvas">
                  <DrawingCanvas 
                    width={800}
                    height={500}
                    backgroundColor={backgroundColor}
                    lineColor={lineColor}
                    lineWidth={lineWidth}
                    onChange={setDataUrl}
                    className="mx-auto"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  {dataUrl ? (
                    <div className="flex justify-center">
                      <img 
                        src={dataUrl} 
                        alt="Drawing preview" 
                        className="border border-gray-300 rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[500px] border border-gray-300 rounded-md">
                      <p className="text-gray-500">No drawing to preview</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Canvas Settings</CardTitle>
              <CardDescription>Customize your drawing canvas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Color Settings */}
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="bgColor"
                    type="color" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="mt-2">
                  <Label className="mb-2 block text-sm">Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {bgColorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => handlePresetBgColor(preset.color)}
                        className="w-8 h-8 rounded-md border border-gray-300"
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Line Color Settings */}
              <div className="space-y-2">
                <Label htmlFor="lineColor">Line Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="lineColor"
                    type="color" 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    type="text" 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="mt-2">
                  <Label className="mb-2 block text-sm">Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {lineColorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => handlePresetLineColor(preset.color)}
                        className="w-8 h-8 rounded-md border border-gray-300"
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Line Width Settings */}
              <div className="space-y-2">
                <Label htmlFor="lineWidth">Line Width: {lineWidth}px</Label>
                <Input 
                  id="lineWidth"
                  type="range" 
                  min="1" 
                  max="20" 
                  value={lineWidth} 
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Download Button */}
              <div>
                <button
                  onClick={() => {
                    if (dataUrl) {
                      const link = document.createElement('a');
                      link.download = 'drawing.png';
                      link.href = dataUrl;
                      link.click();
                    }
                  }}
                  disabled={!dataUrl}
                  className="w-full py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Download Drawing
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 