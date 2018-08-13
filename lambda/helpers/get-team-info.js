import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import formatTeam from './format-team';
import formatPosition from './format-position';


module.exports = function () {
  // GET CURRENT POSITION + CURRENT MATCHDAY FOR SELECTED TEAM
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: 'http://api.football-data.org/v2/competitions/2021/standings', // prem league this year
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const selectedTeam = this.attributes.teamSlot;
      const thisYearsMatchday = data.season.currentMatchday;
      for (let i = 0; i < data.standings[0].table.length; i++) {
        if (data.standings[0].table[i].team.name === selectedTeam) {
          this.attributes.currentSearch = {
            selectedTeam,
            thisYearsMatchday,
            thisYearsPosition: data.standings[0].table[i].position,
            thisYearsPlayedGames: data.standings[0].table[i].playedGames,
            thisYearsWins: data.standings[0].table[i].won,
            thisYearsDraws: data.standings[0].table[i].draw,
            thisYearsLosses: data.standings[0].table[i].lost,
            thisYearsGoalsFor: data.standings[0].table[i].goalsFor,
            thisYearsGoalsAgainst: data.standings[0].table[i].goalsAgainst,
            thisYearsGoalDifference: data.standings[0].table[i].goalDifference,
          };
        }
      }
      const search = this.attributes.currentSearch;
      this.emit(':ask', `${formatTeam(selectedTeam)} are currently ${formatPosition(search.thisYearsPosition)} in the Premier League table on matchday ${search.thisYearsMatchday}. You can hear ${formatTeam(selectedTeam)}'s stats, upcoming fixtures, or recent results. Which will it be?`, `You can hear ${formatTeam(selectedTeam)}'s stats, upcoming fixtures, or recent results. Which will it be?`);
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I\'m having trouble finding team information at the moment. Can I help with anything else?', 'Can I help with anything else today?');
    });
};
