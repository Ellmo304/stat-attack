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
import formatTeam from '../helpers/format-team';
import getRemainingFixtures from '../helpers/get-remaining-fixtures';
import readFixtures from '../helpers/read-fixtures';
import getCurrentResults from '../helpers/get-current-results';
import readResults from '../helpers/read-results';
import readTable from '../helpers/read-table';
import snapSlot from '../helpers/snap-slot';
import gaTrack from '../helpers/ga-track';

// Handler
const mainStateHandlers = CreateStateHandler(STATES.MAIN, {

  'NewSession': function () {
    delete this.attributes.expecting;
    const deviceType = this.event.context.System.device.supportedInterfaces.Display ? 'Screen-based device' : 'Voice-only device';
    // GOOGLE ANALYTICS
    gaTrack(this.event.session.user.userId, 'New session', deviceType);
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
    this.attributes.expecting = false;
    if (this.attributes.myTeam) {
      this.emit(':ask', `Welcome back to Premier League. You can hear about ${formatTeam(this.attributes.myTeam)}, another team, or ask for the league table, fixtures, or results. Which will it be?`, GENERIC_REPROMPT);
    }
    else {
      this.emit(':ask', 'Welcome back to Premier League. You can hear about a team, or ask for the league table, fixtures, or results. Which will it be?', GENERIC_REPROMPT);
    }
  },

  'MainMenu': function () {
    gaTrack(this.event.session.user.userId, 'Main menu');
    this.attributes.expecting = false;
    // GO TO MAIN STATE & PLAY MENU (menu needs two states, one for with fav team, one without)
    if (this.attributes.myTeam) {
      this.emit(':ask', `You can hear about ${formatTeam(this.attributes.myTeam)}, another team, or ask for the league table, fixtures, or results. Which will it be?`, GENERIC_REPROMPT);
    }
    else {
      this.emit(':ask', 'You can hear about a team, or ask for the league table, fixtures, or results. Which will it be?', GENERIC_REPROMPT);
    }
  },

  'HandleTeamOnly': function () {
    this.attributes.expecting = false;
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value) {
      this.attributes.teamSlot = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
      if (this.attributes.teamSlot) {
        gaTrack(this.event.session.user.userId, 'Valid team selected', this.attributes.teamSlot);
        this.handler.state = STATES.TEAM;
        this.emitWithState('TeamMenu');
      }
      else {
        gaTrack(this.event.session.user.userId, 'Invalid team selected', this.attributes.teamSlot);
        this.emit(':ask', 'Sorry, I only know about Premier League teams. Which team would you like to hear about?', 'Which team would you like to hear about?');
      }
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'HandleTeamPhrase': function () {
    this.attributes.expecting = false;
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value) {
      this.attributes.teamSlot = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
      if (this.attributes.teamSlot) {
        gaTrack(this.event.session.user.userId, 'Valid team selected', this.attributes.teamSlot);

        this.handler.state = STATES.TEAM;
        this.emitWithState('TeamMenu');
      }
      else {
        gaTrack(this.event.session.user.userId, 'Invalid team selected', this.attributes.teamSlot);
        this.emit(':ask', 'Sorry, I only know about Premier League teams. Which team would you like to hear about?', 'Which team would you like to hear about?');
      }
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'GetTable': function () {
    gaTrack(this.event.session.user.userId, 'Read league table');
    delete this.attributes.expecting;
    readTable.call(this);
  },

  'GetFixtures': function () {
    gaTrack(this.event.session.user.userId, 'Read league fixtures');
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
      this.attributes.expecting = 'anythingElse';
      this.emit(':ask', `Here are the current gameweek's remaining fixtures. ${readFixtures(this.attributes.remainingFixtures)} Can I help with anything else today?`, 'Can I help with anything else today?');
    }
  },

  'GetResults': function () {
    this.attributes.expecting = false;
    // const team = this.event.request.intent.slots.team.value.toLowerCase() || false;
    const team = this.event.request.intent.slots.team.value ? snapSlot(this.event.request.intent.slots.team.value.toLowerCase()) : false;
    if (team) {
      gaTrack(this.event.session.user.userId, 'Read specific result', team);
    }
    else {
      gaTrack(this.event.session.user.userId, 'Read league results');
    }
    getCurrentResults.call(this, team, this.attributes.currentMatchday);
  },

  'TellResults': function () {
    // IF NO RESULTS YET, GET THE LAST GAMEWEEK INSTEAD
    if (this.attributes.currentResults[0].homeGoals === null && this.attributes.currentResults[0].status !== 'POSTPONED') {
      getCurrentResults.call(this, this.attributes.teamSlot, this.attributes.currentMatchday - 1);
    }
    else {
      readResults.call(this, this.attributes.teamSlot, this.attributes.currentResults);
    }
  },

  'AnotherTeam': function () {
    gaTrack(this.event.session.user.userId, 'Another team');
    this.emit(':ask', 'Sure, which team would you like to hear about?', 'Which team would you like to hear about?');
  },

  'AMAZON.YesIntent': function () {
    // USER DOES WANT TO HEAR BOTTOM HALF OF TABLE
    if (this.attributes.expecting === 'continueTable') {
      gaTrack(this.event.session.user.userId, 'Continue table');
      this.attributes.expecting = 'anythingElse';
      const { standings } = this.attributes;
      this.emit(
        ':ask',
        `In 11th place are ${formatTeam(standings[10].name)} with ${standings[10].points} points. They are followed by ${formatTeam(standings[11].name)} with ${standings[11].points} points, ${formatTeam(standings[12].name)} with ${standings[12].points} points and ${formatTeam(standings[13].name)} with ${standings[13].points} points. ${formatTeam(standings[14].name)} are 15th with ${standings[14].points} points, followed by ${formatTeam(standings[15].name)} with ${standings[15].points} points and ${formatTeam(standings[16].name)} with ${standings[16].points} points. Making up the bottom 3 are ${formatTeam(standings[17].name)} with ${standings[17].points} points, ${formatTeam(standings[18].name)} with ${standings[18].points} points and ${formatTeam(standings[19].name)} with ${standings[19].points} points. Can I help with anything else today?`,
        'Can I help with anything else today?'
      );
    }
    else if (this.attributes.expecting === 'anythingElse') {
      this.attributes.expecting = false;
      this.emitWithState('MainMenu');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.NoIntent': function () {
    // USER DOES NOT WANT TO HEAR BOTTOM HALF OF TABLE, GO TO MENU
    if (this.attributes.expecting === 'continueTable') {
      gaTrack(this.event.session.user.userId, 'Don\'t continue table');
      this.attributes.expecting = false;
      this.emitWithState('MainMenu');
    }
    else if (this.attributes.expecting === 'anythingElse') {
      this.attributes.expecting = false;
      this.emitWithState('AMAZON.StopIntent');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.StartOverIntent': function () {
    this.emitWithState('MainMenu');
  },

  'AMAZON.StopIntent': function () {
    gaTrack(this.event.session.user.userId, 'Stop');
    let sessionCount = this.attributes.sessionCount || 0;
    sessionCount++;
    this.attributes.sessionCount = sessionCount;
    if (sessionCount === 1 || sessionCount === 4) {
      this.emit(':tell', 'If you enjoyed this skill, please give us a positive rating on the skill store! See you soon!');
    }
    else {
      this.emit(':tell', 'Goodbye, see you soon!');
    }
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'AMAZON.HelpIntent': function () {
    gaTrack(this.event.session.user.userId, 'Help');
    this.attributes.expecting = false;
    this.emit(':ask', HELP_MESSAGE, GENERIC_REPROMPT);
  },

  'Unhandled': function () {
    gaTrack(this.event.session.user.userId, 'Unhandled', 'Main');
    console.log('This is the main state unhandled intent.');
    switch (this.attributes.expecting) {
      case 'continueTable': this.emit(':ask', 'Would you like to hear the rest of the table?', 'Would you like me to read the bottom half of the table?');
        break;
      case 'anythingElse': this.emit(':ask', 'Can I help with anything else today?', 'Can I help with anything else today?');
        break;
      default: this.emitWithState('AMAZON.HelpIntent');
    }
  },

  'SessionEndedRequest': function () {
    gaTrack(this.event.session.user.userId, 'Session ended unexpectedly', 'Main');
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default mainStateHandlers;
