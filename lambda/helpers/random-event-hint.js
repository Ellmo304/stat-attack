module.exports = function (type) {
  const events = type === 'event' ? ['wedding', 'festival', 'prom', 'summer', 'party', 'carnival', 'dance', 'bar', 'dinner'] : ['glam', 'colourful', 'sexy', 'edgy', 'natural'];
  const randomHint = events[Math.floor(Math.random() * events.length)];
  return randomHint;
};
