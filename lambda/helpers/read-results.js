import formatTeam from './format-team';
import snapStadium from './snap-stadium';

module.exports = function (team, scores) {

  let results;
  // NARROW DOWN TO SPECIFIC RESULT
  if (team) {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].home === team || scores[i].away === team) {
        results = [scores[i]];
      }
    }
  }
  // GET ALL RESULTS
  else {
    results = scores;
  }

  let string = '';

  const gameweekOver = results.filter(game => game.status !== 'FINISHED').length === 0;

  if (results.length > 1 && !gameweekOver) {
    string += `Here are the scores so far from gameweek ${this.attributes.currentMatchday}. `;
  }
  else if (results.length > 1 && gameweekOver) {
    string += `Here are the scores from gameweek ${results[0].matchday}. `;
  }
  for (let i = 0; i < results.length; i++) {
    if (results[i].status !== 'FINISHED' && results[i].homeGoals === null && results.length === 1) {
      string += `The match betwen ${formatTeam(results[i].home)} and ${formatTeam(results[i].away)} has not started yet.`;
    }
    else if (results[i].homeGoals !== null && results[i].status !== 'FINISHED') {
      string += this.attributes.currentMatchday === this.attributes.matchdaySlot ? `At ${snapStadium(results[i].home)}, it's currently: ` : '';
      string += `${formatTeam(results[i].home)}: ${results[i].homeGoals === 0 ? 'nil' : results[i].homeGoals}, ${formatTeam(results[i].away)}: ${results[i].awayGoals === 0 ? 'nil' : results[i].awayGoals}. `;
    }
    else if (results[i].homeGoals !== null) {
      string += !gameweekOver ? `At ${snapStadium(results[i].home)}, it's finished: ` : '';
      string += `${formatTeam(results[i].home)}: ${results[i].homeGoals === 0 ? 'nil' : results[i].homeGoals}, ${formatTeam(results[i].away)}: ${results[i].awayGoals === 0 ? 'nil' : results[i].awayGoals}. `;
    }
  }
  this.attributes.expecting = 'anythingElse';
  this.emit(':ask', `${string} Can I help with anything else today?`, 'Can I help with anything else today?');
};
