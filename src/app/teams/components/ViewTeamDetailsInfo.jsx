const ViewTeamDetailsInfo = ({ team: team }) => {
  return (
    <main>
      <div className="grid grid-cols-2 gap-4 rounded-md bg-zinc-600 p-4">
        {team.team.map((members, index) => (
          <ul key={index}>
            <li>
              {members.pokemon} {members.item ? `@${members.item}` : ''}
            </li>
            <li>Ability: {members.ability ? members.ability : 'Any'}</li>
            <li>Nature: {members.nature ? members.nature : 'Any'}</li>
            <li>
              IVs: HP: {members.ivs.hp ? members.ivs.hp : 'X'}/ Atk:{' '}
              {members.ivs.attack ? members.ivs.attack : 'X'}/ Def:{' '}
              {members.ivs.defense ? members.ivs.defense : 'X'}/ SpAtk:{' '}
              {members.ivs.specialAttack ? members.ivs.specialAttack : 'X'}/
              SpDef:{' '}
              {members.ivs.specialDefense ? members.ivs.specialDefense : 'X'}/
              Spd: {members.ivs.speed ? members.ivs.speed : 'X'}
            </li>
            <li>
              EVs:
              {members.evs.hp ? ` HP: ${members.evs.hp}/` : ''}
              {members.evs.attack ? ` Atk: ${members.evs.attack}/` : ''}
              {members.evs.defense ? ` Def: ${members.evs.defense}/` : ''}
              {members.evs.specialAttack
                ? ` SpAtk: ${members.evs.specialAttack}/`
                : ''}
              {members.evs.specialDefense
                ? ` Spdef: ${members.evs.specialDefense}/`
                : ''}
              {members.evs.speed ? ` Spd: ${members.evs.speed}/` : ''}
            </li>
            {members.moveset.map((move, index) => (
              <li key={index}>- {move}</li>
            ))}
          </ul>
        ))}
        {Array.isArray(team.subteam) && team.subteam.length
          ? team.subteam.map((members, index) => 
            <ul key={index}>
          <li>
            {members.pokemon} {members.item ? `@${members.item}` : ''}
          </li>
          <li>Ability: {members.ability ? members.ability : 'Any'}</li>
          <li>Nature: {members.nature ? members.nature : 'Any'}</li>
          <li>
            IVs: HP: {members.ivs.hp ? members.ivs.hp : 'X'}/ Atk:{' '}
            {members.ivs.attack ? members.ivs.attack : 'X'}/ Def:{' '}
            {members.ivs.defense ? members.ivs.defense : 'X'}/ SpAtk:{' '}
            {members.ivs.specialAttack ? members.ivs.specialAttack : 'X'}/
            SpDef:{' '}
            {members.ivs.specialDefense ? members.ivs.specialDefense : 'X'}/
            Spd: {members.ivs.speed ? members.ivs.speed : 'X'}
          </li>
          <li>
            EVs:
            {members.evs.hp ? ` HP: ${members.evs.hp}/` : ''}
            {members.evs.attack ? ` Atk: ${members.evs.attack}/` : ''}
            {members.evs.defense ? ` Def: ${members.evs.defense}/` : ''}
            {members.evs.specialAttack
              ? ` SpAtk: ${members.evs.specialAttack}/`
              : ''}
            {members.evs.specialDefense
              ? ` Spdef: ${members.evs.specialDefense}/`
              : ''}
            {members.evs.speed ? ` Spd: ${members.evs.speed}/` : ''}
          </li>
          {members.moveset.map((move, index) => (
            <li key={index}>- {move}</li>
          ))}
        </ul>
          )
          : null}
      </div>
    </main>
  );
};

export default ViewTeamDetailsInfo;
