module.exports = function (array) {
  const newArray = array;
  let counter = newArray.length;

  // While there are elements in the array
  while (counter > 0) {
  // Pick a random index
    const index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    const temp = newArray[counter];
    newArray[counter] = newArray[index];
    newArray[index] = temp;
  }
  return newArray;
};
