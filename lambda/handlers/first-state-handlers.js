// Constants
import rp from 'request-promise';
import { CreateStateHandler } from 'alexa-sdk';
import { STATES, API_TOKEN } from '../constants/constants';

// Helpers
// import formResponse from '../helpers/form-response';
import formatPosition from '../helpers/format-position';
import formatString from '../helpers/format-string';
import snapSlot from '../helpers/snap-slot';

// Handler
const firstStateHandlers = CreateStateHandler(STATES.FIRST, {

  'NewSession': function () {
    this.emit(':ask', 'Welcome to Stat Attack, how can I help?', 'How can I help?');
  },

  'CompareSeasons': function () {
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value) {
      // GET CURRENT POSITION + CURRENT MATCHDAY
      rp({
        headers: { 'X-Auth-Token': API_TOKEN },
        url: 'http://api.football-data.org/v1/competitions/445/leagueTable', // prem league this year, current matchday
        dataType: 'json',
        type: 'GET',
      })
        .then((response) => {
          let data = JSON.parse(response);
          console.log('DATA: ', data);
          const selectedTeam = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
          if (!selectedTeam) {
            this.emit(':ask', 'Sorry, I didn\'t catch that, how can I help?', 'Sorry, I didn\'t catch that, how can I help?');
          }
          // const selectedTeam = 'Chelsea FC';
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


          // GET LAST YEARS POSITION AT THIS MATCHDAY
          rp({
            headers: { 'X-Auth-Token': API_TOKEN },
            url: `http://api.football-data.org/v1/competitions/426/leagueTable/?matchday=${thisYearsMatchday}`, // prem league last year current matchday
            dataType: 'json',
            type: 'GET',
          })
            .then((result) => {
              data = JSON.parse(result);
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

              // FORM RESPONSE SAYING POSITIONS
              const search = this.attributes.currentSearch;
              this.attributes.expecting = 'stats';
              this.emit(':ask', `${formatString(selectedTeam)} are currently ${formatPosition(search.thisYearsPosition)} in the Premier League table after matchday ${search.thisYearsMatchday}. This time last season ${formatString(selectedTeam)} were ${search.lastYearsPosition === undefined ? 'in the Championship. How else can I help?' : formatPosition(search.lastYearsPosition) + 'Would you like to compare the stats?'}`, `${search.lastYearsPosition === undefined ? 'How else can I help?' : 'Would you like to compare the stats?'}`); // eslint-disable-line
            })
            .catch((error) => {
              console.log('ERROR WITH REQUEST 2: ', error);
              this.emit(':tell', 'Goodbye');
            });
        })
        .catch((err) => {
          console.log('ERROR WITH REQUEST 1: ', err);
          this.emit(':tell', 'Goodbye');
        });
    }
    else {
      this.emit(':ask', 'Sorry, I didn\'t catch that, how can I help?', 'Sorry, I didn\'t catch that, how can I help?');
    }
  },

  'AMAZON.YesIntent': function () {
    if (this.attributes.expecting === 'stats') {
      this.attributes.expecting = false;
      const search = this.attributes.currentSearch;
      // FORM RESPONSE COMPARING STATS
      this.emit(':tell', `This season, ${formatString(search.selectedTeam)} have played ${search.thisYearsPlayedGames} games, winning ${search.thisYearsWins}, drawing ${search.thisYearsDraws} and losing ${search.thisYearsLosses}. They have scored ${search.thisYearsGoalsFor} goals and conceded ${search.thisYearsGoalsAgainst}, giving them a goal difference of ${search.thisYearsGoalDifference}. This time last season, ${formatString(search.selectedTeam)} had played ${search.lastYearsPlayedGames} games, winning ${search.lastYearsWins}, drawing ${search.lastYearsDraws} and losing ${search.lastYearsLosses}. They had scored ${search.lastYearsGoalsFor} goals and conceded ${search.lastYearsGoalsAgainst}, giving them a goal difference of ${search.lastYearsGoalDifference}.`);
    }
  },
});

// url: 'http://api.football-data.org/v1/competitions/445/leagueTable', // prem league this year, current matchday
// url: 'http://api.football-data.org/v1/competitions/426/leagueTable', // prem league last year
// url: 'http://api.football-data.org/v1/teams/61', // chelsea team
// url: 'http://api.football-data.org/v1/competitions/?season=2016',

export default firstStateHandlers;
