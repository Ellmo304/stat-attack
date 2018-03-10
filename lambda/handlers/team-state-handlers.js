// Constants
import { CreateStateHandler } from 'alexa-sdk';
import {
  // API_TOKEN,
  STATES
} from '../constants/constants';

// Helpers
import getTeamInfo from '../helpers/get-team-info';
import getStats from '../helpers/get-stats';
import getNextSix from '../helpers/get-next-six';

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

  'TeamMenu': function () {
    getTeamInfo.call(this);
  },

  'GetStats': function () {
    // GET {TEAM}S STATS & COMPARE WITH LAST SEASON
    getStats.call(this);
  },

  'GetFixtures': function () {
    // GET {TEAM}S NEXT 6 FIXTURES
    getNextSix.call(this);
  },

  'GetResults': function () {
    // GET {TEAM}S LAST 6 RESULTS
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
    switch (this.attributes.expecting) {
      case 'anythingElse': this.emit(':ask', 'Can I help with anything else today?', 'Can I help with anything else today?');
        break;
      default: this.emitWithState('AMAZON.HelpIntent');
    }
  },

  'SessionEndedRequest': function () {
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default teamStateHandlers;
