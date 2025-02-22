import { PokemonItemsRoute } from '@/app/hooks/UseRouteAndTeamData';
import { Route, Teams } from '@/app/types/types';
import Icon from '@/app/utils/Icon';

interface LeadSummaryProps {
  nextGym: Route | undefined;
  assignedTeam: Teams | undefined;
  leadItems: PokemonItemsRoute;
}

const LeadSummary: React.FC<LeadSummaryProps> = ({
  nextGym,
  assignedTeam,
  leadItems,
}) => {
  let team = assignedTeam?.team.map(({ pokemon, nickname, item }) => ({
    pokemon,
    nickname,
    item,
  }));

  return (
    <>
      <div>Next Lead in {nextGym?.gym} Gym:</div>
      <div className="flex flex-row items-center space-x-4">
        {nextGym?.leads[0].pokemon.slice(0, 2).map((entries, index) => {
          const [nameOnly, nickname] = entries.split('(');
          const pokemonItem = leadItems.team?.find((member) => {
            if (typeof nickname === 'string') {
              return (
                member.nickname === nickname.replace(/\)$/, '') &&
                member.pokemon === nameOnly.trim()
              );
            }
            return member.pokemon === nameOnly.trim();
          });
          return (
            <div key={index} className="flex flex-col items-center 2xl:mx-6">
              <Icon
                key={index}
                name={nameOnly.toLowerCase()}
                width={60}
                height={60}
              />
              <div className="m-1 w-[80px] bg-white text-center text-[6px] text-black sm:w-[80px] sm:text-[8px] md:w-[80px] md:text-[10px] lg:w-[80px] lg:text-[12px]">
                {nickname ? nickname.replace(')', '') : nameOnly}
              </div>
              <div className="m-1 w-[80px] bg-white text-center text-[6px] text-black sm:w-[80px] sm:text-[8px] md:w-[80px] md:text-[10px] lg:w-[80px] lg:text-[12px]">
                {pokemonItem?.item ? pokemonItem.item : '--'}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LeadSummary;
