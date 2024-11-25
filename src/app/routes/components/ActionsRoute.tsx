import React from 'react';
import { FilteredGym } from './ViewRoute';
import Icon from '@/app/utils/Icon';
import { Variation, Leads } from '@/app/types/types';

export interface ActionsRouteProps {
  leads: Leads[];
  variation: Variation;
}

const ActionsRoute: React.FC<ActionsRouteProps> = ({ leads, variation }) => {
  return (
    <div className="w-full rounded-lg bg-gray-800 text-white shadow">
      {leads
        ?.filter((lead) => lead.variationId === variation.variationId)
        .map((lead) => (
          <div
            className="flex flex-row items-center justify-center"
            key={lead.variationId}
          >
            <div className="flex">
              {lead.pokemon.slice(0, 2).map((member, index) => {
                // Split the name and take the first part
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
            {lead.pokemon.length > 2 && <div className="items-center">+</div>}
            {lead.pokemon.length > 2 && (
              <div className="flex justify-center">
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
          <div key={lead.variationId} className="text-box mt-2">
            {lead.attacks}
          </div>
        ))}
    </div>
  );
};

export default ActionsRoute;
