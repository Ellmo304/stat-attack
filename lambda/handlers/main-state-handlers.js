// Constants
import { CreateStateHandler } from 'alexa-sdk';
import {
  GENERIC_REPROMPT,
  HELP_MESSAGE,
  WELCOME_SCREEN,
  BG1,
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
    // GREET USER, PLAY MENU
    const response = 'Welcome to L\'Oréal Beauty Squad! The squad are here to get you inspired and share the latest beauty trends! To get started just ask for makeup or hair.';
    const reprompt = 'To get started just ask for makeup or hair.';
    // FORM RESPONSE
    formResponse.call(this, true, false, WELCOME_SCREEN, '', '', response, reprompt, false, 'body 6', false, false);
  },

  'MainMenu': function () {
    delete this.attributes.expecting;
    const response = 'You can get advice on makeup or hair, which will it be?';
    const reprompt = 'To get started just ask for makeup or hair.';
    // FORM RESPONSE
    formResponse.call(this, false, false, WELCOME_SCREEN, '', '', response, reprompt, false, 'body 6', false, false);
  },

  'Makeup': function () {
    this.handler.state = STATES.CHOOSE;
    this.emitWithState('Makeup');
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
    // NORMAL GOODBYE
    const response = 'Thanks, see you soon!';
    formResponse.call(this, false, true, BG1, '<font size="7"><b>Goodbye</b></font>', '', response, false, false, 'body 6', false, false);
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
