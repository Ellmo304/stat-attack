const ids = {
  'Arsenal FC': '57',
  'AFC Bournemouth': '1044',
  'Brighton & Hove Albion': '397',
  'Burnley FC': '328',
  'Cardiff City FC': '715',
  'Chelsea FC': '61',
  'Crystal Palace FC': '354',
  'Everton FC': '62',
  'Fulham FC': '63',
  'Huddersfield Town': '394',
  'Leicester City FC': '338',
  'Liverpool FC': '64',
  'Manchester City FC': '65',
  'Manchester United FC': '66',
  'Newcastle United FC': '67',
  'Southampton FC': '340',
  // 'Stoke City FC': '70',
  // 'Swansea City FC': '72',
  'Tottenham Hotspur FC': '73',
  'Watford FC': '346',
  // 'West Bromwich Albion FC': '74',
  'West Ham United FC': '563',
  'Wolverhampton Wanderers FC': '76',
};

module.exports = function (team) {
  return ids[team];
};
