'use strict';
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const MinefieldUtils = require('../../../src/js/utils/MinefieldUtils');

describe('MinefieldUtils', function () {
  const sandbox = sinon.createSandbox();
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('generateMinefield()', function () {
    it('should return a valid minefield', function () {
      const expectedMinefield = [
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
      ];

      assert.deepEqual(
        MinefieldUtils.generateMinefield('game seed', { rows: 3, cols: 4 }, 2),
        { minefield: expectedMinefield, numRevealed: 4 }
      );
    });
  });
});