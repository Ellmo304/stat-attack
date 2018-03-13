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
    url: `http://api.football-data.org/v1/teams/${id}/fixtures`, // prem league this year
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      console.log('FIXTURES: ', data.fixtures);
      const fixtures = [];
      let counter = 0;
      for (let i = 0; i < data.fixtures.length; i++) {
        if (data.fixtures[i].status !== 'FINISHED' && data.fixtures[i].status !== 'POSTPONED' && data.fixtures[i]._links.competition.href.split('competitions/')[1] === '445' && counter < 6) { // eslint-disable-line
          console.log('fixture: ', data.fixtures[i]);
          const opposition = data.fixtures[i].homeTeamName === team ? data.fixtures[i].awayTeamName : data.fixtures[i].homeTeamName;
          const location = data.fixtures[i].homeTeamName === team ? 'at home' : 'away';
          fixtures.push(`${formatTeam(opposition)} ${location}`);
          counter++;
        }
      }
      // FORM RESPONSE
      let string = fixtures.length === 0 ? `I can't find any upcoming fixtures for ${formatTeam(team)} in the Premier League.` : `${formatTeam(team)}'s next ${fixtures.length > 1 ? fixtures.length : ''} ${fixtures.length > 1 ? 'fixtures are: ' : 'fixture is: '}`;
      for (let j = 0; j < fixtures.length; j++) {
        if (j === fixtures.length - 1 && fixtures.length > 1) {
          string += `and ${fixtures[j]}.`;
        }
        else if (j === fixtures.length - 1 && fixtures.length === 1) {
          string += `${fixtures[j]}.`;
        }
        else {
          string += `${fixtures[j]}, `;
        }
      }
      console.log('FIXTURES: ', fixtures);
      this.attributes.expecting = 'moreTeam';
      this.emit(':ask', `${string} Would you like more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`, `Would you like to hear more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`);
    })
    .catch((err) => {
      console.log('API ERROR: ', err);
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', 'Sorry, I can\'t find fixture information at the moment. Can I help with anything else today?', 'Can I help with anything else today?');
    });
};
