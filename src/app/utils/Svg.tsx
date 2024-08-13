// components/Icon.js
import React, { Suspense } from 'react';

interface SvgProps {
  name: string;
  size?: string; // Use string for responsive sizing like '2rem', '5vw'
  color: string;
}

const Svg: React.FC<SvgProps> = React.memo(({ name, size = '2rem', color }) => {
  const IconComponent = React.lazy(async () => {
    const src = `/images/${name}.svg`;
    return {
      default: () => (
        <img 
          src={src} 
          alt={name} 
          style={{ width: size, height: size }} 
        />
      ),
    };
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IconComponent />
    </Suspense>
  );
});

export default Svg;
