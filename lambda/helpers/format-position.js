module.exports = function (position) {
  let string;
  switch (position) {
    case 1: string = 'st';
      break;
    case 2: string = 'nd';
      break;
    case 3: string = 'rd';
      break;
    default: string = 'th';
  }
  return `${position}${string}`;
};
