module.exports = function () {

  const source = 'https://s3-eu-west-1.amazonaws.com/opearlo-loreal-demo/Emily++True+Match+The+One+Concealer++LOre%CC%81al+Paris.mp4';
  console.log('SOURCE', source);
  const response = {
    version: '1.0',
    response: {
      outputSpeech: null,
      card: null,
      directives: [
        {
          type: 'VideoApp.Launch',
          videoItem: {
            source,
            metadata: {
              title: 'Amena Video',
              subtitle: 'Video from Youtube',
            },
          },
        }
      ],
      reprompt: null,
    },
    sessionAttributes: null,
  };
  this.context.succeed(response);
};
