import rp from 'request-promise';
import Moment from 'moment';
import { API_TOKEN } from '../constants/constants';
import formatDay from './format-day';


module.exports = function (matchday) {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v1/competitions/445/fixtures/?matchday=${matchday}`, // this gameweek's fixture list
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const fixtures = {};
      for (let i = 0; i < data.fixtures.length; i++) {
        if (data.fixtures[i].status !== 'FINISHED' && data.fixtures[i].status !== 'POSTPONED') {
          // GROUP EACH FIXTURE BY DAY E.G(fixtures.Monday: [game1, game2])
          if (!fixtures[`${formatDay(Moment(data.fixtures[i].date).day())}`]) {
            fixtures[`${formatDay(Moment(data.fixtures[i].date).day())}`] = [];
          }
          fixtures[`${formatDay(Moment(data.fixtures[i].date).day())}`].push({ home: data.fixtures[i].homeTeamName, away: data.fixtures[i].awayTeamName, day: formatDay(Moment(data.fixtures[i].date).day()) });
        }
      }
      this.attributes.remainingFixtures = fixtures;
      this.emitWithState('TellFixtures');
    })
    .catch((err) => {
      console.log('ERROR: ', err);
      this.emit(':ask', 'Sorry, I can\'t find fixture information at the moment. How else can I help?', 'How else can I help?');
    });
};
