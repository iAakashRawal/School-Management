'use client';

import React from 'react';
import { ColorfulSection, ColorAccent, ColorfulCard } from '@/components/ui/colorful-section';
import { GradientButton } from '@/components/ui/gradient-button';
import { StatsCard, StatsCardGrid } from '@/components/ui/stats-card';

export default function ColorfulUIExample() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-gradient-rainbow">Colorful UI Components</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">A showcase of colorful UI components for your school management system.</p>
      
      {/* Colorful Sections */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Colorful Sections</h2>
        <div className="space-y-4">
          <ColorfulSection variant="rainbow" fullHeight={false}>
            <h3 className="text-xl font-bold mb-2">Rainbow Section</h3>
            <p>This section has a rainbow gradient border.</p>
          </ColorfulSection>
          
          <ColorfulSection variant="sunset" fullHeight={false}>
            <h3 className="text-xl font-bold mb-2">Sunset Section</h3>
            <p>This section has a sunset gradient border.</p>
          </ColorfulSection>
          
          <ColorfulSection variant="ocean" fullHeight={false}>
            <h3 className="text-xl font-bold mb-2">Ocean Section</h3>
            <p>This section has an ocean gradient border.</p>
          </ColorfulSection>
          
          <ColorfulSection variant="forest" fullHeight={false}>
            <h3 className="text-xl font-bold mb-2">Forest Section</h3>
            <p>This section has a forest gradient border.</p>
          </ColorfulSection>
        </div>
      </section>
      
      {/* Gradient Text */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Gradient Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-3xl font-bold text-gradient-rainbow">Rainbow Text</h3>
            <h3 className="text-3xl font-bold text-gradient-sunset">Sunset Text</h3>
            <h3 className="text-3xl font-bold text-gradient-ocean">Ocean Text</h3>
            <h3 className="text-3xl font-bold text-gradient-forest">Forest Text</h3>
            <h3 className="text-3xl font-bold text-gradient-purple">Purple Text</h3>
          </div>
          <div>
            <div className="colorful-border mb-4">
              <div className="colorful-border-content">
                <h3 className="text-xl font-bold mb-2">Colorful Border</h3>
                <p>This box has a colorful border.</p>
              </div>
            </div>
            
            <div className="animated-border mb-4">
              <div className="colorful-border-content">
                <h3 className="text-xl font-bold mb-2">Animated Border</h3>
                <p>This box has an animated colorful border.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gradient Buttons */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Gradient Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <GradientButton variant="rainbow">Rainbow</GradientButton>
            <GradientButton variant="sunset">Sunset</GradientButton>
            <GradientButton variant="ocean">Ocean</GradientButton>
            <GradientButton variant="forest">Forest</GradientButton>
            <GradientButton variant="purple">Purple</GradientButton>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <GradientButton variant="rainbow" outline>Rainbow Outline</GradientButton>
            <GradientButton variant="sunset" outline>Sunset Outline</GradientButton>
            <GradientButton variant="ocean" outline>Ocean Outline</GradientButton>
            <GradientButton variant="forest" outline>Forest Outline</GradientButton>
            <GradientButton variant="purple" outline>Purple Outline</GradientButton>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <GradientButton variant="rainbow" size="sm">Small</GradientButton>
            <GradientButton variant="rainbow" size="md">Medium</GradientButton>
            <GradientButton variant="rainbow" size="lg">Large</GradientButton>
          </div>
        </div>
      </section>
      
      {/* Color Accents */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Color Accents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorAccent color="blue">
            <h3 className="text-lg font-medium mb-1">Blue Accent</h3>
            <p>This is a blue accent panel.</p>
          </ColorAccent>
          
          <ColorAccent color="green">
            <h3 className="text-lg font-medium mb-1">Green Accent</h3>
            <p>This is a green accent panel.</p>
          </ColorAccent>
          
          <ColorAccent color="red">
            <h3 className="text-lg font-medium mb-1">Red Accent</h3>
            <p>This is a red accent panel.</p>
          </ColorAccent>
          
          <ColorAccent color="yellow">
            <h3 className="text-lg font-medium mb-1">Yellow Accent</h3>
            <p>This is a yellow accent panel.</p>
          </ColorAccent>
        </div>
      </section>
      
      {/* Colorful Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Colorful Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorfulCard color="blue" title="Blue Card">
            <p>This is a blue card with a header.</p>
          </ColorfulCard>
          
          <ColorfulCard color="green" title="Green Card">
            <p>This is a green card with a header.</p>
          </ColorfulCard>
          
          <ColorfulCard color="purple" title="Purple Card">
            <p>This is a purple card with a header.</p>
          </ColorfulCard>
          
          <ColorfulCard color="orange" title="Orange Card">
            <p>This is an orange card with a header.</p>
          </ColorfulCard>
          
          <ColorfulCard color="pink" title="Pink Card">
            <p>This is a pink card with a header.</p>
          </ColorfulCard>
          
          <ColorfulCard color="teal" title="Teal Card">
            <p>This is a teal card with a header.</p>
          </ColorfulCard>
        </div>
      </section>
      
      {/* Stats Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Stats Cards</h2>
        <StatsCardGrid>
          <StatsCard 
            title="Total Students" 
            value="1,245" 
            color="blue"
            change={{ value: "5%", type: "increase" }}
          />
          
          <StatsCard 
            title="Teachers" 
            value="78" 
            color="green"
            change={{ value: "2", type: "increase" }}
          />
          
          <StatsCard 
            title="Attendance Rate" 
            value="96.5%" 
            color="purple"
            change={{ value: "0.5%", type: "decrease" }}
          />
          
          <StatsCard 
            title="Average Grade" 
            value="B+" 
            color="orange"
            change={{ value: "Same", type: "neutral" }}
          />
        </StatsCardGrid>
      </section>
    </div>
  );
} 