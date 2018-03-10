import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import formatTeam from './format-team';
import formatPosition from './format-position';


module.exports = function () {
  // GET CURRENT POSITION + CURRENT MATCHDAY FOR SELECTED TEAM
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: 'http://api.football-data.org/v1/competitions/445/leagueTable', // prem league this year
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const selectedTeam = this.attributes.teamSlot;
      const thisYearsMatchday = data.matchday;
      for (let i = 0; i < data.standing.length; i++) {
        if (data.standing[i].teamName === selectedTeam) {
          this.attributes.currentSearch = {
            selectedTeam,
            thisYearsMatchday,
            thisYearsPosition: data.standing[i].position,
            thisYearsPlayedGames: data.standing[i].playedGames,
            thisYearsWins: data.standing[i].wins,
            thisYearsDraws: data.standing[i].draws,
            thisYearsLosses: data.standing[i].losses,
            thisYearsGoalsFor: data.standing[i].goals,
            thisYearsGoalsAgainst: data.standing[i].goalsAgainst,
            thisYearsGoalDifference: data.standing[i].goalDifference,
          };
        }
      }
      const search = this.attributes.currentSearch;
      this.emit(':ask', `${formatTeam(selectedTeam)} are currently ${formatPosition(search.thisYearsPosition)} in the Premier League table after matchday ${search.thisYearsMatchday - 1}. You can hear stats, upcoming fixtures, or recent results. Which will it be?`, 'You can hear stats, upcoming fixtures, or recent results. Which will it be?');
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I\'m having trouble finding team information at the moment. Can I help with anything else?', 'Can I help with anything else today?');
    });
};
