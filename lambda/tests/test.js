const Moment = require('moment');
const formatDay = require('../helpers/format-day');

console.log(formatDay(Moment('2018-03-05T20:00:00Z').day()));
