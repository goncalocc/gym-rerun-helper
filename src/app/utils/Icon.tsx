// components/Icon.js
import React, { Suspense } from 'react';

interface IconProps {
  name: string;
  size: number;
  color: string;
}

const Icon: React.FC<IconProps> = React.memo(({ name, size = 24 }) => {
  const IconComponent = React.lazy(async () => {
    const src = `/icons/${name}.png`;
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

export default Icon;
