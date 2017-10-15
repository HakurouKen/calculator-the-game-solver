const assert = require('assert');
const solver = require('./solver');
const levels = require('./levels');

describe('Levels', function() {
  let level = 1;
  function test(initial = 0, goal = 0, actions = [], moves = 1, portal = null) {
    const conditions = [
      `initial: ${initial}`,
      `goal: ${goal}`,
      `actions: [${(typeof actions === 'string'
        ? actions.split(/\s+/g)
        : actions
      ).join(', ')}]`,
      `moves: ${moves}`
    ];
    if (portal) {
      conditions.splice(1, 0, `portal: from ${portal.from} to ${portal.to}`);
    }

    const description = `should pass level ${level++} (${conditions.join(
      ', '
    )})`;

    it(description, function() {
      const results = solver({ initial, goal, actions, moves, portal });
      assert.ok(results.length);
    });
  }

  levels.forEach(level => {
    test.apply(null, level);
  });
});
