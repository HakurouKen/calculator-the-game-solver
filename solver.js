const resolveAction = require('./action-resolve');

function normalizeActions(actions) {
  if (typeof actions === 'string') {
    actions = actions.split(/\s+/);
  }
  return actions.map(action => {
    return resolveAction(action);
  });
}

function isValueValid(val) {
  return Number.isInteger(val) && val < 10e7 && val > -10e7;
}

function solvePortal(val, from, to) {
  if (from <= to) return val;
  const fromDigit = Math.pow(10, from);
  const toDigit = Math.pow(10, to);
  while (val >= fromDigit) {
    const highDigits = ~~(val / fromDigit);
    const portalDigit = highDigits % 10;
    val =
      (highDigits - portalDigit) / 10 * fromDigit +
      val % fromDigit +
      portalDigit * toDigit;
  }
  return val;
}

/**
 * A quicker solver only works on actions without affectors.
 * What we called as affectors are actions like `[+]1` or `store`,
 * whick may affect other action or change due to step moved.
 */
function solveWithoutAffector(initial, goal, actions, moves, portal) {
  let resultActionMap = {
    [~~initial]: [[]]
  };

  for (let i = 0; i < moves; i++) {
    let nextResultActionMap = {};
    Object.keys(resultActionMap).forEach(result => {
      result = ~~result;
      actions.forEach(({ identifier, action }) => {
        let val = action(result);
        if (portal) {
          val = solvePortal(val, portal.from, portal.to);
        }

        if (
          // ignore invalid values
          !isValueValid(val) ||
          // drop  directly when processing the last move
          (i === moves - 1 && val !== goal) ||
          // doesn't make any change
          val === result
        ) {
          // ignore invalid values
          return;
        }

        nextResultActionMap[val] =
          result === goal
            ? // goal achieved on last moves or earlier
              resultActionMap[result]
            : (nextResultActionMap[val] || []).concat(
                resultActionMap[result].map(prevActions => {
                  return prevActions.concat(identifier);
                })
              );
      });
    });

    resultActionMap = nextResultActionMap;
  }

  return resultActionMap[goal] || [];
}

/**
 * Solve works on all situations, but much more slower than solverWithoutAffector.
 */
function solveWithAffector(initial, goal, actions, moves, portal) {
  const modifiers = actions.filter(action => action.type === 'modifier');

  // computed once and cached all possible **action groups(not single action)** on operation board.
  const possibleActionsOnBoard = Array.from({
    length: moves - 1
  }).reduce(
    possibleActionsOnBoardResult => {
      return Object.keys(possibleActionsOnBoardResult).reduce((ret, key) => {
        const actions = possibleActionsOnBoardResult[key];
        ret[key] = actions;
        modifiers.forEach(modifier => {
          ret[
            (key + ' ' + modifier.identifier).trim()
          ] = actions.map(action => {
            return modifier.action(action);
          });
        });

        return ret;
      }, {});
    },
    { '': actions }
  );

  let results = [
    {
      // current value display on the screen
      value: initial,
      modifiers: [],
      // values
      values: [initial],
      storedAtMove: 0,
      storedValue: initial,
      lastMoveSetStoreValue: 0,
      lastMoveGetStoreValue: 0,
      // pressed keys
      moves: []
    }
  ];

  for (let i = 0; i < moves; i++) {
    results = results.reduce((moveResults, result) => {
      return moveResults.concat(
        possibleActionsOnBoard[
          result.modifiers.join(' ')
        ].reduce((nextMoveResults, currentAction) => {
          let value = result.value;
          let moveResults = null;
          if (value === goal) {
            return nextMoveResults;
          }

          if (currentAction.type === 'modifier') {
            moveResults = [
              {
                modifiers: result.modifiers.concat(currentAction.identifier)
              }
            ];
          } else if (currentAction.type === 'store') {
            moveResults = [];
            for (
              let i = result.lastMoveGetStoreValue;
              i < result.values.length;
              i++
            ) {
              const val = result.values[i];
              const nextValue = currentAction.action(value, val);
              const lastMoveSetStoreValue = i;
              moveResults.push({
                value: nextValue,
                lastMoveSetStoreValue: i,
                lastMoveGetStoreValue: result.values.length,
                move: 'store:' + i
              });
            }

            moveResults.push({
              value: currentAction.action(
                value,
                result.values[result.lastMoveSetStoreValue]
              ),
              lastMoveSetStoreValue: result.lastMoveSetStoreValue,
              lastMoveGetStoreValue: result.values.length,
              move: 'store:' + result.lastMoveSetStoreValue
            });
          } else {
            const nextValue = currentAction.action(value);
            moveResults = [
              {
                value: nextValue
              }
            ];
          }
          moveResults = moveResults
            .filter(moveResult => {
              let val =
                moveResult.value == null ? result.value : moveResult.value;
              if (portal) {
                val = solvePortal(val, portal.from, portal.to);
              }
              moveResult.value = val;
              return !(i === moves - 1 && val !== goal) && isValueValid(val);
            })
            .map(moveResult => {
              let formatedMoveResult = {};
              formatedMoveResult.value = moveResult.value;
              formatedMoveResult.modifiers =
                moveResult.modifiers || result.modifiers;
              formatedMoveResult.lastMoveSetStoreValue =
                moveResult.lastMoveSetStoreValue ||
                result.lastMoveSetStoreValue;
              formatedMoveResult.lastMoveGetStoreValue =
                moveResult.lastMoveGetStoreValue ||
                result.lastMoveGetStoreValue;
              formatedMoveResult.values = result.values.concat(
                moveResult.value
              );
              const move = moveResult.move || currentAction.identifier;
              formatedMoveResult.moves = result.moves.concat(move);
              return formatedMoveResult;
            });

          return nextMoveResults.concat(
            moveResults.filter(moveResult => isValueValid(moveResult.value))
          );
        }, [])
      );
    }, []);
  }

  return results.filter(result => result.value === goal).map(result => {
    let storeInOffset = 0;
    const moves = [];
    const stores = {};
    result.moves.forEach(move => {
      if (move.indexOf('store:') === 0) {
        stores[move.replace('store:', '')] = true;
        moves.push('store');
      } else {
        moves.push(move);
      }
    });

    let storeOffset = 0;
    Object.keys(stores).forEach(index => {
      moves.splice(+index + storeOffset++, 0, 'store(in)');
    });
    return moves;
  });
}

module.exports = function solve(initial, goal, actions, moves, portal) {
  actions = normalizeActions(actions);
  const hasModifier = actions.some(action => {
    return action.type === 'modifier' || action.type === 'store';
  });
  const solver = hasModifier ? solveWithAffector : solveWithoutAffector;

  return solver(initial, goal, actions, moves, portal);
};
