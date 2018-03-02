import Alexa from 'alexa-sdk';

const { makePlainText, makeRichText, makeTextContent } = Alexa.utils.TextUtils;
const { makeImage } = Alexa.utils.ImageUtils;

function richOrPlain(text) {
  if (text.match(/<[a-z][\s\S]*>/i)) {
    return makeRichText(text);
  }
  else {
    return makePlainText(text);
  }
}

class ListItemBuilder2 {
  constructor() {
    this.items = [];
  }
  addItem(token, image, primaryText, secondaryText, tertiaryText) {
    const item = {};
    item.token = token;
    item.image = makeImage(image.url, false, false, 'LARGE', image.description);
    item.textContent = makeTextContent(primaryText, secondaryText, tertiaryText);
    this.items.push(item);
    return this;
  }
  build() {
    return this.items;
  }
}


function listItemBuilder(listItems) {
  const finalList = new ListItemBuilder2();
  for (let i = 0; i < listItems.length; i++) {
    const text = richOrPlain(listItems[i].text);

    if (listItems[i].text3) {
      const text2 = richOrPlain(listItems[i].text2);
      const text3 = richOrPlain(listItems[i].text3);
      finalList.addItem(listItems[i].token, text, text2, text3);
    }
    else if (listItems[i].text2) {
      const text2 = richOrPlain(listItems[i].text2);
      finalList.addItem(listItems[i].token, text, text2);
    }
    else {
      finalList.addItem(listItems[i].token, listItems[i].image, text);
    }
  }
  return finalList.build();
}

export default listItemBuilder;
