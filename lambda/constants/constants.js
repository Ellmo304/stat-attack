module.exports = {
  // Keys, IDs and names
  APP_ID: process.env.APP_ID || '',
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || '',
  API_TOKEN: process.env.API_TOKEN || '',

  // Skill states
  STATES: {
    FIRST: '',
    // MAIN: 'MAIN',
  },
//
//   // Common messages and responses
//   GENERIC_REPROMPT: 'Try saying: plan a look, or what\'s trending. Which will it be?',
//   HELP_MESSAGE: 'I\'m your personal beauty assistant. I can help you with loads of great beauty advice. To plan a look for a specific event, tailored to you - just say: plan a look. Or, to hear a trending look, say what\'s trending. Which will it be?',
//
//   // Images
//   LOGO: 'https://s3-eu-west-1.amazonaws.com/prl-bmly-cty-assets/logo6-large.jpg',
//   WELCOME_SCREEN: 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/welcome.jpg',
//   BG1: 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/BG_one.jpg',
//
//   // Echo show menu strings
//   WELCOME_MENU: `
//     <br/>
//       <font size="5"><b>Plan A Look</b></font>
//       <br/>
//       <font size="3"><i>"Alexa, Plan A Look"</i></font>
//       <br/>
//       <br/>
//       <font size="5"><b>What's Trending?</b></font>
//       <br/>
//       <font size="3"><i>"Alexa, What's Trending?"</i></font>
//       <br/>
//       <br/>
//     `,
//
//   LIST_ITEMS: [
//     {
//       'token': 'victoria',
//       'image': {
//         description: 'vic image',
//         url: 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/vic1.jpg',
//       },
//       'text': '<font size="5"><b>Victoria</b></font>',
//     },
//     {
//       'token': 'emily',
//       'image': {
//         description: 'emily image',
//         url: 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/emily1.jpg',
//       },
//       'text': '<font size="5"><b>Emily</b></font>',
//     },
//     {
//       'token': 'patricia',
//       'image': {
//         description: 'pat image',
//         url: 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/pat1.jpg',
//       },
//       'text': '<font size="5"><b>Patricia</b></font>',
//     }
//   ],
//
//   EMILY_TEXT: `
//   <br/><font size="3"> - Concealer</font>
//   <br/><br/><font size="3"> - Eye shadow</font>
//   <br/><br/><font size="3"> - Contouring</font>`,
//
//   CONCEALER_TEXT: '<br/><action value="play_video">Play Video</action><br/><br/> If you blend concealer too soon, the foundation will rub off, leaving you with very little coverage. Use a concealer that\'s slightly lighter than your skin tone to line the three tiny sections of your eyes.',
//
};
