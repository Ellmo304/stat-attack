// Constants
// import rp from 'request-promise';
import { CreateStateHandler } from 'alexa-sdk';
import { STATES } from '../constants/constants';

// Helpers
// import formResponse from '../helpers/form-response';
// import formatPosition from '../helpers/format-position';
// import formatString from '../helpers/format-string';
// import snapSlot from '../helpers/snap-slot';
// import readFixtures from '../helpers/read-fixtures';

// Handler
const firstStateHandlers = CreateStateHandler(STATES.FIRST, {

  'NewSession': function () {
    this.handler.state = STATES.MAIN;
    this.emitWithState('NewSession');
  },

});
// url: 'http://api.football-data.org/v1/competitions/445/fixtures/?matchday=', // prem league this year, current matchday

// url: 'http://api.football-data.org/v1/teams/61', // chelsea team
// url: 'http://api.football-data.org/v1/competitions/?season=2016',

export default firstStateHandlers;
