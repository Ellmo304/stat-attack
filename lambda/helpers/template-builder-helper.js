import Alexa from 'alexa-sdk';
import listItemBuilder from '../helpers/list-item-builder';

const { makePlainText, makeRichText } = Alexa.utils.TextUtils;
const { makeImage } = Alexa.utils.ImageUtils;

function richOrPlain(text) {
  if (text.match(/<[a-z][\s\S]*>/i)) {
    return makeRichText(text);
  }
  else {
    return makePlainText(text);
  }
}

function templateBuilder(content, template) {
  const templateText = template.split(' ');
  const templateType = templateText[0].charAt(0).toUpperCase() + templateText[0].slice(1);

  // Create a template builder based on the string passed into the function as the second argument
  const builder = new Alexa.templateBuilders[`${templateType}Template${templateText[1]}Builder`]();

  // Create the initial setup that works across all templates
  const buildTemplate = builder
    .setBackButtonBehavior(content.backButton)
    .setBackgroundImage(makeImage(content.background))
    .setTitle(content.title)
    .setToken(content.token);


  // Add an image if it's a body template other than 'Body 1'
  if (templateType === 'Body' && parseInt(10, templateText[1]) > 1 && content.image) {
    buildTemplate.setImage(makeImage(content.image));
  }
  // Add list content if it's a list item
  else if (templateType === 'List') {
    const listItems = listItemBuilder(content.listItems);
    buildTemplate
      .setListItems(listItems);
  }
  // Control flow to manage how many text items have been passed to the function
  if (content.text3 && templateType === 'Body') {
    buildTemplate
      .setTextContent(richOrPlain(content.text), richOrPlain(content.text2), richOrPlain(content.text3));
  }
  else if (content.text2 && templateType === 'Body') {
    buildTemplate
      .setTextContent(richOrPlain(content.text), richOrPlain(content.text2));
  }
  else if (templateType === 'Body') {
    buildTemplate
      .setTextContent(richOrPlain(content.text));
  }
  return buildTemplate.build();
}

export default templateBuilder;
