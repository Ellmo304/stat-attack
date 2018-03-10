// Constants
import rp from 'request-promise';
import { CreateStateHandler } from 'alexa-sdk';
import { STATES, API_TOKEN } from '../constants/constants';

// Helpers
import formatTeam from '../helpers/format-team';
import snapSlot from '../helpers/snap-slot';

// Handler
const firstStateHandlers = CreateStateHandler(STATES.FIRST, {

  'NewSession': function () {
    // GET CURRENT MATCHDAY
    rp({
      headers: { 'X-Auth-Token': API_TOKEN },
      url: 'http://api.football-data.org/v1/competitions/445', // prem league this year
      dataType: 'json',
      type: 'GET',
    })
      .then((response) => {
        this.attributes.currentMatchday = JSON.parse(response).currentMatchday;
        // FIRST USE, SETUP FAVOURITE TEAM
        this.attributes.expecting = 'setup';
        this.emit(':ask', 'Welcome to Premier league. Would you like to set up a favourite team?', 'Would you like me to remember your favourite premier league team?');
      })
      .catch((err) => {
        console.log('API ERROR: ', err);
        // FIRST USE, SETUP FAVOURITE TEAM
        this.attributes.expecting = 'setup';
        this.emit(':ask', 'Welcome to Premier league. Would you like to set up a favourite team?', 'Would you like me to remember your favourite premier league team?');
      });
  },

  'ChooseSide': function () {
    this.attributes.myTeam = snapSlot(this.attributes.teamSlot);
    if (this.attributes.myTeam) {
      this.attributes.expecting = 'confirmTeam';
      this.emit(':ask', `You support ${formatTeam(this.attributes.myTeam)}. Is this correct?`, `You support ${formatTeam(this.attributes.myTeam)}. Is this correct?`);
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.YesIntent': function () {
    // USER WANTS TO SET FAVOURITE TEAM
    if (this.attributes.expecting === 'setup') {
      this.attributes.expecting = 'awaitingTeam';
      this.emit(':ask', 'Great, which premier league side do you support?', 'Which premier league side do you support?');
    }
    else if (this.attributes.expecting === 'confirmTeam') {
      this.attributes.expecting = false;
      // COLLECTED USER'S FAV TEAM CORRECTLY, GO TO MENU
      this.handler.state = STATES.MAIN;
      this.emitWithState('MainMenu');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.NoIntent': function () {
    // USER DOESN'T WANT TO PICK A FAV TEAM
    if (this.attributes.expecting === 'setup') {
      this.attributes.expecting = false;
      this.handler.state = STATES.MAIN;
      this.emit(':ask', 'No problem. I can give you team news, league table, or fixtures. Which will it be?', 'I can give you team news, league table, or fixtures. Which would you like?');
    }
    // ALEXA HEARD USER'S TEAM INCORRECTLY
    else if (this.attributes.expecting === 'confirmTeam') {
      this.attributes.expecting = 'awaitingTeam';
      this.emit(':ask', 'Sorry, my mistake. Which team do you support?', 'Sorry, I didn\'t catch that, which team do you support?');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'Unhandled': function () {
    if (this.attributes.expecting === 'setup') {
      this.emit(':ask', 'Would you like to set up a favourite team?', 'Would you like me to remember your favourite premier league team?');
    }
    else if (this.attributes.expecting === 'confirmTeam') {
      this.emit(':ask', `You support ${formatTeam(this.attributes.myTeam)}. Is this correct?`, `You support ${formatTeam(this.attributes.myTeam)}. Is this correct?`);
    }
    else {
      this.emit(':ask', 'Sorry, I didn\'t catch that, which team do you support?', 'Sorry, I didn\'t catch that, which team do you support?');
    }
  },

  'HandleTeamPhrase': function () {
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value && this.attributes.expecting === 'awaitingTeam') {
      this.attributes.teamSlot = this.event.request.intent.slots.team.value.toLowerCase();
      this.emitWithState('ChooseSide');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'HandleTeamOnly': function () {
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value && this.attributes.expecting === 'awaitingTeam') {
      this.attributes.teamSlot = this.event.request.intent.slots.team.value.toLowerCase();
      this.emitWithState('ChooseSide');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.StopIntent': function () {
    delete this.attributes.expecting;
    this.emit(':tell', 'Goodbye, come back soon!');
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'SessionEndedRequest': function () {
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default firstStateHandlers;
