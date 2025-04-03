'use client';

import { useState, useEffect } from 'react';
import { DrawingCanvas } from '@/components/ui/drawing-canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme as useNextTheme } from 'next-themes';
import { useTheme, colorSchemeMap } from '@/components/providers/theme-provider';

export default function DrawingPage() {
  const { theme, systemTheme } = useNextTheme();
  const { colorScheme, sidebarColor, setSidebarColor } = useTheme();
  const [backgroundColor, setBackgroundColor] = useState('#262626');
  const [lineColor, setLineColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(2);
  const [activeTab, setActiveTab] = useState('canvas');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check if dark mode is active
  const isDarkMode = () => {
    if (!mounted) return false;
    return theme === 'dark' || 
      (theme === 'system' && systemTheme === 'dark');
  };

  // Wait for theme to be available before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always use sidebar color for background regardless of theme
  useEffect(() => {
    if (mounted) {
      // Get sidebar color
      setBackgroundColor(sidebarColor);
      
      // Set appropriate line color for contrast
      if (isDarkMode()) {
        setLineColor('#ffffff');
      } else {
        setLineColor('#ffffff');
      }
    }
  }, [theme, mounted, sidebarColor, systemTheme]);

  const handlePresetBgColor = (color: string) => {
    setBackgroundColor(color);
    // Update sidebar color when background color changes
    setSidebarColor(color);
  };

  const handlePresetLineColor = (color: string) => {
    setLineColor(color);
  };

  // Reset to color scheme color
  const handleResetToColorScheme = () => {
    if (colorScheme) {
      // Get the color from the color scheme based on current mode
      const dark = isDarkMode();
      if (colorSchemeMap[colorScheme as keyof typeof colorSchemeMap]) {
        const schemeColors = colorSchemeMap[colorScheme as keyof typeof colorSchemeMap];
        const newColor = dark ? schemeColors.dark : schemeColors.light;
        setBackgroundColor(newColor);
        setSidebarColor(newColor);
      }
    }
  };

  // Get current color scheme color
  const getCurrentSchemeColor = () => {
    if (colorScheme && colorSchemeMap[colorScheme as keyof typeof colorSchemeMap]) {
      return isDarkMode() 
        ? colorSchemeMap[colorScheme as keyof typeof colorSchemeMap].dark 
        : colorSchemeMap[colorScheme as keyof typeof colorSchemeMap].light;
    }
    return '#3b82f6'; // Fallback blue
  };

  // Color scheme preset button
  const ColorSchemeButton = ({ scheme, label }: { scheme: string, label: string }) => {
    const color = colorSchemeMap[scheme as keyof typeof colorSchemeMap]?.[isDarkMode() ? 'dark' : 'light'] || '#3b82f6';
    
    return (
      <button
        onClick={() => {
          const newColor = color;
          setBackgroundColor(newColor);
          setSidebarColor(newColor);
        }}
        className="flex flex-col items-center space-y-1"
        title={`${label} ${isDarkMode() ? '(Dark)' : '(Light)'}`}
      >
        <div 
          className="w-8 h-8 rounded-md"
          style={{ 
            backgroundColor: color,
            border: `1px solid ${getTextColor(backgroundColor) === '#ffffff' ? '#4b5563' : '#d1d5db'}`,
            outline: backgroundColor === color ? `2px solid ${getTextColor(backgroundColor) === '#ffffff' ? '#ffffff' : '#000000'}` : 'none',
            outlineOffset: 1
          }}
        />
        <span className="text-xs" style={{ color: getTextColor(backgroundColor) }}>{label}</span>
      </button>
    );
  };
  
  // Custom color presets
  const customColorPresets = [
    { color: '#262626', label: 'Neutral 800' }, // neutral-800 (keeping as requested)
    { color: '#171717', label: 'Neutral 900' }, // neutral-900
    { color: '#404040', label: 'Neutral 700' }, // neutral-700
    { color: '#525252', label: 'Neutral 600' }, // neutral-600
    { color: '#27272a', label: 'Zinc 800' },    // zinc-800
    { color: '#1f2937', label: 'Gray 800' },    // gray-800
    { color: '#1e293b', label: 'Slate 800' },   // slate-800
    { color: '#292524', label: 'Stone 800' },   // stone-800
    { color: '#2e1065', label: 'Purple 950' },  // purple-950
    { color: '#4c1d95', label: 'Purple 900' },  // purple-900
    { color: '#172554', label: 'Blue 950' },    // blue-950
    { color: '#1e3a8a', label: 'Blue 900' },    // blue-900
    { color: '#0f172a', label: 'Slate 950' },   // slate-950
    { color: '#0c4a6e', label: 'Sky 900' },     // sky-900
    { color: '#701a75', label: 'Pink 900' },    // pink-900
    { color: '#7f1d1d', label: 'Red 900' },     // red-900
    { color: '#713f12', label: 'Amber 900' },   // amber-900
    { color: '#3f6212', label: 'Lime 900' },    // lime-900
    { color: '#14532d', label: 'Green 900' },   // green-900
    { color: '#134e4a', label: 'Teal 900' },    // teal-900
  ];

  const lineColorPresets = [
    { color: '#ffffff', label: 'White' },
    { color: '#d4d4d4', label: 'Gray 300' },
    { color: '#ff0000', label: 'Red' },
    { color: '#3b82f6', label: 'Blue 500' },
    { color: '#22c55e', label: 'Green 500' },
    { color: '#a855f7', label: 'Purple 500' },
    { color: '#f59e0b', label: 'Amber 500' },
    { color: '#06b6d4', label: 'Cyan 500' },
  ];

  // Function to determine text color based on background brightness
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // Calculate brightness (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark backgrounds, black for light backgrounds
    return brightness < 128 ? '#ffffff' : '#000000';
  };

  const textColor = getTextColor(backgroundColor);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Drawing Canvas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-neutral-700" style={{ backgroundColor }}>
            <CardHeader>
              <CardTitle style={{ color: textColor }}>Canvas</CardTitle>
              <CardDescription style={{ color: textColor === '#ffffff' ? '#d4d4d4' : '#666666' }}>
                Draw anything you want on the canvas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4" style={{ backgroundColor: `${backgroundColor}e0` }}>
                  <TabsTrigger 
                    value="canvas" 
                    className="data-[state=active]:bg-opacity-50" 
                    style={{ 
                      color: textColor,
                      backgroundColor: activeTab === 'canvas' ? `${backgroundColor}80` : 'transparent' 
                    }}
                  >
                    Canvas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="data-[state=active]:bg-opacity-50"
                    style={{ 
                      color: textColor,
                      backgroundColor: activeTab === 'preview' ? `${backgroundColor}80` : 'transparent' 
                    }}
                  >
                    Preview
                  </TabsTrigger>
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
                        className="rounded-md"
                        style={{ border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}` }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="flex justify-center items-center h-[500px] rounded-md"
                      style={{ 
                        border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}`,
                        color: textColor === '#ffffff' ? '#9ca3af' : '#6b7280'
                      }}
                    >
                      <p>No drawing to preview</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border-neutral-700" style={{ backgroundColor }}>
            <CardHeader>
              <CardTitle style={{ color: textColor }}>Canvas Settings</CardTitle>
              <CardDescription style={{ color: textColor === '#ffffff' ? '#d4d4d4' : '#666666' }}>
                Customize your drawing canvas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Scheme Colors */}
              <div className="space-y-2">
                <Label className="block text-md font-medium" style={{ color: textColor }}>
                  Color Scheme Colors
                </Label>
                <p className="text-sm mb-3" style={{ color: textColor === '#ffffff' ? '#d4d4d4' : '#666666' }}>
                  These colors match your selected color scheme ({colorScheme})
                </p>
                
                <div className="mb-2">
                  <Input
                    type="text"
                    placeholder="Search color schemes..."
                    className="w-full text-sm rounded-md bg-opacity-30"
                    style={{ 
                      backgroundColor: `${backgroundColor}80`, 
                      color: textColor, 
                      borderColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db' 
                    }}
                    onChange={(e) => {
                      const searchPanel = document.getElementById('drawing-color-scheme-panel');
                      if (searchPanel) {
                        const buttons = searchPanel.querySelectorAll('button');
                        const searchTerm = e.target.value.toLowerCase();
                        
                        buttons.forEach((button) => {
                          const parent = button.parentElement?.parentElement;
                          if (parent) {
                            const schemeName = button.getAttribute('title')?.toLowerCase() || '';
                            if (schemeName.includes(searchTerm) || searchTerm === '') {
                              parent.classList.remove('hidden');
                            } else {
                              parent.classList.add('hidden');
                            }
                          }
                        });
                      }
                    }}
                  />
                </div>
                
                <div 
                  id="drawing-color-scheme-panel"
                  className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 rounded-md"
                  style={{ 
                    backgroundColor: `${backgroundColor}60`,
                    border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}`,
                  }}
                >
                  {Object.entries(colorSchemeMap).map(([scheme, _]) => (
                    <div key={scheme} className="flex flex-col items-center space-y-1">
                      <ColorSchemeButton scheme={scheme} label={scheme.charAt(0).toUpperCase() + scheme.slice(1)} />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleResetToColorScheme}
                    className="px-3 py-1 rounded-md text-sm"
                    style={{ 
                      backgroundColor: getCurrentSchemeColor(),
                      color: getTextColor(getCurrentSchemeColor()),
                      border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}`
                    }}
                  >
                    Reset to Theme Color
                  </button>
                </div>
              </div>

              {/* Background Color Settings */}
              <div className="space-y-2">
                <Label htmlFor="bgColor" style={{ color: textColor }}>Background Color (Changes Sidebar)</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="bgColor"
                    type="color" 
                    value={backgroundColor} 
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setSidebarColor(e.target.value);
                    }}
                    className="w-12 h-10 p-1"
                    style={{ 
                      backgroundColor: backgroundColor === '#ffffff' ? '#f3f4f6' : '#374151',
                      borderColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db'
                    }}
                  />
                  <Input 
                    type="text" 
                    value={backgroundColor} 
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setSidebarColor(e.target.value);
                    }}
                    className="flex-1"
                    style={{ 
                      backgroundColor: backgroundColor === '#ffffff' ? '#f3f4f6' : '#374151',
                      borderColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db',
                      color: textColor
                    }}
                  />
                </div>
                
                <div className="mt-2">
                  <Label className="mb-2 block text-sm" style={{ color: textColor }}>Custom Color Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {customColorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => handlePresetBgColor(preset.color)}
                        className="w-8 h-8 rounded-md"
                        style={{ 
                          backgroundColor: preset.color,
                          border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}`,
                          outline: backgroundColor === preset.color ? `2px solid ${textColor === '#ffffff' ? '#ffffff' : '#000000'}` : 'none',
                          outlineOffset: 1
                        }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Line Color Settings */}
              <div className="space-y-2">
                <Label htmlFor="lineColor" style={{ color: textColor }}>Line Color</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="lineColor"
                    type="color" 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-12 h-10 p-1"
                    style={{ 
                      backgroundColor: backgroundColor === '#ffffff' ? '#f3f4f6' : '#374151',
                      borderColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db'
                    }}
                  />
                  <Input 
                    type="text" 
                    value={lineColor} 
                    onChange={(e) => setLineColor(e.target.value)}
                    className="flex-1"
                    style={{ 
                      backgroundColor: backgroundColor === '#ffffff' ? '#f3f4f6' : '#374151',
                      borderColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db',
                      color: textColor 
                    }}
                  />
                </div>
                
                <div className="mt-2">
                  <Label className="mb-2 block text-sm" style={{ color: textColor }}>Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {lineColorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => handlePresetLineColor(preset.color)}
                        className="w-8 h-8 rounded-md"
                        style={{ 
                          backgroundColor: preset.color,
                          border: `1px solid ${textColor === '#ffffff' ? '#4b5563' : '#d1d5db'}`,
                          outline: lineColor === preset.color ? `2px solid ${textColor === '#ffffff' ? '#ffffff' : '#000000'}` : 'none',
                          outlineOffset: 1
                        }}
                        title={preset.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Line Width Settings */}
              <div className="space-y-2">
                <Label htmlFor="lineWidth" style={{ color: textColor }}>Line Width: {lineWidth}px</Label>
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
              
              {/* Reset and Download Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => {
                    // Reset to sidebar neutral-800 color
                    const defaultColor = '#262626';
                    setBackgroundColor(defaultColor);
                    setSidebarColor(defaultColor);
                  }}
                  className="w-full py-2 rounded-md hover:bg-opacity-80 transition-colors"
                  style={{ 
                    backgroundColor: textColor === '#ffffff' ? '#4b5563' : '#d1d5db',
                    color: textColor === '#ffffff' ? '#ffffff' : '#000000' 
                  }}
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleResetToColorScheme}
                  className="w-full py-2 rounded-md hover:bg-opacity-80 transition-colors"
                  style={{ 
                    backgroundColor: getCurrentSchemeColor(),
                    color: '#ffffff' 
                  }}
                >
                  Use Color Scheme
                </button>
              </div>
              
              {/* Current Color Scheme */}
              <div className="mb-4">
                <p className="text-sm mb-2" style={{ color: textColor }}>
                  Current Color Scheme: <span className="font-semibold">{colorScheme}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: textColor }}>Color:</span>
                  <div 
                    className="w-6 h-6 rounded-md"
                    style={{ backgroundColor: getCurrentSchemeColor() }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
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
                  className="w-full py-2 rounded-md hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: '#3b82f6',
                    color: '#ffffff' 
                  }}
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