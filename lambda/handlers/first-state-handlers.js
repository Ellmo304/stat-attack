// Constants
import rp from 'request-promise';
import { CreateStateHandler } from 'alexa-sdk';
import { STATES, API_TOKEN } from '../constants/constants';

// Helpers
import formatTeam from '../helpers/format-team';
import snapSlot from '../helpers/snap-slot';
import gaTrack from '../helpers/ga-track';

// Handler
const firstStateHandlers = CreateStateHandler(STATES.FIRST, {

  'NewSession': function () {
    // this.emit(':tell', 'Premier League is currently being updated for the new season. Please check back tomorrow.');
    const deviceType = this.event.context.System.device.supportedInterfaces.Display ? 'Screen-based device' : 'Voice-only device';
    // GOOGLE ANALYTICS
    gaTrack(this.event.session.user.userId, 'New session', deviceType);
    // GET CURRENT MATCHDAY
    rp({
      headers: { 'X-Auth-Token': API_TOKEN },
      url: 'http://api.football-data.org/v2/competitions/2021', // prem league this year
      dataType: 'json',
      type: 'GET',
    })
      .then((response) => {
        this.attributes.currentMatchday = JSON.parse(response).currentSeason.currentMatchday;
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
    this.attributes.myTeam = this.attributes.teamSlot;
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
      gaTrack(this.event.session.user.userId, 'Fav team correct');
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
      gaTrack(this.event.session.user.userId, 'No favourite team');
      this.emit(':ask', 'No problem. I can give you team news, league table, or fixtures. Which will it be?', 'I can give you team news, league table, or fixtures. Which would you like?');
    }
    // ALEXA HEARD USER'S TEAM INCORRECTLY
    else if (this.attributes.expecting === 'confirmTeam') {
      this.attributes.expecting = 'awaitingTeam';
      gaTrack(this.event.session.user.userId, 'Heard team wrong', this.attributes.myTeam);
      this.emit(':ask', 'Sorry, my mistake. Which team do you support?', 'Sorry, I didn\'t catch that, which team do you support?');
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'Unhandled': function () {
    gaTrack(this.event.session.user.userId, 'Unhandled', 'First');
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
      this.attributes.teamSlot = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
      if (this.attributes.teamSlot) {
        gaTrack(this.event.session.user.userId, 'Valid favourite team chosen', this.attributes.teamSlot);
        this.emitWithState('ChooseSide');
      }
      else {
        gaTrack(this.event.session.user.userId, 'Invalid favourite team chosen', this.attributes.teamSlot);
        this.attributes.expecting = 'setup';
        this.emit(':ask', 'Sorry, I only know about Premier League teams. Would you like to set up a favourite team?', 'Would you like to set up a favourite team?');
      }
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'HandleTeamOnly': function () {
    if (this.event.request.intent.slots.team && this.event.request.intent.slots.team.value && this.attributes.expecting === 'awaitingTeam') {
      this.attributes.teamSlot = snapSlot(this.event.request.intent.slots.team.value.toLowerCase());
      if (this.attributes.teamSlot) {
        gaTrack(this.event.session.user.userId, 'Valid favourite team chosen', this.attributes.teamSlot);
        this.emitWithState('ChooseSide');
      }
      else {
        gaTrack(this.event.session.user.userId, 'Invalid favourite team chosen', this.attributes.teamSlot);
        this.attributes.expecting = 'setup';
        this.emit(':ask', 'Sorry, I only know about Premier League teams. Would you like to set up a favourite team?', 'Would you like to set up a favourite team?');
      }
    }
    else {
      this.emitWithState('Unhandled');
    }
  },

  'AMAZON.StopIntent': function () {
    gaTrack(this.event.session.user.userId, 'Stop');
    delete this.attributes.expecting;
    this.emit(':tell', 'Goodbye, come back soon!');
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'SessionEndedRequest': function () {
    gaTrack(this.event.session.user.userId, 'Session ended unexpectedly', 'First');
    delete this.attributes.expecting;
    this.emit(':saveState', true);
  },

});

export default firstStateHandlers;
