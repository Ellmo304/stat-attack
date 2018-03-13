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
import getLastSix from '../helpers/get-last-six';
import snapSlot from '../helpers/snap-slot';
import formatTeam from '../helpers/format-team';

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
    getLastSix.call(this);
  },

  'HandleTeamOnly': function () {
    this.attributes.expecting = false;
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value) {
      this.attributes.teamSlot = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
      if (this.attributes.teamSlot) {
        this.emitWithState('TeamMenu');
      }
      else {
        this.emitWithState('Unhandled');
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
        this.emitWithState('TeamMenu');
      }
      else {
        this.emitWithState('Unhandled');
      }
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.YesIntent': function () {
    if (this.attributes.expecting === 'moreTeam') {
      this.attributes.expecting = false;
      const { selectedTeam } = this.attributes.currentSearch;
      this.emit(':ask', `You can hear ${formatTeam(selectedTeam)}'s stats, upcoming fixtures, or recent results. Which will it be?`, `You can hear ${formatTeam(selectedTeam)}'s stats, upcoming fixtures, or recent results. Which will it be?`);
    }
    else if (this.attributes.expecting === 'anythingElse') {
      this.attributes.expecting = false;
      this.emitWithState('AMAZON.StartOverIntent');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },
  'AMAZON.NoIntent': function () {
    if (this.attributes.expecting === 'moreTeam') {
      this.attributes.expecting = false;
      this.emitWithState('AMAZON.StartOverIntent');
    }
    else if (this.attributes.expecting === 'anythingElse') {
      this.attributes.expecting = false;
      this.emitWithState('AMAZON.StopIntent');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AnotherTeam': function () {
    this.emit(':ask', 'Sure, which team would you like to hear about?', 'Which team would you like to hear about?');
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
      case 'moreTeam': this.emit(':ask', `Would you like to hear more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`, `Would you like to hear more on ${formatTeam(this.attributes.currentSearch.selectedTeam)}?`);
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
