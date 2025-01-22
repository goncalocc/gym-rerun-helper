import React from 'react';
import Image from 'next/image';

interface IconProps {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  nickname?: string;
}

const Icon: React.FC<IconProps> = React.memo(
  ({ name, size, width, height, nickname }) => {
    const src = `/icons/${name}.png`;

    // Determine final width and height, defaulting to size if neither is provided.
    const finalWidth = width;
    const finalHeight = height;

    return (
      <div className="flex items-center">
        <Image
          src={src}
          alt={name}
          width={70}
          height={70}
          className="object-contain"
          style={{ width: '50px', height: '50px' }}
        />
        {/* {nickname && (
          <span className="ml-2 text-xs text-gray-700">{nickname}</span>
        )} */}
      </div>
    );
  },
);

Icon.displayName = 'Icon';

export default Icon;
