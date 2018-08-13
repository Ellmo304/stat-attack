const stadiums = {
  'Arsenal FC': 'The Emirates',
  'AFC Bournemouth': 'The Vitality Stadium',
  'Brighton & Hove Albion': 'The Amex',
  'Burnley FC': 'Turf Moor',
  'Cardiff City FC': 'Cardiff City Stadium',
  'Chelsea FC': 'Stamford Bridge',
  'Crystal Palace FC': 'Selhurst Park',
  'Everton FC': 'Goodison',
  'Fulham FC': 'Craven Cottage',
  'Huddersfield Town': 'The John Smiths Stadium',
  'Leicester City FC': 'The King Power Stadium',
  'Liverpool FC': 'Anfield',
  'Manchester City FC': 'The Etihad',
  'Manchester United FC': 'Old Trafford',
  'Newcastle United FC': 'St James\' Park',
  'Southampton FC': 'Saint Mary\'s',
  // 'Stoke City FC': 'The bet <say-as interpret-as="digits">365</say-as> Stadium',
  // 'Swansea City FC': 'The Liberty Stadium',
  'Tottenham Hotspur FC': 'Wembley Stadium',
  'Watford FC': 'Vicarage Road',
  'Wolverhampton Wanderers FC': 'Molineux',
  // 'West Bromwich Albion FC': 'The Hawthorns',
  'West Ham United FC': 'The London Stadium',
};

module.exports = function (team) {
  return stadiums[team];
};
