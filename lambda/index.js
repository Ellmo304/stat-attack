import Alexa from 'alexa-sdk';
import {
  APP_ID,
  DYNAMODB_TABLE_NAME
} from './constants/constants';

import firstStateHandlers from './handlers/first-state-handlers';
// import mainStateHandlers from './handlers/main-state-handlers';

module.exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  console.log('EVENT: ', JSON.stringify(event));
  alexa.dynamoDBTableName = DYNAMODB_TABLE_NAME;
  alexa.appId = APP_ID;
  alexa.registerHandlers(
    firstStateHandlers
  );

  alexa.execute();
};
