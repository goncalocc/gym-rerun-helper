import { useState } from 'react';
import { GymsByRegion } from '@/app/hooks/UseRouteAndTeamData';

export interface BookmarksRouteProps {
  gymsByRegion: GymsByRegion;
}

const BookmarksRoute: React.FC<BookmarksRouteProps> = ({ gymsByRegion }) => {
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [activeGym, setActiveGym] = useState<number | null>(null);

  const handleClickRegion = (index: number) => {
    setSelectedRegion(selectedRegion === index ? null : index);
  };

  const handleClickGym = (gymId: number) => {
    setActiveGym(gymId);
    const gymElement = document.getElementById(gymId.toString());
    if (gymElement) {
      gymElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bookmarks-container cursor-pointer">
      <ol className="rounded-lg bg-gray-800 p-2">
        {Object.keys(gymsByRegion).map((region, regionIndex) => (
          <li
            key={regionIndex}
            className="rounded px-4 py-2 hover:bg-gray-700"
            onClick={() => handleClickRegion(regionIndex)}
          >
            {regionIndex + 1}. {region}
            {selectedRegion === regionIndex && (
              <ol className="">
                {gymsByRegion[region].map((gym, gymIndex) => (
                  <li
                    key={gymIndex}
                    className="rounded px-4 py-2 hover:bg-gray-700"
                    onClick={() => handleClickGym(gym.id)}
                  >
                    {gymIndex + 1}. {gym.gym}
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
export default BookmarksRoute;
