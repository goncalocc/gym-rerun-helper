import React, { Suspense } from 'react';
import Image from 'next/image';

interface SvgProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  nickname?: string;
}

const Svg: React.FC<SvgProps> = React.memo(
  ({ name, size, width, height, nickname }) => {
    const SvgComponent = React.lazy(async () => {
      const src = `/images/${name}.svg`;

      // Determine final width and height, defaulting to size if neither is provided.
      const finalWidth = width;
      const finalHeight = height;

      return {
        default: () => (
          <div className="flex items-center">
            <Image
              src={src}
              alt={name}
              width={width}
              height={height}
              className="object-contain"
              style={{ width: `${width}px`, height: `${width}px` }}
            />
            {nickname && (
              <span className="ml-2 text-xs text-gray-700">{nickname}</span>
            )}
          </div>
        ),
      };
    });

    return (
      <Suspense fallback={<div> </div>}>
        <SvgComponent />
      </Suspense>
    );
  },
);

Svg.displayName = 'Svg';

export default Svg;
