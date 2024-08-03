const movesData = [
  'Acid',
  'Acid Armor',
  'Acrobatics',
  'Acupressure',
  'Aerial Ace',
  'Aeroblast',
  'After You',
  'Agility',
  'Air Cutter',
  'Air Slash',
  'Ally Switch',
  'Amnesia',
  'Anchor Shot',
  'Ancient Power',
  'Aqua Jet',
  'Aqua Ring',
  'Aqua Tail',
  'Arm Thrust',
  'Aromatherapy',
  'Aromatic Mist',
  'Assist',
  'Assurance',
  'Astonish',
  'Attack Order',
  'Aura Sphere',
  'Aurora Beam',
  'Autotomize',
  'Avalanche',
  'Bide',
  'Bind',
  'Bite',
  'Blast Burn',
  'Blaze Kick',
  'Blizzard',
  'Block',
  'Body Slam',
  'Bolt Strike',
  'Bone Club',
  'Bone Rush',
  'Bonemerang',
  'Boomburst',
  'Bounce',
  'Brave Bird',
  'Brave Dance',
  'Brick Break',
  'Brine',
  'Bubble',
  'Bubble Beam',
  'Bug Bite',
  'Bug Buzz',
  'Bulk Up',
  'Bulldoze',
  'Bullet Punch',
  'Bullet Seed',
  'Calm Mind',
  'Camouflage',
  'Captivate',
  'Catastropika',
  'Charge',
  'Charge Beam',
  'Charm',
  'Chip Away',
  'Circle Throw',
  'Clamp',
  'Clanging Scales',
  'Clear Smog',
  'Close Combat',
  'Coil',
  'Comet Punch',
  'Confide',
  'Confuse Ray',
  'Confusion',
  'Constrict',
  'Continental Crush',
  'Conversion',
  'Conversion 2',
  'Copycat',
  'Core Enforcer',
  'Cotton Guard',
  'Cotton Spore',
  'Covet',
  'Crabhammer',
  'Crafty Shield',
  'Cross Chop',
  'Cross Poison',
  'Crunch',
  'Crush Claw',
  'Crush Grip',
  'Curse',
  'Cut',
  'Dark Pulse',
  'Dark Void',
  'Defend Order',
  'Defense Curl',
  'Defog',
  'Destiny Bond',
  'Detect',
  'Diamond Storm',
  'Dig',
  'Disable',
  'Disarming Voice',
  'Discharge',
  'Dive',
  'Dizzy Punch',
  'Doom Desire',
  'Double Hit',
  'Double Kick',
  'Double Slap',
  'Double Team',
  'Double-Edge',
  'Draco Meteor',
  'Dragon Ascent',
  'Dragon Breath',
  'Dragon Claw',
  'Dragon Dance',
  'Dragon Pulse',
  'Dragon Rage',
  'Dragon Rush',
  'Dragon Tail',
  'Drain Punch',
  'Dream Eater',
  'Drill Peck',
  'Drill Run',
  'Dual Chop',
  'Dynamic Punch',
  'Earth Power',
  'Earthquake',
  'Echoed Voice',
  'Eerie Impulse',
  'Egg Bomb',
  'Electric Terrain',
  'Electrify',
  'Electro Ball',
  'Electroweb',
  'Embargo',
  'Ember',
  'Encore',
  'Endeavor',
  'Endure',
  'Energy Ball',
  'Entrainment',
  'Eruption',
  'Explosion',
  'Extrasensory',
  'Extreme Speed',
  'Facade',
  'Fairy Lock',
  'Fairy Wind',
  'Fake Out',
  'Fake Tears',
  'False Swipe',
  'Feather Dance',
  'Feint',
  'Feint Attack',
  'Fell Stinger',
  'Fiery Dance',
  'Final Gambit',
  'Fire Blast',
  'Fire Fang',
  'Fire Pledge',
  'Fire Punch',
  'Fire Spin',
  'Fissure',
  'Flail',
  'Flame Burst',
  'Flame Charge',
  'Flame Wheel',
  'Flamethrower',
  'Flare Blitz',
  'Flash',
  'Flash Cannon',
  'Flatter',
  'Fling',
  'Floral Healing',
  'Flower Shield',
  'Fly',
  'Flying Press',
  'Focus Blast',
  'Focus Energy',
  'Focus Punch',
  'Follow Me',
  'Force Palm',
  'Foresight',
  "Forest's Curse",
  'Foul Play',
  'Freeze Shock',
  'Freeze-Dry',
  'Frenzy Plant',
  'Frost Breath',
  'Frustration',
  'Fury Attack',
  'Fury Cutter',
  'Fury Swipes',
  'Gastro Acid',
  'Gear Grind',
  'Gear Up',
  'Genesis Supernova',
  'Geomancy',
  'Giga Drain',
  'Giga Impact',
  'Glaciate',
  'Glare',
  'Grass Knot',
  'Grass Pledge',
  'Grass Whistle',
  'Grassy Glide',
  'Grassy Terrain',
  'Gravity',
  'Growl',
  'Grudge',
  'Guard Split',
  'Guard Swap',
  'Guillotine',
  'Gunk Shot',
  'Gust',
  'Gyro Ball',
  'Hail',
  'Hammer Arm',
  'Happy Hour',
  'Harden',
  'Haze',
  'Head Charge',
  'Head Smash',
  'Headbutt',
  'Heal Bell',
  'Heal Block',
  'Heal Order',
  'Heal Pulse',
  'Healing Wish',
  'Heart Stamp',
  'Heart Swap',
  'Heat Crash',
  'Heat Wave',
  'Heavy Slam',
  'Helping Hand',
  'Hex',
  'Hidden Power (Normal)',
  'Hidden Power (Fire)',
  'Hidden Power (Water)',
  'Hidden Power (Electric)',
  'Hidden Power (Grass)',
  'Hidden Power (Ice)',
  'Hidden Power (Fighting)',
  'Hidden Power (Poison)',
  'Hidden Power (Ground)',
  'Hidden Power (Flying)',
  'Hidden Power (Psychic)',
  'Hidden Power (Bug)',
  'Hidden Power (Rock)',
  'Hidden Power (Ghost)',
  'Hidden Power (Dragon)',
  'Hidden Power (Dark)',
  'Hidden Power (Steel)',
  'Hidden Power (Fairy)',
  'High Horsepower',
  'Hold Back',
  'Hold Hands',
  'Hone Claws',
  'Horn Attack',
  'Horn Drill',
  'Horn Leech',
  'Howl',
  'Hurricane',
  'Hydro Cannon',
  'Hydro Pump',
  'Hyper Beam',
  'Hyper Fang',
  'Hyper Voice',
  'Hyperspace Fury',
  'Hyperspace Hole',
  'Hypnosis',
  'Ice Ball',
  'Ice Beam',
  'Ice Burn',
  'Ice Fang',
  'Ice Hammer',
  'Ice Punch',
  'Ice Shard',
  'Icicle Crash',
  'Icicle Spear',
  'Icy Wind',
  'Imprison',
  'Incinerate',
  'Inferno',
  'Infestation',
  'Ingrain',
  'Instruct',
  'Ion Deluge',
  'Iron Defense',
  'Iron Head',
  'Iron Tail',
  'Jump Kick',
  'Karate Chop',
  'Knock Off',
  "Land's Wrath",
  'Laser Focus',
  'Lash Out',
  'Last Resort',
  'Lava Plume',
  'Leaf Blade',
  'Leaf Storm',
  'Leaf Tornado',
  'Leech Life',
  'Leech Seed',
  'Leech Seed',
  'Leech Seed',
  'Leer',
  'Lick',
  'Light Screen',
  'Light That Burns the Sky',
  'Liquidation',
  'Lock-On',
  'Lovely Kiss',
  'Low Kick',
  'Low Sweep',
  'Lucky Chant',
  'Lunar Dance',
  'Mach Punch',
  'Magic Coat',
  'Magic Powder',
  'Magic Room',
  'Magical Leaf',
  'Magma Storm',
  'Magnet Bomb',
  'Magnet Rise',
  'Magnetic Flux',
  'Magnitude',
  'Malicious Moonsault',
  'Mat Block',
  'Me First',
  'Mean Look',
  'Meditate',
  'Mega Drain',
  'Mega Kick',
  'Mega Punch',
  'Megahorn',
  'Memento',
  'Menacing Moonraze Maelstrom',
  'Metal Burst',
  'Metal Claw',
  'Metal Sound',
  'Meteor Assault',
  'Meteor Beam',
  'Meteor Mash',
  'Metronome',
  'Milk Drink',
  'Mimic',
  'Mind Blown',
  'Mind Reader',
  'Minimize',
  'Miracle Eye',
  'Mirror Coat',
  'Mirror Move',
  'Mirror Shot',
  'Mist',
  'Mist Ball',
  'Mist Powder',
  'Mistralton',
  'Moonblast',
  'Moonlight',
  'Morning Sun',
  'Mud Bomb',
  'Mud Shot',
  'Mud Sport',
  'Mud-Slap',
  'Muddy Water',
  'Multi-Attack',
  'Mystical Fire',
  'Nasty Plot',
  'Natural Gift',
  'Nature Power',
  "Nature's Madness",
  'Needle Arm',
  'Never-Ending Nightmare',
  'Night Daze',
  'Night Shade',
  'Night Slash',
  'Nightmare',
  'Noble Roar',
  'Nuzzle',
  'Oblivion Wing',
  'Octazooka',
  'Odor Sleuth',
  'Ominous Wind',
  'Origin Pulse',
  'Outrage',
  'Overdrive',
  'Overheat',
  'Pain Split',
  'Parabolic Charge',
  'Parting Shot',
  'Pay Day',
  'Payback',
  'Peck',
  'Perish Song',
  'Petal Blizzard',
  'Petal Dance',
  'Phantom Force',
  'Photon Geyser',
  'Pikachu',
  'Pin Missile',
  'Play Nice',
  'Play Rough',
  'Pluck',
  'Poison Fang',
  'Poison Gas',
  'Poison Jab',
  'Poison Powder',
  'Poison Sting',
  'Poison Tail',
  'Pound',
  'Powder',
  'Powder Snow',
  'Power Gem',
  'Power Split',
  'Power Swap',
  'Power Trick',
  'Power Whip',
  'Power-Up Punch',
  'Precipice Blades',
  'Present',
  'Protect',
  'Psybeam',
  'Psych Up',
  'Psychic',
  'Psycho Boost',
  'Psycho Cut',
  'Psycho Shift',
  'Psyshock',
  'Psystrike',
  'Psywave',
  'Punishment',
  'Pursuit',
  'Quash',
  'Quick Attack',
  'Quick Guard',
  'Quiver Dance',
  'Rage',
  'Rage Powder',
  'Rain Dance',
  'Rapid Spin',
  'Razor Leaf',
  'Razor Shell',
  'Razor Wind',
  'Recover',
  'Recycle',
  'Reflect',
  'Reflect Type',
  'Refresh',
  'Relic Song',
  'Rest',
  'Retaliate',
  'Return',
  'Revenge',
  'Reversal',
  'Roar',
  'Roar of Time',
  'Rock Blast',
  'Rock Climb',
  'Rock Polish',
  'Rock Slide',
  'Rock Smash',
  'Rock Throw',
  'Rock Tomb',
  'Rock Wrecker',
  'Role Play',
  'Rolling Kick',
  'Rollout',
  'Roost',
  'Rototiller',
  'Round',
  'Sacred Fire',
  'Sacred Sword',
  'Safeguard',
  'Sand Attack',
  'Sand Tomb',
  'Sandstorm',
  'Scald',
  'Scary Face',
  'Scratch',
  'Screech',
  'Searing Shot',
  'Secret Power',
  'Secret Sword',
  'Seed Bomb',
  'Seed Flare',
  'Seismic Toss',
  'Self-Destruct',
  'Shadow Ball',
  'Shadow Bone',
  'Shadow Claw',
  'Shadow Force',
  'Shadow Punch',
  'Shadow Sneak',
  'Sharpen',
  'Sheer Cold',
  'Shell Smash',
  'Shift Gear',
  'Shock Wave',
  'Signal Beam',
  'Silver Wind',
  'Simple Beam',
  'Sing',
  'Sketch',
  'Skill Swap',
  'Skull Bash',
  'Sky Attack',
  'Sky Drop',
  'Sky Uppercut',
  'Slack Off',
  'Slam',
  'Slash',
  'Sleep Powder',
  'Sleep Talk',
  'Sludge',
  'Sludge Bomb',
  'Sludge Wave',
  'Smack Down',
  'Smelling Salts',
  'Smog',
  'Smokescreen',
  'Snap Trap',
  'Snarl',
  'Snatch',
  'Snore',
  'Snowscape',
  'Soak',
  'Soft-Boiled',
  'Solar Beam',
  'Sonic Boom',
  'Soul-Stealing 7-Star Strike',
  'Spacial Rend',
  'Spark',
  'Sparkling Aria',
  'Spider Web',
  'Spike Cannon',
  'Spikes',
  'Spiky Shield',
  'Spit Up',
  'Spite',
  'Splash',
  'Splintered Stormshards',
  'Spore',
  'Stealth Rock',
  'Steam Eruption',
  'Steamroller',
  'Steel Wing',
  'Sticky Web',
  'Stockpile',
  'Stomp',
  'Stomping Tantrum',
  'Stone Edge',
  'Stored Power',
  'Storm Throw',
  'Strength',
  'String Shot',
  'Struggle',
  'Struggle Bug',
  'Stun Spore',
  'Submission',
  'Substitute',
  'Sucker Punch',
  'Sunny Day',
  'Sunsteel Strike',
  'Super Fang',
  'Superpower',
  'Supersonic',
  'Surf',
  'Swagger',
  'Swallow',
  'Sweet Kiss',
  'Sweet Scent',
  'Swift',
  'Switcheroo',
  'Swords Dance',
  'Synthesis',
  'Tackle',
  'Tail Glow',
  'Tail Slap',
  'Tail Whip',
  'Tailwind',
  'Take Down',
  'Tar Shot',
  'Taunt',
  'Tearful Look',
  'Techno Blast',
  'Teeter Dance',
  'Telekinesis',
  'Teleport',
  'Thief',
  'Thrash',
  'Thunder',
  'Thunder Fang',
  'Thunder Punch',
  'Thunder Shock',
  'Thunder Wave',
  'Thunderbolt',
  'Topsy-Turvy',
  'Torment',
  'Toxic',
  'Toxic Spikes',
  'Transform',
  'Tri Attack',
  'Trick',
  'Trick Room',
  'Trick-or-Treat',
  'Triple Kick',
  'Trop Kick',
  'Trump Card',
  'Twineedle',
  'Twinkle Tackle',
  'Twister',
  'U-turn',
  'Uproar',
  'V-create',
  'Vacuum Wave',
  'Venom Drench',
  'Venoshock',
  'Vice Grip',
  'Vine Whip',
  'Vise Grip',
  'Vital Throw',
  'Volt Switch',
  'Volt Tackle',
  'Wake-Up Slap',
  'Water Gun',
  'Water Pledge',
  'Water Pulse',
  'Water Shuriken',
  'Water Sport',
  'Water Spout',
  'Waterfall',
  'Weather Ball',
  'Whirlpool',
  'Whirlwind',
  'Wide Guard',
  'Wild Charge',
  'Will-O-Wisp',
  'Wing Attack',
  'Wish',
  'Withdraw',
  'Wonder Room',
  'Wood Hammer',
  'Work Up',
  'Worry Seed',
  'Wrap',
  'Wring Out',
  'X-Scissor',
  'Yawn',
  'Zap Cannon',
  'Zap Kick',
  'Zen Headbutt',
];

export default movesData;