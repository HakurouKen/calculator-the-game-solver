const levels = require('./levels');
const solver = require('./solver');

levels.forEach((level, index) => {
  const [initial, goal, actions, moves, portal = null] = level;
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

  const results = solver({ initial, goal, actions, moves, portal });
  console.log(`Level ${++index}`);
  console.log();
  console.log(`Conditions`);
  console.log(conditions.join(', '));
  console.log();
  console.log(`Results`);
  console.log(results.map(result => result.join(', ')).join('\n'));
  console.log(Array.from({ length: 60 + 1 }).join('='));
});
