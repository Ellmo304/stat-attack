import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import formatTeam from './format-team';
import formatPosition from './format-position';

module.exports = function () {
  // GET LAST YEARS POSITION AT THIS MATCHDAY
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v1/competitions/426/leagueTable/?matchday=${this.attributes.currentMatchday}`, // prem league last year current matchday
    dataType: 'json',
    type: 'GET',
  })
    .then((result) => {
      const { selectedTeam } = this.attributes.currentSearch;
      const data = JSON.parse(result);
      for (let i = 0; i < data.standing.length; i++) {
        if (data.standing[i].teamName === selectedTeam) {
          this.attributes.currentSearch.lastYearsPosition = data.standing[i].position;
          this.attributes.currentSearch.lastYearsPlayedGames = data.standing[i].playedGames;
          this.attributes.currentSearch.lastYearsWins = data.standing[i].wins;
          this.attributes.currentSearch.lastYearsDraws = data.standing[i].draws;
          this.attributes.currentSearch.lastYearsLosses = data.standing[i].losses;
          this.attributes.currentSearch.lastYearsGoalsFor = data.standing[i].goals;
          this.attributes.currentSearch.lastYearsGoalsAgainst = data.standing[i].goalsAgainst;
          this.attributes.currentSearch.lastYearsGoalDifference = data.standing[i].goalDifference;
        }
      }

      // FORM RESPONSE SAYING POSITIONS & COMPARING STATS
      this.attributes.expecting = 'moreTeam';
      const search = this.attributes.currentSearch;
      const ending = search.lastYearsPosition === undefined ? '' : `This time last season, ${formatTeam(search.selectedTeam)} had played ${search.lastYearsPlayedGames} games, winning ${search.lastYearsWins}, drawing ${search.lastYearsDraws} and losing ${search.lastYearsLosses}. They had scored ${search.lastYearsGoalsFor} goals and conceded ${search.lastYearsGoalsAgainst}, giving them a goal difference of ${search.lastYearsGoalDifference}. `;
      this.emit(':ask', `${formatTeam(selectedTeam)} are currently ${formatPosition(search.thisYearsPosition)} in the Premier League table on matchday ${search.thisYearsMatchday}. This time last season ${formatTeam(selectedTeam)} were ${search.lastYearsPosition === undefined ? 'in the Championship' : formatPosition(search.lastYearsPosition)}. ` + `This season, ${formatTeam(search.selectedTeam)} have played ${search.thisYearsPlayedGames} games, winning ${search.thisYearsWins}, drawing ${search.thisYearsDraws} and losing ${search.thisYearsLosses}. They have scored ${search.thisYearsGoalsFor} goals and conceded ${search.thisYearsGoalsAgainst}, giving them a goal difference of ${search.thisYearsGoalDifference}. ${ending} Would you like more on ${formatTeam(search.selectedTeam)}?`, `Would you like to hear more on ${formatTeam(search.selectedTeam)}?`); // eslint-disable-line
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I\'m having trouble get that information at the moment. Can I help with anything else today?', 'Can I help with anything else today?');
    });
};
