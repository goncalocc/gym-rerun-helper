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
    const src = `/images/${name}.svg`;

    return (
      <div className="flex items-center">
        <Image
          src={src}
          alt={name}
          width={width}
          height={height}
          className="object-contain"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
        {nickname && (
          <span className="ml-2 text-xs text-gray-700">{nickname}</span>
        )}
      </div>
    );
  },
);

export default Svg;
