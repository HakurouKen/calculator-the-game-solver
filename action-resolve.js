// whether params `n` is number or not
function isNumberic(n, allowNegative = false) {
  const NUMBERIC_REGEXP = new RegExp(`^${allowNegative ? '-?' : ''}[0-9]+$`);
  return NUMBERIC_REGEXP.test(String(n));
}

function abs(num) {
  return num > 0 ? [1, num] : [-1, -num];
}

// modifiable action types
const actionType = {
  isNumber(identifier) {
    return isNumberic(identifier);
  },
  isOperatorWithNumber(identifier) {
    const first = identifier.charAt(0);
    return (
      (['+', '-'].indexOf(first) >= 0 && isNumberic(identifier.slice(1))) ||
      (['*', 'x', '/'].indexOf(first) && isNumberic(identifier.slice(1), true))
    );
  },
  isModifiable(identifier) {
    return (
      actionType.isNumber(identifier) ||
      actionType.isOperatorWithNumber(identifier)
    );
  }
};

function resolveModifiableAction(str) {
  str = String(str);
  let resolved = null;
  if (actionType.isNumber(str)) {
    resolved = function(num) {
      return ~~(String(num) + str);
    };
  } else if (actionType.isOperatorWithNumber(str)) {
    if (str === '/0' || str === '/-0') {
      throw new Error('`/0` is not a validate operator');
    }
    resolved = function(num) {
      const operator = str.charAt(0);
      const n = +str.slice(1);
      switch (operator) {
        case '+':
          return num + n;
        case '-':
          return num - n;
        case '*':
        case 'x':
          return num * n;
        case '/':
          return num / n;
      }
    };
  }
  return resolved;
}

module.exports = function resolveAction(str) {
  str = String(str);
  const first = str.charAt(0);
  const lower = str.toLowerCase();
  let resolved = resolveModifiableAction(str);
  if (resolved) {
    // do nothing
  } else if (str === '<<') {
    resolved = function(num) {
      return ~~(num / 10);
    };
  } else if (str.indexOf('=>') > 0) {
    const [from, to] = str.split('=>');
    if (isNumberic(from) && isNumberic(to)) {
      resolved = function(num) {
        return ~~String(num).split(from).join(to);
      };
    }
  } else if (str === 'x^2' || str === 'x2') {
    resolved = function(num) {
      return num * num;
    };
  } else if (str === 'x^3' || str === 'x3') {
    resolved = function(num) {
      return num * num * num;
    };
  } else if (str === '+/-' || str === '+-') {
    resolved = function(num) {
      return -num;
    };
  } else if (lower === 'reverse') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      return sign * String(val).split('').reverse().join('');
    };
  } else if (lower === 'sum') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      return (
        sign *
        String(val).split('').reduce((sum, n) => {
          return sum + ~~n;
        }, 0)
      );
    };
  } else if (lower === '<shift') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      const s = String(val);
      return sign * (s.slice(1) + s.charAt(0));
    };
  } else if (lower === 'shift>') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      const s = String(val);
      return sign * (s.charAt(s.length - 1) + s.slice(0, -1));
    };
  } else if (lower === 'mirror') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      const s = String(val);
      return sign * (s + s.split('').reverse().join(''));
    };
  } else if (str.indexOf('[+]') === 0 && isNumberic(str.slice(3))) {
    // only consider about prefix `[+]`
    const increasement = ~~str.slice(3);
    resolved = {
      type: 'modifier',
      action(action) {
        let identifier = action.identifier;
        if (
          action.type === 'calculator' &&
          actionType.isModifiable(action.identifier)
        ) {
          identifier = action.identifier.replace(/\d+/, n => {
            return ~~n + increasement;
          });

          return {
            type: 'calculator',
            identifier: identifier,
            action: resolveModifiableAction(identifier)
          };
        } else {
          // keep the reference of `action` if they don't change.
          return action;
        }
      }
    };
  } else if (lower === 'store') {
    resolved = {
      type: 'store',
      action(num, saved) {
        return ~~(String(num) + saved);
      }
    };
  } else if (lower === 'inv10') {
    resolved = function(num) {
      const [sign, val] = abs(num);
      return (
        sign *
        String(val).replace(/\d/g, n => {
          return (10 - n) % 10;
        })
      );
    };
  }

  if (!resolved) {
    throw Error(`\`${str}\` is not a validate operator`);
  }

  if (typeof resolved === 'function') {
    resolved = {
      type: 'calculator',
      action: resolved
    };
  }
  return {
    type: resolved.type,
    identifier: lower,
    action: resolved.action
  };
};
