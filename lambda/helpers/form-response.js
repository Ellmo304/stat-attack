import templateBuilder from '../helpers/template-builder-helper';
import { BG2 } from '../constants/constants';

module.exports = function (askWithCard, contentTitle, background, text, text2, response, reprompt, hint, template, contentImage, list) {
  // FORM RESPONSE
  const content = {
    backButton: 'HIDDEN',
    background: background || BG2,
    title: contentTitle ? 'Beauty Squad' : '',
    text,
    text2,
    image: contentImage || false,
    token: Math.random(),
    listItems: list || false,
  };
  if (this.event.context.System.device.supportedInterfaces.Display) {
    if (reprompt && hint) {
      this.response
        .speak(response)
        .listen(reprompt)
        .renderTemplate(templateBuilder(content, template))
        .hint(hint);
    }
    else if (reprompt) {
      this.response
        .speak(response)
        .listen(reprompt)
        .renderTemplate(templateBuilder(content, template));
    }
    else if (hint) {
      this.response
        .speak(response)
        .renderTemplate(templateBuilder(content, template))
        .hint(hint);
    }
    else {
      this.response
        .speak(response)
        .renderTemplate(templateBuilder(content, template));
    }

    this.emit(':responseReady');
  }
  else if (reprompt) {
    this.emit(':ask', response, reprompt);
  }
  else {
    this.emit(':tell', response);
  }
};
