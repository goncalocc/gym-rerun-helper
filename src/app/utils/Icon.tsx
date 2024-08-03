// components/Icon.js
import React, { Suspense } from 'react';

interface IconProps {
  name: string;
  size: number;
  color: string;
  nickname?: string;
}

const Icon: React.FC<IconProps> = React.memo(
  ({ name, size = 24, nickname }) => {
    const IconComponent = React.lazy(async () => {
      const src = `/icons/${name}.png`;
      return {
        default: () => (
          <div className="flex">
            <img
              src={src}
              alt={name}
              width={size}
              height={size}
              className=""
            />
            {nickname && (
              <span className="text-xs relative top-6">{nickname}</span>
            )}
          </div>
        ),
      };
    });

    return (
      <Suspense fallback={<div> </div>}>
        <IconComponent />
      </Suspense>
    );
  },
);

export default Icon;
