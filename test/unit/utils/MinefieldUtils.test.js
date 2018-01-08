'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const mineGenerators = require('../../../src/js/utils/MineGenerators.js');

describe('MinefieldUtils', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyUtils;
  let testData;

  beforeEach(function () {
    testData = {};
    doubles = {};
    doubles.mineGeneratorsStub = sandbox.stub(mineGenerators);
    doubles.seedrandomStub = sandbox.stub();
    doubles.prng = sandbox.stub();
    proxyUtils = proxyquire('../../../src/js/utils/MinefieldUtils.js', {
      './MineGenerators': doubles.mineGeneratorsStub,
      '../data': testData,
      'seedrandom': doubles.seedrandomStub,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('generateMinefield()', function () {
    it('should call for the generation of the mines, populate the minefield with the default values, the mines, the number of adjacent mines, the initial revealed patch and return the minefield object', function () {
      doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
      doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 4}, 2, doubles.prng).returns([0, 10]);
      doubles.prng.withArgs().returns(0.99);
      testData.initialPatchMinSize = 0;

      const expectedMinefield = [
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
      ];
      assert.deepEqual(
        proxyUtils.generateMinefield('game seed', {rows: 3, cols: 4}, 2),
        { minefield: expectedMinefield, numRevealed: 6 }
      );
      assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      assert.isTrue(doubles.prng.calledOnce);
    });

    describe('if the random number generated points to the first empty patch', function () {
      it('should return the minefield with the second empty patch revealed', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 4}, 2, doubles.prng).returns([0, 10]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
  
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 4}, 2),
          { minefield: expectedMinefield, numRevealed: 4 }
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
        assert.isTrue(doubles.prng.calledOnce);
      });
    });

    describe('if an empty patch has less tiles than the minimum size', function () {
      it('should ignore it', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 4}, 2, doubles.prng).returns([0, 10]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0.4;
  
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 4}, 2),
          { minefield: expectedMinefield, numRevealed: 6 }
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
        assert.isTrue(doubles.prng.calledOnce);
      });
    });

    describe('if no valid empty patch was found', function () {
      it('should discard the minefield and generate a new one', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 4}, 2, doubles.prng).onCall(0).returns([0, 10]);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 4}, 2, doubles.prng).onCall(1).returns([0, 1]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0.8;
  
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 4}, 2),
          { minefield: expectedMinefield, numRevealed: 10 }
        );
        assert.strictEqual(doubles.mineGeneratorsStub.pureRNG.callCount, 2);
        assert.isTrue(doubles.prng.calledOnce);
      });
    });

    describe('if a mine is on the top row', function () {
      it('should avoid checking out of bound indexes', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 1, doubles.prng).returns([1]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 1),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a mine is on the bottom row', function () {
      it('should avoid checking out of bound indexes', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 1, doubles.prng).returns([7]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 1),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a mine is on the right most column', function () {
      it('should avoid checking out of bound indexes', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 1, doubles.prng).returns([5]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 1),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a mine is on the left most column', function () {
      it('should avoid checking out of bound indexes', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 1, doubles.prng).returns([3]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 1),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 1 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 1', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 1, doubles.prng).returns([0]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 1),
          { minefield: expectedMinefield, numRevealed: 8}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 2 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 2', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 2, doubles.prng).returns([0, 1]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 2),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 3 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 3', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 3, doubles.prng).returns([0, 1, 2]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 3 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 3),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 4 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 4', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 3, cols: 3}, 4, doubles.prng).returns([0, 1, 2, 3]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 3 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 4 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 3, cols: 3}, 4),
          { minefield: expectedMinefield, numRevealed: 4}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 5 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 5', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 4, cols: 3}, 5, doubles.prng).returns([0, 1, 2, 3, 5]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 5 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 4, cols: 3}, 5),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 6 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 6', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 4, cols: 3}, 6, doubles.prng).returns([0, 1, 2, 3, 5, 6]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 3 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 6 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 3 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 4, cols: 3}, 6),
          { minefield: expectedMinefield, numRevealed: 4}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 7 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 7', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 5, cols: 3}, 7, doubles.prng).returns([0, 1, 2, 3, 5, 6, 7]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 7 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 3 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 3 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 5, cols: 3}, 7),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });

    describe('if a tile has 8 adjacent mine', function () {
      it('should set that tile\'s numAdjacentMines property to 8', function () {
        doubles.seedrandomStub.withArgs('game seed').returns(doubles.prng);
        doubles.mineGeneratorsStub.pureRNG.withArgs({rows: 5, cols: 3}, 8, doubles.prng).returns([0, 1, 2, 3, 5, 6, 7, 8]);
        doubles.prng.withArgs().returns(0);
        testData.initialPatchMinSize = 0;
        
        const expectedMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 8 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 4 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 3 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
        assert.deepEqual(
          proxyUtils.generateMinefield('game seed', {rows: 5, cols: 3}, 8),
          { minefield: expectedMinefield, numRevealed: 6}
        );
        assert.isTrue(doubles.mineGeneratorsStub.pureRNG.calledOnce);
      });
    });
  });

  describe('findTileIndexes()', function () {
    it('should return the indexes calculated by applying the offsets to the index of focus, that are within the provided dimensions', function () {
      const expectedReturn = [2, 5];
      assert.deepEqual(proxyUtils.findTileIndexes({rows: 3, cols: 3}, 1, [[-1, 0], [0, 1], [1, 1]]), expectedReturn);
    });

    describe('if the index of focus is in the top row', function () {
      it('should not return indexes that are out of bounds', function () {
        const expectedReturn = [2, 5];
        assert.deepEqual(proxyUtils.findTileIndexes({rows: 3, cols: 3}, 1, [[-1, -1], [0, 1], [1, 1]]), expectedReturn);
      });
    });
    
    describe('if the index of focus is in the bottom row', function () {
      it('should not return indexes that are out of bounds', function () {
        const expectedReturn = [3, 8];
        assert.deepEqual(proxyUtils.findTileIndexes({rows: 3, cols: 3}, 7, [[-1, -1], [0, 1], [1, 1]]), expectedReturn);
      });
    });
    
    describe('if the index of focus is in the left column', function () {
      it('should not return indexes that are out of bounds', function () {
        const expectedReturn = [4, 7];
        assert.deepEqual(proxyUtils.findTileIndexes({rows: 3, cols: 3}, 3, [[-1, -1], [0, 1], [1, 1]]), expectedReturn);
      });
    });
    
    describe('if the index of focus is in the right column', function () {
      it('should not return indexes that are out of bounds', function () {
        const expectedReturn = [1];
        assert.deepEqual(proxyUtils.findTileIndexes({rows: 3, cols: 3}, 5, [[-1, -1], [0, 1], [1, 1]]), expectedReturn);
      });
    });
  });

  describe('calcTilesToReveal()', function () {
    describe('if the tile in focus has a mine', function () {
      it('should return just the index of the tile in focus', function () {
        const minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
  
        assert.sameDeepMembers(
          proxyUtils.calcTilesToReveal(minefield, 1, { rows: 3, cols: 4 }),
          [1]
        );
      });
    });

    describe('if the tile in focus is not empty', function () {
      it('should return just the index of the tile in focus', function () {
        const minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
  
        assert.sameDeepMembers(
          proxyUtils.calcTilesToReveal(minefield, 2, { rows: 3, cols: 4 }),
          [2]
        );
      });
    });

    describe('if the tile in focus is empty', function () {
      it('should return the index of the tile in focus and all its valid and not revealed adjacent tile indexes', function () {
        const minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];
  
        assert.sameDeepMembers(
          proxyUtils.calcTilesToReveal(minefield, 12, { rows: 5, cols: 5 }),
          [6, 7, 8, 11, 12, 13, 16, 17, 18]
        );
      });

      describe('if a valid adjacent tile is already revealed', function () {
        it('should not add that tile index to the return value', function () {
          const minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },

            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },

            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },

            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },

            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          ];
    
          assert.sameDeepMembers(
            proxyUtils.calcTilesToReveal(minefield, 12, { rows: 5, cols: 5 }),
            [6, 7, 8, 11, 12, 13, 17, 18]
          );
        });
      });

      describe('if there are other empty tiles connected to the tile in focus', function () {
        it('should reveal all connected empty tiles and their non-empty immediate neighbors', function () {
          const minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          ];
    
          assert.sameDeepMembers(
            proxyUtils.calcTilesToReveal(minefield, 12, { rows: 5, cols: 5 }),
            [5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21]
          );
        });
      });
    });
  });
});