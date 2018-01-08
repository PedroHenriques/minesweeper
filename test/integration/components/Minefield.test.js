'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('Minefield', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyMinefield;

  beforeEach(function () {
    sandbox.useFakeTimers();
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyMinefield = proxyquire('../../../src/js/components/Minefield', {
      'react': react,
    });
  });
  
  afterEach(function () {
    sandbox.restore();
  });
  
  describe('constructor()', function () {
    it('should call for the generation of a minefield correctly', function () {
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

      const props = {
        gameSeed: 'game seed',
        dimensions: { rows: 3, cols: 4 },
        numMines: 2,
        onValidTilesRevealed: sandbox.stub(),
      };
      const minefield = new proxyMinefield.Minefield(props);

      assert.deepEqual(minefield.state.minefield, expectedMinefield);
    });
  });

  describe('onMouseUp()', function () {
    describe('if a LMB click is fired', function () {
      it('should determine the tiles to be revealed correctly', function () {
        const props = {
          gameSeed: 'game seed',
          dimensions: { rows: 3, cols: 4 },
          numMines: 2,
          onValidTilesRevealed: sandbox.stub(),
        };
        const minefield = new proxyMinefield.Minefield(props);
        minefield.setState = doubles.setStateStub;

        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
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

        minefield.onMouseUp(1, 0, 0);
        
        assert.deepEqual(doubles.setStateStub.args[0][0].minefield, expectedMinefield);
      });
    });

    describe('if a LMB + RMB click is fired', function () {
      it('should determine the tiles to be revealed correctly', function () {
        const props = {
          gameSeed: 'game seed',
          dimensions: { rows: 3, cols: 4 },
          numMines: 2,
          onValidTilesRevealed: sandbox.stub(),
        };
        const minefield = new proxyMinefield.Minefield(props);
        minefield.setState = doubles.setStateStub;
        minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
        minefield.state.minefield[0].hasFlag = true;
        minefield.state.minefield[1].revealed = true;
        minefield.state.minefield[6].hasFlag = true;

        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        ];

        minefield.onMouseUp(1, 0, 0);
        
        assert.deepEqual(doubles.setStateStub.args[0][0].minefield, expectedMinefield);
      });
    });
  });
});