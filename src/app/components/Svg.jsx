// components/Icon.js
import React, { Suspense } from 'react';

// const Icon = ({ name, size = 24, color = 'black' }) => {
//     // Dynamic import based on the name
//     const IconComponent = React.lazy(async () => (await import(`../../../public/icons/${name}.png`)));

const Svg = ({ name, size = 24 }) => {
    const IconComponent = React.lazy(async () => {
        const src = `/images/${name}.svg`;
        return {
            default: () => <img src={src} alt={name} width={size} height={size} />,
        };
    });

    return (
        <Suspense fallback={<div> </div>}>
            <IconComponent width={size} height={size} />
        </Suspense>
    );
};

export default Svg;