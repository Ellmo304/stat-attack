module.exports = {
  // Keys, IDs and names
  APP_ID: process.env.APP_ID || '',
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || '',
  API_TOKEN: process.env.API_TOKEN || '',
  GA_ID: process.env.GA_ID || '',

  // Skill states
  STATES: {
    FIRST: '',
    MAIN: 'MAIN',
    TEAM: 'TEAM',
  },

  HELP_MESSAGE: 'To hear information about a specific team, just say a team name. Otherwise, try asking me for the league table, fixtures, or results. Now, how can I help?',

  GENERIC_REPROMPT: 'Try saying a team name, or, ask for the league table, fixtures, or results. Which will it be?',

  DIRECT_LAUNCHES: ['HandleTeamOnly', 'HandleTeamPhrase', 'GetTable', 'GetFixtures', 'GetResults'],

//
//
};
