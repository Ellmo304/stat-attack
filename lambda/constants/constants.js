module.exports = {
  // Keys, IDs and names
  APP_ID: process.env.APP_ID || '',
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || '',
  API_TOKEN: process.env.API_TOKEN || '',

  // Skill states
  STATES: {
    FIRST: '',
    MAIN: 'MAIN',
  },

  DIRECT_LAUNCHES: ['HandleTeamOnly', 'HandleTeamPhrase', 'ReadTable', 'ReadFixtures'],

//
//
};
