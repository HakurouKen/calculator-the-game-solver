const assert = require('assert');
const solver = require('./solver');

describe('Levels', function() {
  let level = 1;
  function walkThrough(
    initial = 0,
    goal = 0,
    actions = [],
    moves = 1,
    portal = null
  ) {
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
      const results = solver(initial, goal, actions, moves, portal);
      assert.ok(results.length);
      console.log(results.map(result => result.join(', ')).join('\n'));
    });
  }
  // level 1 ~ level 10
  walkThrough(0, 2, '+1', 2);
  walkThrough(0, 8, '+2 +3', 3);
  walkThrough(0, 9, 'x3 +1 +2', 3);
  walkThrough(1, 7, '+4 -2', 3);
  walkThrough(3, 4, '+4 x4 /4', 3);
  walkThrough(0, 64, '+2 x4', 4);
  walkThrough(4, 5, '/3 +3 x3', 3);
  walkThrough(4321, 4, '<<', 3);
  walkThrough(0, 4, '+8 x5 <<', 3);
  walkThrough(50, 9, '/5 x3 <<', 4);

  // level 11 ~ level 20
  walkThrough(99, 100, '-8 x11 <<', 3);
  walkThrough(0, 404, '+8 x10 /2', 5);
  walkThrough(171, 23, 'x2 -9 <<', 4);
  walkThrough(0, 24, '+5 x4 x5 <<', 6);
  walkThrough(10, 100, 'x3 x2 -5', 4);
  walkThrough(0, 2, '+4 x9 <<', 5);
  walkThrough(0, 11, '1', 2);
  walkThrough(0, 101, '1 0', 3);
  walkThrough(0, 44, '2 x2', 3);
  walkThrough(0, 35, '+3 5', 2);

  // level 21 ~ level 30
  walkThrough(0, 56, '1 +5', 3);
  walkThrough(0, 9, '+2 /3 1', 4);
  walkThrough(15, 10, '0 +2 /5', 4);
  walkThrough(0, 210, '-5 +5 5 2', 5);
  walkThrough(4, 2020, '0 +4 /2', 5);
  walkThrough(0, 11, '12 <<', 4);
  walkThrough(0, 102, '10 +1 <<', 4);
  walkThrough(0, 222, '1 1=>2', 4);
  walkThrough(0, 93, '+6 x7 6=>9', 4);
  walkThrough(0, 2321, '1 2 1=>2 2=>3', 6);

  // level 31 ~ level 40
  walkThrough(0, 24, '+9 x2 8=>4', 5);
  walkThrough(11, 29, '/2 +3 1=>2 2=>9', 5);
  walkThrough(36, 20, '+3 /3 1=>2', 5);
  walkThrough(2, 15, '/3 1 x2 4=>5', 4);
  walkThrough(1234, 414, '23=>41 24=>14 12=>24 14=>2', 4);
  walkThrough(0, -85, '+6 5 -7', 4);
  walkThrough(0, 9, '-1 -2 x^2', 3);
  walkThrough(0, -120, 'x5 -6 4', 4);
  walkThrough(0, 144, '-1 2 x^2', 3);
  walkThrough(0, -6, '+4 +2 +/-', 3);

  // level 41 ~ level 50
  walkThrough(0, -13, '+3 -7 +/-', 4);
  walkThrough(0, 60, '+5 -10 x4 +/-', 4);
  walkThrough(44, 52, '+9 /2 x4 +/-', 5);
  walkThrough(9, 10, '+5 x5 +/-', 5);
  walkThrough(14, 12, '6 +5 /8 +/-', 5);
  walkThrough(55, 13, '+9 +/- <<', 4);
  walkThrough(0, 245, '-3 5 x4 +/-', 5);
  walkThrough(39, 12, 'x-3 /3 +9 +/-', 4);
  walkThrough(111, 126, 'x3 -9 +/- <<', 6);
  walkThrough(34, 3, '-5 +8 /7 +/-', 5);

  // level 51 ~ level 60
  walkThrough(25, 4, '-4 x-4 /3 /8 +/-', 5);
  walkThrough(0, 51, '+6 +9 reverse', 3);
  walkThrough(100, 101, '1 +9 reverse', 3);
  walkThrough(1101, 100, '-1 reverse', 4);
  walkThrough(0, 58, '+4 x4 -3 reverse', 4);
  walkThrough(6, 4, '1 /4 reverse', 3);
  walkThrough(15, 21, '+9 x5 reverse', 3);
  walkThrough(100, 13, '/2 reverse', 5);
  walkThrough(10, 11011, '1 reverse', 4);
  walkThrough(0, 102, '10 x4 +5 reverse', 4);

  // level 61 ~ level 70
  walkThrough(0, 7, '2 +1 /3 reverse', 4);
  walkThrough(0, 4, '5 x4 x2 reverse', 4);
  walkThrough(121, 212, '2 -1 reverse', 3);
  walkThrough(8, 9, 'x3 1 /5 reverse', 5);
  walkThrough(0, 13, '+7 +8 +9 reverse', 5);
  walkThrough(0, 123, '+3 1 -2 reverse', 6);
  walkThrough(0, 424, '6 +8 reverse', 5);
  walkThrough(7, 81, '-9 x3 +4 +/- reverse', 5);
  walkThrough(0, -43, '-5 +7 -9 reverse', 5);
  walkThrough(0, 28, '+6 -3 reverse <<', 7);

  // level 71 ~ level 80
  walkThrough(0, 136, '1 +2 x3 reverse', 5);
  walkThrough(0, -1, '+5 reverse +/-', 4);
  walkThrough(0, -25, '+4 x3 reverse +/-', 5);
  walkThrough(0, -5, '+7 x3 reverse +/-', 5);
  walkThrough(88, 41, '/4 -4 reverse', 4);
  walkThrough(100, 101, '0 x2 2=>10 0=>1 reverse', 5);
  walkThrough(0, 424, '/2 5 5=>4 reverse', 7);
  walkThrough(99, 100, '9 /9 reverse 1=>0', 5);
  walkThrough(8, 30, '2 -4 2=>3 reverse', 5);
  walkThrough(101, 222, '-1 reverse 0=>2', 5);

  // level 81 ~ level 90
  walkThrough(36, 500, 'x4 /3 1=>5 reverse', 5);
  walkThrough(0, 196, '1 +12 x13 reverse <<', 8);
  walkThrough(50, 101, '1=>10 +50 reverse 5=>1', 5);
  walkThrough(1, 2048, '2 x4 x10 reverse', 6);
  walkThrough(12, 123, '12 +1 12=>2 reverse', 5);
  walkThrough(86, 55, '+2 +14 reverse 0=>5', 6);
  walkThrough(0, 3, '1 sum', 4);
  walkThrough(1231, 4, 'sum 3=>1 2=>3', 3);
  walkThrough(0, 45, 'x9 4 x3 3=>5 sum', 5);
  walkThrough(424, 28, 'x4 4=>6 sum', 5);

  // level 91 ~ level 100
  walkThrough(3, 8, '3 +33 sum 3=>1', 4);
  walkThrough(24, 44, '/2 4 1=>2 sum', 4);
  walkThrough(142, 143, 'x9 +9 44=>43 sum', 4);
  walkThrough(24, 1, '/3 x4 5=>10 sum', 5);
  walkThrough(4, 100, '3 x3 +1 sum', 5);
  walkThrough(93, 8, '+4 x3 sum', 5);
  walkThrough(5, 16, 'x5 /2 sum 5=>2', 5);
  walkThrough(128, 64, 'x4 /4 sum 5=>16', 4);
  walkThrough(59, 121, '1 x5 15=>51 sum', 6);
  walkThrough(18, 5, 'x2 /3 12=>21 sum', 6);

  // level 101 ~ level 110
  walkThrough(9, 30, '-5 x-6 +/- sum', 4);
  walkThrough(105, -17, '-5 /5 x4 +/- sum', 5);
  walkThrough(36, 11, '-6 /3 +/- sum', 6);
  walkThrough(3, 64, '+3 sum x^3 0=>1', 5);
  walkThrough(2, 11, 'x2 10 sum x3 10=>1', 5);
  walkThrough(1123, 2311, '<shift', 2);
  walkThrough(5432, 3254, 'shift>', 2);
  walkThrough(101, 121, '+2 shift> <shift', 3);
  walkThrough(98, 1999, '1 9 89=>99 shift>', 4);
  walkThrough(70, 129, 'x3 9 shift>', 4);

  // level 111 ~ level 120
  walkThrough(120, 210, '+1 <shift +/-', 5);
  walkThrough(1001, 210, '+2 shift> 12=>0', 5);
  walkThrough(100, 501, '+5 0 <shift', 3);
  walkThrough(212, 3, '+11 3=>1 sum <shift', 4);
  walkThrough(356, 121, '-2 /3 shift>', 4);
  walkThrough(2152, 13, '25=>12 21=>3 12=>5 shift> reverse', 6);
  walkThrough(1025, 520, 'shift> 50=>0 25=>525 51=>5', 5);
  walkThrough(23, 2332, 'mirror', 1);
  walkThrough(0, 1221, '1 2 mirror', 3);
  walkThrough(91, 19, '+5 mirror sum', 6);

  // level 121 ~ level 130
  walkThrough(22, 116, '-3 6 mirror sum', 4);
  walkThrough(125, 20, '6=>2 0 mirror sum', 7);
  walkThrough(22, 3, 'sum /2 mirror <<', 4);
  walkThrough(0, 1111, '+2 x6 mirror 21=>11', 5);
  walkThrough(-1, 2020, 'x3 +8 +2 reverse mirror', 8);
  walkThrough(13, 112, '99=>60 /3 x3 mirror shift>', 6);
  walkThrough(140, 18, '-3 +9 /12 mirror <<', 6);
  walkThrough(17, 33, 'x2 -4 mirror <shift', 4);
  walkThrough(125, 20, 'mirror sum', 8);
  walkThrough(10, 15, '+2 [+]1', 3);

  // level 131 ~ level 140
  walkThrough(0, 14, '1 +2 [+]1', 4);
  walkThrough(0, 34, '2 3 [+]1', 3);
  walkThrough(0, 101, '2 +5 [+]2', 5);
  walkThrough(0, 28, '1 +2 [+]3', 5);
  walkThrough(0, 42, '-2 +5 x2 [+]1', 5);
  walkThrough(0, 25, '+2 x3 -3 [+]2', 5);
  walkThrough(5, 41, '+4 +8 x3 [+]2', 4);
  walkThrough(33, 31, 'x4 +2 +3 [+]1 sum', 5);
  walkThrough(25, 268, '+8 x2 x5 [+]1', 5);
  walkThrough(1, 1111, 'store', 2);

  // level 141 ~ level 150
  walkThrough(0, 121, '+1 store', 4);
  walkThrough(12, 122, 'store reverse <<', 4);
  walkThrough(10, 17, '+2 /3 reverse store', 5);
  walkThrough(23, 1234, 'x2 -5 store <shift', 4);
  walkThrough(125, 1025, 'x2 store <<', 6);
  walkThrough(23, 115, '-8 store +/-', 5);
  walkThrough(15, 16, 'store 11=>33 reverse sum', 4);
  walkThrough(0, 61, '5 << sum store', 7);
  walkThrough(0, 101, 'x6 5 store shift> 3=>1', 5);
  walkThrough(125, 12525, '1 /5 reverse store', 5);

  // level 151 ~ level 160
  walkThrough(70, 17, '8=>1 /2 0 store sum', 6);
  walkThrough(12, 101, '21=>0 12=>1 store mirror', 4);
  walkThrough(9, 3001, '39=>93 /3 store 31=>00', 7);
  walkThrough(0, 99, '1 inv10', 3);
  walkThrough(1, 2, '-1 inv10', 3);
  walkThrough(14, 15, '+5 x5 inv10', 3);
  walkThrough(21, 12, '-7 x5 inv10', 3);
  walkThrough(67, 13, '+3 reverse inv10', 4);
  walkThrough(23, 88, '-4 -2 reverse inv10', 5);

  // level 161 ~ level 170
  walkThrough(5, 105, 'x3 /9 store inv10', 4);
  walkThrough(24, 23, '+6 x3 reverse inv10', 4);
  walkThrough(7, 17, '+3 x3 x4 inv10', 4);
  walkThrough(35, 21, 'x9 /5 13=>10 inv10', 5);
  walkThrough(9, 18, 'x3 sum inv10', 5);
  walkThrough(12, 101, '+4 inv10 sum', 5);
  walkThrough(26, 99, '2 sum inv10', 6);
  walkThrough(15, 13, 'sum inv10 mirror', 7);
  walkThrough(78, 99, '1=>6 6=>11 inv10 /6 reverse', 6);
  walkThrough(34, 9, 'x6 inv10 <<', 4);
  walkThrough(0, 872, '8 88=>34 inv10 <<', 8);

  // level 171 ~ level 180
  walkThrough(5, 33, 'x7 +8 -9 x2 inv10', 5);
  walkThrough(12, 23, 'x5 sum store inv10', 6);
  walkThrough(1, 1991, 'store inv10', 4);
  walkThrough(12, 26, '<< sum store inv10', 4);
  walkThrough(51, 48, '+6 x3 inv10 reverse 4=>6', 6);
  walkThrough(0, 1, '+5 x3 /6 inv10 reverse', 6);
  walkThrough(369, 777, '93=>63 63=>33 36=>93 39=>33 inv10', 5);
  walkThrough(99, 10, '1 -1', 3, { from: 2, to: 0 });
  walkThrough(9, 64, '4 6', 2, { from: 2, to: 1 });
  walkThrough(50, 35, '+5 x3 x5', 3, { from: 2, to: 1 });

  // level 181 ~ level 190
  walkThrough(306, 131, '3 +1 x2', 4, { from: 3, to: 0 });
  walkThrough(321, 123, '/2 1 3 0', 5, { from: 3, to: 0 });
  walkThrough(525, 150, '+1 6 7 /2', 5, { from: 3, to: 0 });
  walkThrough(113, 212, '10 -2 3', 4, { from: 3, to: 0 });
  walkThrough(99, 13, 'sum mirror inv10', 4, { from: 3, to: 1 });
  walkThrough(25, 822, 'mirror 5 store <<', 5, { from: 3, to: 1 });
  walkThrough(45, 516, '+10 mirror reverse', 4, { from: 3, to: 1 });
  walkThrough(238, 212, '28=>21 -5 inv10 shift>', 4);
  walkThrough(58, 90, 'x6 inv10 shift>', 5);
  walkThrough(189, 500, '+8 x4 9 inv10 7=>0', 6, { from: 3, to: 0 });

  // level 190 ~ end
  walkThrough(234, 321, '9 +9 53=>32', 4, { from: 3, to: 0 });
  walkThrough(333, 123, '1 3 /2 [+]1', 4, { from: 3, to: 0 });
  walkThrough(613, 777, '5 x2 +3 reverse inv10', 5, { from: 3, to: 0 });
  walkThrough(60, 550, '+5 x5 2 inv10', 7, { from: 3, to: 1 });
  walkThrough(1234, 4321, '24=>13 12=>32 13=>21 23=>32 23=>43', 5);
  walkThrough(4, 750, '+6 4 x3 inv10', 7, { from: 3, to: 0 });
  walkThrough(3002, 3507, '7 3=>5 inv10 shift>', 6, { from: 4, to: 0 });
});
