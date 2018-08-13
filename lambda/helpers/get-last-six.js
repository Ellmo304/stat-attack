import rp from 'request-promise';
import { API_TOKEN } from '../constants/constants';
import snapId from './snap-id';
import formatTeam from './format-team';

module.exports = function () {
  const team = this.attributes.currentSearch.selectedTeam;
  const id = snapId(team);
  // GET NEXT SIX FIXTURES FOR SELECTED TEAM
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v2/teams/${id}/matches`, // prem league this year
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      console.log('RESULTS: ', data.matches);
      const results = [];
      let counter = 0;
      const gamesPlayed = data.matches.reverse();
      for (let i = 0; i < gamesPlayed.length; i++) {
        if (gamesPlayed[i].status === 'FINISHED' && gamesPlayed[i].competition.id === 2021 && counter < 6) { // eslint-disable-line
          console.log('fixture: ', gamesPlayed[i]);
          results.push(`${formatTeam(gamesPlayed[i].homeTeam.name)}: ${gamesPlayed[i].score.fullTime.homeTeam > 0 ? gamesPlayed[i].score.fullTime.homeTeam : 'nil'}, ${formatTeam(gamesPlayed[i].awayTeam.name)}: ${gamesPlayed[i].score.fullTime.awayTeam > 0 ? gamesPlayed[i].score.fullTime.awayTeam : 'nil'}`);
          counter++;
        }
      }
      results.reverse();
      // FORM RESPONSE
      let string = results.length === 0 ? `I can't find any recent results for ${formatTeam(team)} in the Premier League.` : `${formatTeam(team)}'s last ${results.length > 1 ? results.length : ''} ${results.length > 1 ? 'results were: ' : 'result was: '}`;
      for (let j = 0; j < results.length; j++) {
        if (j === results.length - 1 && results.length > 1) {
          string += `and ${results[j]}.`;
        }
        else if (j === results.length - 1 && results.length === 1) {
          string += `${results[j]}.`;
        }
        else {
          string += `${results[j]}, `;
        }
      }
      console.log('RESULTS: ', results);
      this.attributes.expecting = 'moreTeam';
      this.emit(':ask', `${string} Would you like more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`, `Would you like to hear more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`);
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I can\'t find result information at the moment. Can I help with anything else today?', 'Can I help with anything else today?');
    });
};
