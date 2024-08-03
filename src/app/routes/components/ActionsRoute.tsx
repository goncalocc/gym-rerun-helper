import React from "react";
import { FilteredGym } from "./ViewRoute";
import Icon from "@/app/utils/Icon";
import { Variation, Leads } from "@/app/types/types";


export interface ActionsRouteProps {
    leads: Leads[];
    variation: Variation;
}

const ActionsRoute: React.FC<ActionsRouteProps> = ({leads, variation}) => {
    return(
        <div className="text-box ml-4 w-[40rem] flex-shrink-0 rounded-lg bg-gray-800 p-2 text-white shadow">
        {leads
          ?.filter(
            (lead) =>
              lead.variationId === variation.variationId,
          )
          .map((lead) => (
            <div className="flex flex-row items-center space-x-4">
              <div className="flex">
                {lead.pokemon
                  .slice(0, 2)
                  .map((member, index) => {
                    // Split the name and take the first part
                    const [nameOnly, nickname] =
                      member.split(' (');
                    return (
                      <React.Fragment key={index}>
                        <div className="">
                          <Icon
                            name={nameOnly}
                            size={50}
                            color="brown"
                            nickname={
                              nickname
                                ? nickname.replace(')', '')
                                : ''
                            }
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
              {lead.pokemon.length > 2 && (
                <span className="mx-2 items-center text-[18px] leading-[-30px]">
                  +
                </span>
              )}
              {lead.pokemon.length > 2 && (
                <div className="flex">
                  {lead.pokemon
                    .slice(2, lead.pokemon.length)
                    .map((member, index) => {
                      const [nameOnly, nickname] =
                        member.split(' (');
                      return (
                        <React.Fragment key={index}>
                          <div className="">
                            <Icon
                              name={nameOnly}
                              size={50}
                              color="brown"
                              nickname={
                                nickname
                                  ? nickname.replace(')', '')
                                  : ''
                              }
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
          ?.filter(
            (lead) =>
              lead.variationId === variation.variationId,
          )
          .map((lead, index) => (
            <p key={index}>{lead.attacks}</p>
          ))}
      </div>
    );
}

export default ActionsRoute;
