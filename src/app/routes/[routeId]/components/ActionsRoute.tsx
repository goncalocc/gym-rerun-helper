import React from 'react';
import Icon from '@/app/utils/Icon';
import { Variation, Leads } from '@/app/types/types';

export interface ActionsRouteProps {
  leads: Leads[];
  variation: Variation;
}

const ActionsRoute: React.FC<ActionsRouteProps> = ({ leads, variation }) => {
  return (
    <div>
      {leads
        ?.filter((lead) => lead.variationId === variation.variationId)
        .map((lead) => (
          <div className="flex flex-row justify-center" key={lead.variationId}>
            <div className="grid grid-cols-2 gap-x-2">
              {lead.pokemon.slice(0, 2).map((member, index) => {
                // Split the name and take the first part
                const [nameOnly, nickname] = member.split('(');
                return (
                  <React.Fragment key={`${lead.variationId}-${index}`}>
                    <div className="flex flex-col items-center space-y-2">
                      {/* Icon Section */}
                      <Icon
                        name={nameOnly.toLowerCase()}
                        width={60}
                        height={60}
                        nickname={nickname ? nickname.replace(')', '') : ''}
                      />
                      {/* Slot Section */}
                      {lead.isOrderMandatory && (
                        <div className="w-[60px] bg-white text-center text-[6px] text-black sm:w-[60px] sm:text-[8px] md:w-[60px] md:text-[10px] lg:w-[60px] lg:text-[12px]">
                          {index + 1} slot
                        </div>
                      )}
                      {/* Nickname Section */}
                      {nickname && (
                        <div className="w-[60px] bg-white text-center text-[6px] text-black sm:w-[60px] sm:text-[8px] md:w-[60px] md:text-[10px] lg:w-[60px] lg:text-[12px]">
                          {nickname.replace(')', '')}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {lead.pokemon.length > 2 && <div className="p-4">+</div>}
            {lead.pokemon.length > 2 && (
              <div className="flex">
                {lead.pokemon
                  .slice(2, lead.pokemon.length)
                  .map((member, index) => {
                    const [nameOnly, nickname] = member.split('(');
                    return (
                      <React.Fragment key={`${lead.variationId}-${index}`}>
                        <div className="">
                          <Icon
                            name={nameOnly.toLowerCase()}
                            width={60}
                            height={60}
                            nickname={nickname ? nickname.replace(')', '') : ''}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
            )}
          </div>
        ))}
      {leads
        ?.filter((lead) => lead.variationId === variation.variationId)
        .map((lead) => (
          <div
            key={lead.variationId}
            className="text-box mt-2 whitespace-pre-line"
          >
            {lead.attacks}
          </div>
        ))}
    </div>
  );
};

export default ActionsRoute;
