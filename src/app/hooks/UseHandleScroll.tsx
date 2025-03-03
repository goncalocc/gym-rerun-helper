import { useRef, useState } from 'react';
import { FilteredGym } from './UseRouteAndTeamData';

export type ScrollDirection = 'next' | 'previous';

const useHandleScroll = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = (route: FilteredGym[], direction: ScrollDirection) => {
    let closestIndex = 0;
    let minDistance = Infinity;

    const { current: elements } = elementsRef;
    const viewportCenter = window.innerHeight / 2;

    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      if (element !== null) {
        const elementTop = element.getBoundingClientRect().top;
        const distance = Math.abs(elementTop - viewportCenter);

        if (
          (direction === 'next' &&
            elementTop > viewportCenter &&
            distance < minDistance) ||
          (direction === 'previous' &&
            elementTop < viewportCenter &&
            distance < minDistance)
        ) {
          closestIndex = index;
          minDistance = distance;
        }
      }
    }

    const wrapIndex = (index: number, length: number) =>
      (index + length) % length;
    const newIndex =
      direction === 'next'
        ? wrapIndex(closestIndex, route.length)
        : wrapIndex(closestIndex - 1, route.length);

    setCurrentIndex(newIndex);
    return newIndex;
  };

  const handleNextGym = (route: FilteredGym[], direction: ScrollDirection) => {
    const nextIndex = handleScroll(route, direction);
    const nextElement = elementsRef.current[nextIndex];

    if (nextElement) {
      nextElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setCurrentIndex(nextIndex);
      }, 800);
    }
  };

  return {
    handleScroll,
    handleNextGym,
    elementsRef,
    currentIndex,
    setCurrentIndex,
  };
};

export default useHandleScroll;
