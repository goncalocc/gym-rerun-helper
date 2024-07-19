// components/Icon.js
import React, { Suspense } from 'react';

interface SvgProps {
  name: string;
  size: number;
  color: string;
}

const Svg: React.FC<SvgProps> = React.memo(({ name, size = 24 }) => {
  const IconComponent = React.lazy(async () => {
    const src = `/images/${name}.svg`;
    return {
      default: () => <img src={src} alt={name} width={size} height={size} />,
    };
  });

  return (
    <Suspense fallback={<div> </div>}>
      <IconComponent />
    </Suspense>
  );
});

export default Svg;
