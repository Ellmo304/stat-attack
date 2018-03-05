const teams = [
  { name: 'Arsenal FC', synonyms: ['arsenal', 'arsenal fc', 'gunners'] },
  { name: 'AFC Bournemouth', synonyms: ['afc bournemouth', 'bournemouth'] },
  { name: 'Brighton & Hove Albion', synonyms: ['brighton & hove albion', 'brighton and hove albion', 'brighton', 'seagulls'] },
  { name: 'Burnley FC', synonyms: ['burnley fc', 'burnley'] },
  { name: 'Chelsea FC', synonyms: ['chelsea fc', 'chelsea'] },
  { name: 'Crystal Palace FC', synonyms: ['crystal palace fc', 'crystal palace', 'palace'] },
  { name: 'Everton FC', synonyms: ['everton fc', 'everton'] },
  { name: 'Huddersfield Town', synonyms: ['huddersfield town', 'huddersfield'] },
  { name: 'Leicester City FC', synonyms: ['leicester city fc', 'leicester city', 'leicester'] },
  { name: 'Liverpool FC', synonyms: ['liverpool fc', 'liverpool'] },
  { name: 'Manchester City FC', synonyms: ['manchester city fc', 'manchester city', 'man city'] },
  { name: 'Manchester United FC', synonyms: ['manchester united fc', 'manchester united', 'man united', 'man utd', 'red devils'] },
  { name: 'Newcastle United FC', synonyms: ['newcastle united fc', 'newcastle united', 'newcastle utd', 'newcastle', 'magpies'] },
  { name: 'Southampton FC', synonyms: ['southampton fc', 'southampton', 'saints'] },
  { name: 'Stoke City FC', synonyms: ['stoke city fc', 'stoke city', 'stoke', 'potters'] },
  { name: 'Swansea City FC', synonyms: ['swansea city fc', 'swansea city', 'swansea', 'swans'] },
  { name: 'Tottenham Hotspur FC', synonyms: ['tottenham hotspur fc', 'tottenham hotspur', 'tottenham hotspurs', 'tottenham', 'spurs'] },
  { name: 'Watford FC', synonyms: ['watford fc', 'watford', 'hornets'] },
  { name: 'West Bromwich Albion FC', synonyms: ['west bromwich albion fc', 'west bromwich albion', 'west bromwich', 'west brom'] },
  { name: 'West Ham United FC', synonyms: ['west ham united fc', 'west ham united', 'west ham utd', 'west ham utd fc', 'west ham fc', 'west ham', 'hammers'] }
];

module.exports = function (slot) {
  let teamName = false;
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].synonyms.includes(slot)) {
      teamName = teams[i].name;
    }
  }
  return teamName;
};

// f.c.    f.c     f. c.    f. c     f c     fc
