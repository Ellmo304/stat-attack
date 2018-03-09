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
const mainStateHandlers = CreateStateHandler(STATES.MAIN, {

  'NewSession': function () {
    delete this.attributes.expecting;
    // GET CURRENT MATCHDAY
    rp({
      headers: { 'X-Auth-Token': API_TOKEN },
      url: 'http://api.football-data.org/v1/competitions/445', // prem league this year
      dataType: 'json',
      type: 'GET',
    })
      .then((response) => {
        const data = JSON.parse(response);
        this.attributes.currentMatchday = data.currentMatchday;
        // INSERT DIRECT LAUNCH LOGIC HERE SO I ALWAYS RETREIVE CURRENT MATCHDAY FIRST
        if (this.event.request.intent && DIRECT_LAUNCHES.includes(this.event.request.intent.name)) {
          this.emitWithState(`${this.event.request.intent.name}`);
        }
        else {
          this.emitWithState('Welcome');
        }
      })
      .catch((err) => {
        console.log('API ERROR: ', err);
        this.emitWithState('Welcome');
      });
  },

  'Welcome': function () {
    if (this.attributes.myTeam) {
      this.emit(':ask', `Welcome back to Premier League. I can give you ${formatString(this.attributes.myTeam)} news, another team, league table, or fixtures. Which will it be?`, `I can give you ${formatString(this.attributes.myTeam)} news, another team, league table, or fixtures. Which would you like?`);
    }
    else {
      this.emit(':ask', 'Welcome back to Premier League. I can give you team news, league table, or fixtures. Which will it be?', 'I can give you team news, league table, or fixtures. Which would you like?');
    }
  },

  'MainMenu': function () {
    // GO TO MAIN STATE & PLAY MENU (menu needs two states, one for with fav team, one without)
    if (this.attributes.myTeam) {
      this.emit(':ask', `I can give you ${formatString(this.attributes.myTeam)} news, another team, league table, or fixtures. Which will it be?`, `I can give you ${formatString(this.attributes.myTeam)} news, another team, league table, or fixtures. Which would you like?`);
    }
    else {
      this.emit(':ask', 'I can give you team news, league table, or fixtures. Which will it be?', 'I can give you team news, league table, or fixtures. Which would you like?');
    }
  },

  'GetFixtures': function () {
    delete this.attributes.expecting;
    // GET THE CURRENT GAMEWEEK'S FIXTURES
    getRemainingFixtures.call(this, this.attributes.currentMatchday);
  },

  'TellFixtures': function () {
    // NO REMAINING FIXTURES THIS WEEK, GET NEXT GAMEWEEKS FIXTURES (IF NOT LAST GAMEWEEK)
    if (Object.keys(this.attributes.remainingFixtures).length === 0 && this.attributes.currentMatchday < 38) {
      getRemainingFixtures.call(this, this.attributes.currentMatchday + 1);
    }
    // GOT FIXTURES, READ THEM TO USER
    else {
      this.emit(':ask', `Here are the current gameweek's remaining fixtures. ${readFixtures(this.attributes.remainingFixtures)} How else can I help?`, 'How else can I help?');
    }
  },

  'GetResults': function () {
    // const team = this.event.request.intent.slots.team.value.toLowerCase() || false;
    const team = this.event.request.intent.slots.team.value ? snapSlot(this.event.request.intent.slots.team.value.toLowerCase()) : false;
    getCurrentResults.call(this, team, this.attributes.currentMatchday);
  },

  'TellResults': function () {
    // IF NO RESULTS YET, GET THE LAST GAMEWEEK INSTEAD
    if (this.attributes.currentResults[0].homeGoals === null) {
      getCurrentResults.call(this, this.attributes.teamSlot, this.attributes.currentMatchday - 1);
    }
    else {
      readResults.call(this, this.attributes.teamSlot, this.attributes.currentResults);
    }
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

  'GetTable': function () {
    delete this.attributes.expecting;
    readTable.call(this);
  },

  'AMAZON.StartOverIntent': function () {
    this.emitWithState('MainMenu');
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', HELP_MESSAGE, GENERIC_REPROMPT);
  },

  'Unhandled': function () {
    console.log('This is the main state unhandled intent.');
    this.emitWithState('AMAZON.HelpIntent');
  },

  'SessionEndedRequest': function () {
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default mainStateHandlers;
