// Constants
import rp from 'request-promise';
import { CreateStateHandler } from 'alexa-sdk';
import {
  GENERIC_REPROMPT,
  HELP_MESSAGE,
  API_TOKEN,
  DIRECT_LAUNCHES,
  STATES
} from '../constants/constants';

// Helpers
import formatString from '../helpers/format-string';
import getRemainingFixtures from '../helpers/get-remaining-fixtures';
import readFixtures from '../helpers/read-fixtures';
import getCurrentResults from '../helpers/get-current-results';
import readResults from '../helpers/read-results';
import readTable from '../helpers/read-table';
import snapSlot from '../helpers/snap-slot';

// Handler
const teamStateHandlers = CreateStateHandler(STATES.TEAM, {

  'NewSession': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('NewSession');
  },

  'GetTable': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('GetTable');
  },

  'GetFixtures': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('GetFixtures');
  },

  'GetResults': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('GetResults');
  },

  'TeamMenu': function () {
    this.emit(':ask', `${this.attributes.teamSlot} are currently 1st. You can hear stats, upcoming fixtures, or recent results. Which will it be?`, 'Team are currently 1st. You can hear stats, upcoming fixtures, or recent results. Which will it be?');
  },

  // 'CompareSeasons': function () {
  //   delete this.attributes.expecting;
  //   if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value) {
  //     // GET CURRENT POSITION + CURRENT MATCHDAY
  //     rp({
  //       headers: { 'X-Auth-Token': API_TOKEN },
  //       url: 'http://api.football-data.org/v1/competitions/445/leagueTable', // prem league this year, current matchday
  //       dataType: 'json',
  //       type: 'GET',
  //     })
  //       .then((response) => {
  //         let data = JSON.parse(response);
  //         console.log('DATA: ', data);
  //         const selectedTeam = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
  //         if (!selectedTeam) {
  //           this.emit(':ask', 'Sorry, I didn\'t catch that, how can I help?', 'Sorry, I didn\'t catch that, how can I help?');
  //         }
  //         // const selectedTeam = 'Chelsea FC';
  //         const thisYearsMatchday = data.matchday;
  //         for (let i = 0; i < data.standing.length; i++) {
  //           if (data.standing[i].teamName === selectedTeam) {
  //             this.attributes.currentSearch = {
  //               selectedTeam,
  //               thisYearsMatchday,
  //               thisYearsPosition: data.standing[i].position,
  //               thisYearsPlayedGames: data.standing[i].playedGames,
  //               thisYearsWins: data.standing[i].wins,
  //               thisYearsDraws: data.standing[i].draws,
  //               thisYearsLosses: data.standing[i].losses,
  //               thisYearsGoalsFor: data.standing[i].goals,
  //               thisYearsGoalsAgainst: data.standing[i].goalsAgainst,
  //               thisYearsGoalDifference: data.standing[i].goalDifference,
  //             };
  //           }
  //         }
  //
  //         // GET LAST YEARS POSITION AT THIS MATCHDAY
  //         rp({
  //           headers: { 'X-Auth-Token': API_TOKEN },
  //           url: `http://api.football-data.org/v1/competitions/426/leagueTable/?matchday=${thisYearsMatchday}`, // prem league last year current matchday
  //           dataType: 'json',
  //           type: 'GET',
  //         })
  //           .then((result) => {
  //             data = JSON.parse(result);
  //             for (let i = 0; i < data.standing.length; i++) {
  //               if (data.standing[i].teamName === selectedTeam) {
  //                 this.attributes.currentSearch.lastYearsPosition = data.standing[i].position;
  //                 this.attributes.currentSearch.lastYearsPlayedGames = data.standing[i].playedGames;
  //                 this.attributes.currentSearch.lastYearsWins = data.standing[i].wins;
  //                 this.attributes.currentSearch.lastYearsDraws = data.standing[i].draws;
  //                 this.attributes.currentSearch.lastYearsLosses = data.standing[i].losses;
  //                 this.attributes.currentSearch.lastYearsGoalsFor = data.standing[i].goals;
  //                 this.attributes.currentSearch.lastYearsGoalsAgainst = data.standing[i].goalsAgainst;
  //                 this.attributes.currentSearch.lastYearsGoalDifference = data.standing[i].goalDifference;
  //               }
  //             }
  //
  //             // FORM RESPONSE SAYING POSITIONS
  //             const search = this.attributes.currentSearch;
  //             this.attributes.expecting = 'stats';
  //             this.emit(':ask', `${formatString(selectedTeam)} are currently ${formatPosition(search.thisYearsPosition)} in the Premier League table after matchday ${search.thisYearsMatchday - 1}. This time last season ${formatString(selectedTeam)} were ${search.lastYearsPosition === undefined ? 'in the Championship. How else can I help?' : formatPosition(search.lastYearsPosition) + '. Would you like to compare the stats?'}`, `${search.lastYearsPosition === undefined ? 'How else can I help?' : 'Would you like to compare the stats?'}`); // eslint-disable-line
  //           })
  //           .catch((error) => {
  //             console.log('ERROR WITH REQUEST 2: ', error);
  //             this.emit(':tell', 'Goodbye');
  //           });
  //       })
  //       .catch((err) => {
  //         console.log('ERROR WITH REQUEST 1: ', err);
  //         this.emit(':tell', 'Goodbye');
  //       });
  //   }
  //   else {
  //     this.emit(':ask', 'Sorry, I didn\'t catch that, how can I help?', 'Sorry, I didn\'t catch that, how can I help?');
  //   }
  // },

  'AMAZON.YesIntent': function () {
    if (this.attributes.expecting === 'continueTable') {
      this.attributes.expecting = false;
      const { standings } = this.attributes;
      this.emit(
        ':ask',
        `In 11th place are ${formatString(standings[10].name)} with ${standings[10].points} points. They are followed by ${formatString(standings[11].name)} with ${standings[11].points} points, ${formatString(standings[12].name)} with ${standings[12].points} points and ${formatString(standings[13].name)} with ${standings[13].points} points. ${formatString(standings[14].name)} are 15th with ${standings[14].points} points, followed by ${formatString(standings[15].name)} with ${standings[15].points} points and ${formatString(standings[16].name)} with ${standings[16].points} points. Making up the bottom 3 are ${formatString(standings[17].name)} with ${standings[17].points} points, ${formatString(standings[18].name)} with ${standings[18].points} points and ${formatString(standings[19].name)} with ${standings[19].points} points. How else can I help today?`,
        'How else can I help today?'
      );
    }
    else if (this.attributes.expecting === 'stats') {
      this.attributes.expecting = false;
      const search = this.attributes.currentSearch;
      // FORM RESPONSE COMPARING STATS
      this.emit(':tell', `This season, ${formatString(search.selectedTeam)} have played ${search.thisYearsPlayedGames} games, winning ${search.thisYearsWins}, drawing ${search.thisYearsDraws} and losing ${search.thisYearsLosses}. They have scored ${search.thisYearsGoalsFor} goals and conceded ${search.thisYearsGoalsAgainst}, giving them a goal difference of ${search.thisYearsGoalDifference}. This time last season, ${formatString(search.selectedTeam)} had played ${search.lastYearsPlayedGames} games, winning ${search.lastYearsWins}, drawing ${search.lastYearsDraws} and losing ${search.lastYearsLosses}. They had scored ${search.lastYearsGoalsFor} goals and conceded ${search.lastYearsGoalsAgainst}, giving them a goal difference of ${search.lastYearsGoalDifference}.`);
    }
  },

  'AMAZON.StartOverIntent': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('MainMenu');
  },

  'AMAZON.StopIntent': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('AMAZON.StopIntent');
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'AMAZON.HelpIntent': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('AMAZON.HelpIntent');
  },

  'Unhandled': function () {
    console.log('This is the team state unhandled intent.');
    this.emitWithState('AMAZON.HelpIntent');
  },

  'SessionEndedRequest': function () {
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default teamStateHandlers;
