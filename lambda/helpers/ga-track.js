import rp from 'request-promise';
import { GA_ID } from '../constants/constants';

module.exports = function (userId, eventName, slot) {
  return rp({
    method: 'POST',
    uri: 'https://www.google-analytics.com/collect',
    headers: {
      'User-Agent': 'Request-Promise',
    },
    qs: {
      v: 1,
      tid: GA_ID,
      cid: userId, // client ID
      t: 'event',
      ec: eventName, // event category,
      ea: slot || false,
    },
  });
};
