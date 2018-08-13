import rp from 'request-promise';
import Moment from 'moment';
import { API_TOKEN } from '../constants/constants';
import formatDay from './format-day';


module.exports = function (matchday) {
  rp({
    headers: { 'X-Auth-Token': API_TOKEN },
    url: `http://api.football-data.org/v2/competitions/2021/matches/?matchday=${matchday}`, // this gameweek's fixture list
    dataType: 'json',
    type: 'GET',
  })
    .then((response) => {
      const data = JSON.parse(response);
      const fixtures = {};
      for (let i = 0; i < data.matches.length; i++) {
        if (data.matches[i].status !== 'FINISHED' && data.matches[i].status !== 'POSTPONED') {
          // GROUP EACH FIXTURE BY DAY E.G(fixtures.Monday: [game1, game2])
          if (!fixtures[`${formatDay(Moment(data.matches[i].utcDate).day())}`]) {
            fixtures[`${formatDay(Moment(data.matches[i].utcDate).day())}`] = [];
          }
          fixtures[`${formatDay(Moment(data.matches[i].utcDate).day())}`].push({ home: data.matches[i].homeTeam.name, away: data.matches[i].awayTeam.name, day: formatDay(Moment(data.matches[i].utcDate).day()) });
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
