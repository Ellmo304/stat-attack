// Constants
import { CreateStateHandler } from 'alexa-sdk';
import {
  GENERIC_REPROMPT,
  HELP_MESSAGE,
  WELCOME_SCREEN,
  STATES
} from '../constants/constants';

// Helpers
import formResponse from '../helpers/form-response';

// Handler
const mainStateHandlers = CreateStateHandler(STATES.MAIN, {

  'NewSession': function () {
    this.emitWithState('Welcome');
  },

  'Welcome': function () {
    delete this.attributes.expecting;
  },

  'MainMenu': function () {

  },



  'AMAZON.StartOverIntent': function () {
    this.emitWithState('MainMenu');
  },

  'AMAZON.CancelIntent': function () {
    this.emitWithState('AMAZON.StopIntent');
  },

  'AMAZON.HelpIntent': function () {
    const response = HELP_MESSAGE;
    const reprompt = GENERIC_REPROMPT;
    formResponse.call(this, false, false, WELCOME_SCREEN, '', '', response, reprompt, false, 'body 6', false, false);
  },

  'AMAZON.StopIntent': function () {
    delete this.attributes.expecting;
    delete this.attributes.nextEvent;

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
