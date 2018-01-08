'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");
const tile = require('../../../src/js/components/Tile.js');
const minefieldUtils = require('../../../src/js/utils/MinefieldUtils.js');

describe('Minefield', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyMinefield;
  let testStyles;

  beforeEach(function () {
    testStyles = {
      minefield: 'minefield css styles',
    };
    sandbox.useFakeTimers();
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.tileStub = sandbox.stub(tile);
    doubles.minefieldUtilsStub = sandbox.stub(minefieldUtils);
    proxyMinefield = proxyquire('../../../src/js/components/Minefield.js', {
      'react': react,
      './Tile': doubles.tileStub,
      '../utils/MinefieldUtils': doubles.minefieldUtilsStub,
      '../styles': testStyles,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should call for a minefield to be generated, store it on the component state and inform the Game component of how many tiles are revealed at the start of the game', function () {
      const expectedMinefield = [
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
        { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
      ];
      doubles.minefieldUtilsStub.generateMinefield.withArgs('game seed', {rows: 2, cols: 3}, 2)
        .returns({ minefield: expectedMinefield, numRevealed: 1 });

      const props = {
        gameSeed: 'game seed',
        dimensions: {rows: 2, cols: 3},
        numMines: 2,
        onValidTilesRevealed: sandbox.stub(),
      };
      const minefield = new proxyMinefield.Minefield(props);
      assert.isTrue(doubles.minefieldUtilsStub.generateMinefield.calledOnce);
      assert.deepEqual(minefield.state, { minefield: expectedMinefield });
      assert.isTrue(props.onValidTilesRevealed.calledOnce);
      assert.deepEqual(props.onValidTilesRevealed.args[0], [1]);
    });
  });

  describe('onMouseUp()', function () {
    describe('if the LMB was released and no other buttons are being held down', function () {
      describe('if the tile that was clicked is not revealed', function () {
        it('should update the state for the tiles that should be revealed, inform the Game component of the number of non mine tiles revealed and return void', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const initialMinefield = [
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          ];

          const props = {
            dimensions: { rows: 2, cols: 3 },
            numMines: 4,
            onValidTilesRevealed: sandbox.stub(),
          };
          const minefield = new proxyMinefield.Minefield(props);
          minefield.setState = doubles.setStateStub;
          minefield.state.minefield = initialMinefield;

          doubles.minefieldUtilsStub.calcTilesToReveal.withArgs(
            initialMinefield, 2, props.dimensions
          ).returns([2, 5]);

          const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
          expectedMinefield[2].revealed = true;
          expectedMinefield[5].revealed = true;

          assert.isUndefined(minefield.onMouseUp(2, 0, 0));
          assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
          assert.isTrue(doubles.setStateStub.calledOnce);
          assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
          assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
          assert.isTrue(props.onValidTilesRevealed.calledTwice);
          assert.deepEqual(props.onValidTilesRevealed.args[1], [2]);
        });

        describe('if the game has ended', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
  
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              gameEnded: true,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
  
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });

          describe('if the tile has a mine', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
    
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });

          describe('if the tile has a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
    
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });

          describe('if the tile has a mine and a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
    
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
        });

        describe('if the number of non mine tiles revealed is zero', function () {
          it('should not inform the Game component of the number of non mine tiles revealed', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            doubles.minefieldUtilsStub.calcTilesToReveal.withArgs(
              initialMinefield, 2, props.dimensions
            ).returns([]);
    
            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
            assert.isTrue(doubles.setStateStub.calledOnce);
            assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if the tile has a mine', function () {
          it('should update the state for the tiles that should be revealed, inform the Game component that a mine was blown and the number of non mine tiles revealed and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
              onExplosion: sandbox.stub()
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            doubles.minefieldUtilsStub.calcTilesToReveal.withArgs(
              initialMinefield, 2, props.dimensions
            ).returns([2, 3]);
    
            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
            expectedMinefield[2].revealed = true;
            expectedMinefield[3].revealed = true;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
            assert.isTrue(doubles.setStateStub.calledOnce);
            assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
            assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
            assert.isTrue(props.onExplosion.calledOnce);
            assert.deepEqual(props.onExplosion.args[0], []);
            assert.isTrue(props.onExplosion.calledBefore(props.onValidTilesRevealed));
            assert.isTrue(props.onValidTilesRevealed.calledTwice);
            assert.deepEqual(props.onValidTilesRevealed.args[1], [1]);
          });

          describe('if the number of non mine tiles revealed is zero', function () {
            it('should not inform the Game component of the number of non mine tiles revealed', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              ];
      
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub()
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
      
              doubles.minefieldUtilsStub.calcTilesToReveal.withArgs(
                initialMinefield, 2, props.dimensions
              ).returns([2]);
      
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              expectedMinefield[2].revealed = true;
      
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
              assert.isTrue(doubles.setStateStub.calledOnce);
              assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onExplosion));
              assert.isTrue(props.onExplosion.calledOnce);
              assert.deepEqual(props.onExplosion.args[0], []);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
        });

        describe('if the tile has a flag', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if the tile has a flag and a mine', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if a timeout is registered', function () {
          it('should clear the timeout and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            ];
  
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 1,
              onValidTilesRevealed: sandbox.stub(),
              onExplosion: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
            assert.isUndefined(minefield.onMouseUp(1, 0, 0));
            assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
            assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
            assert.isTrue(props.onExplosion.notCalled);
          });

          describe('if the tile has a mine', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });

          describe('if the tile has a flag', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });

          describe('if the tile has a flag and a mine', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });
        });
      });

      describe('if the tile that was clicked is already revealed', function () {
        it('should skip any processing and return void', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const initialMinefield = [
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
          ];
  
          const props = {
            dimensions: { rows: 2, cols: 3 },
            numMines: 4,
            onValidTilesRevealed: sandbox.stub(),
          };
          const minefield = new proxyMinefield.Minefield(props);
          minefield.setState = doubles.setStateStub;
          minefield.state.minefield = initialMinefield;
  
          assert.isUndefined(minefield.onMouseUp(2, 0, 0));
          assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
          assert.isTrue(doubles.setStateStub.notCalled);
          assert.isTrue(props.onValidTilesRevealed.calledOnce);
        });

        describe('if the game has ended', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              gameEnded: true,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });

          describe('if the tile has a mine', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
      
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
      
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });

          describe('if the tile has a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: true, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
      
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
      
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });

          describe('if the tile has a mine and a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];
      
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
      
              assert.isUndefined(minefield.onMouseUp(2, 0, 0));
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
        });

        describe('if the tile has a mine', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if the tile has a flag', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: true, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if the tile has a mine and a flag', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];
    
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;
    
            assert.isUndefined(minefield.onMouseUp(2, 0, 0));
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
          });
        });

        describe('if a timeout is registered', function () {
          it('should clear the timeout, for all the adjacent tiles determine which to reveal, inform the Game component of the number of non mine tiles revealed and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
              { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            ];
  
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 1,
              onValidTilesRevealed: sandbox.stub(),
              onExplosion: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            doubles.setStateStub.callsFake((newState) => {
              minefield.state.minefield = newState.minefield;
            });

            doubles.minefieldUtilsStub.findTileIndexes.withArgs(
              props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
            ).returns([0, 2, 3, 4, 5]);
  
            doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([1, 2, 4, 5]);
            doubles.minefieldUtilsStub.calcTilesToReveal.onCall(1).returns([3]);
            
            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
            expectedMinefield[1].revealed = true;
            expectedMinefield[2].revealed = true;
            expectedMinefield[3].revealed = true;
            expectedMinefield[4].revealed = true;
            expectedMinefield[5].revealed = true;

            minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
            assert.isUndefined(minefield.onMouseUp(1, 0, 0));
            assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
            assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
            assert.strictEqual(doubles.minefieldUtilsStub.calcTilesToReveal.callCount, 2);
            assert.strictEqual(doubles.setStateStub.callCount, 2);
            assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[1], [expectedMinefield, 3, props.dimensions]);
            assert.deepEqual(doubles.setStateStub.args[1], [{ minefield: expectedMinefield }]);
            assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
            assert.strictEqual(props.onValidTilesRevealed.callCount, 3);
            assert.deepEqual(props.onValidTilesRevealed.args, [[1], [4], [1]]);
            assert.isTrue(props.onExplosion.notCalled);
          });

          describe('if the number of flags is lower than the number of mines in the adjacent tiles', function () {
            it('should not reveal any of the adjacent tiles', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2, 3, 4, 5]);
  
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });

          describe('if the number of flags is greater than the number of mines in the adjacent tiles', function () {
            it('should execute the normal behavior', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2, 3, 4, 5]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([2]);
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(1).returns([3]);
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(2).returns([4]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              expectedMinefield[2].revealed = true;
              expectedMinefield[3].revealed = true;
              expectedMinefield[4].revealed = true;
    
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.strictEqual(doubles.minefieldUtilsStub.calcTilesToReveal.callCount, 3);
              assert.strictEqual(doubles.setStateStub.callCount, 3);
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[2], [expectedMinefield, 4, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[2], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
              assert.strictEqual(props.onValidTilesRevealed.callCount, 4);
              assert.deepEqual(props.onValidTilesRevealed.args, [[1], [1], [1], [1]]);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });

          describe('if the number of flags is equal to the number of mines in the adjacent tiles', function () {
            it('should execute the normal behavior', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([2]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
    
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
              assert.isTrue(doubles.setStateStub.calledOnce);
              expectedMinefield[2].revealed = true;
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[0], [expectedMinefield, 2, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
              assert.isTrue(props.onValidTilesRevealed.calledTwice);
              assert.deepEqual(props.onValidTilesRevealed.args[1], [1]);
              assert.isTrue(props.onExplosion.notCalled);
            });
          });

          describe('if an adjacent tile has a mine', function () {
            it('should inform the Game component that a mine was exploded', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([0]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
              assert.isTrue(doubles.setStateStub.calledOnce);
              expectedMinefield[0].revealed = true;
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[0], [expectedMinefield, 0, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onExplosion));
              assert.isTrue(props.onExplosion.calledOnce);
              assert.deepEqual(props.onExplosion.args[0], []);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
          
          describe('if an adjacent tile has a flag', function () {
            it('should not reveal that tile', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([2]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
          
          describe('if an adjacent tile has a mine and a flag', function () {
            it('should not reveal that tile', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleRightClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 0, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
            });
          });
        });
      });
    });

    describe('if the RMB was released and no other buttons are being held down', function () {
      describe('if the tile that was clicked is not revealed', function () {
        describe('if the tile does not have a flag', function () {
          it('should update its state to having a flag, inform the Game component that a flag was added and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: true,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
            expectedMinefield[0].hasFlag = true;

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.calledOnce);
            assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
            assert.isTrue(props.onFlagsChanged.calledOnce);
            assert.deepEqual(props.onFlagsChanged.args[0], [1]);
          });
        });

        describe('if the tile has a flag', function () {
          it('should update its state to not having a flag, inform the Game component that a flag was removed and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: true,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
            expectedMinefield[0].hasFlag = false;

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.calledOnce);
            assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
            assert.isTrue(props.onFlagsChanged.calledOnce);
            assert.deepEqual(props.onFlagsChanged.args[0], [-1]);
          });
        });

        describe('if the game configuration has flags disabled', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: false,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });
        });

        describe('if the game has ended', function () {
          describe('if the tile does not have a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: false,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the tile has a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: false,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the game configuration has flags disabled', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: true,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
        });

        describe('if a timeout is registered', function () {
          it('should clear the timeout and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            ];
  
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 1,
              flagsEnabled: true,
              onValidTilesRevealed: sandbox.stub(),
              onExplosion: sandbox.stub(),
              onFlagsChanged: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
            assert.isUndefined(minefield.onMouseUp(1, 2, 0));
            assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
            assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
            assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onValidTilesRevealed.calledOnce);
            assert.isTrue(props.onExplosion.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });

          describe('if the tile has a mine', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the tile has a flag', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the tile has a flag and a mine', function () {
            it('should clear the timeout and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.notCalled);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
        });
      });

      describe('if the tile that was clicked is already revealed', function () {
        describe('if the tile does not have a flag', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: true,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });
        });

        describe('if the tile has a flag', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: true,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });
        });

        describe('if the game configuration has flags disabled', function () {
          it('should skip any processing and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
            ];

            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 4,
              flagsEnabled: false,
              onFlagsChanged: sandbox.stub(),
              onValidTilesRevealed: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));

            assert.isUndefined(minefield.onMouseUp(0, 2, 0));
            assert.isTrue(doubles.setStateStub.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });
        });

        describe('if the game has ended', function () {
          describe('if the tile does not have a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: false,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the tile has a flag', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: false,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the game configuration has flags disabled', function () {
            it('should skip any processing and return void', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: true, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              ];

              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 4,
                gameEnded: true,
                flagsEnabled: true,
                onFlagsChanged: sandbox.stub(),
                onValidTilesRevealed: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              assert.isUndefined(minefield.onMouseUp(0, 2, 0));
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
        });

        describe('if a timeout is registered', function () {
          it('should clear the timeout, for all the adjacent tiles determine which to reveal, inform the Game component of the number of non mine tiles revealed and return void', function () {
            doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
            const initialMinefield = [
              { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
              { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
              { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            ];
  
            const props = {
              dimensions: { rows: 2, cols: 3 },
              numMines: 1,
              flagsEnabled: true,
              onValidTilesRevealed: sandbox.stub(),
              onExplosion: sandbox.stub(),
              onFlagsChanged: sandbox.stub(),
            };
            const minefield = new proxyMinefield.Minefield(props);
            minefield.setState = doubles.setStateStub;
            minefield.state.minefield = initialMinefield;

            doubles.setStateStub.callsFake((newState) => {
              minefield.state.minefield = newState.minefield;
            });

            doubles.minefieldUtilsStub.findTileIndexes.withArgs(
              props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
            ).returns([0, 2, 3, 4, 5]);
  
            doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([1, 2, 4, 5]);
            doubles.minefieldUtilsStub.calcTilesToReveal.onCall(1).returns([3]);
  
            const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
            expectedMinefield[1].revealed = true;
            expectedMinefield[2].revealed = true;
            expectedMinefield[3].revealed = true;
            expectedMinefield[4].revealed = true;
            expectedMinefield[5].revealed = true;
  
            minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
            assert.isUndefined(minefield.onMouseUp(1, 2, 0));
            assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
            assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
            assert.strictEqual(doubles.minefieldUtilsStub.calcTilesToReveal.callCount, 2);
            assert.strictEqual(doubles.setStateStub.callCount, 2);
            assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[1], [expectedMinefield, 3, props.dimensions]);
            assert.deepEqual(doubles.setStateStub.args[1], [{ minefield: expectedMinefield }]);
            assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
            assert.strictEqual(props.onValidTilesRevealed.callCount, 3);
            assert.deepEqual(props.onValidTilesRevealed.args, [[1], [4], [1]]);
            assert.isTrue(props.onExplosion.notCalled);
            assert.isTrue(props.onFlagsChanged.notCalled);
          });

          describe('if the number of flags is lower than the number of mines in the adjacent tiles', function () {
            it('should not reveal any of the adjacent tiles', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;

              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2, 3, 4, 5]);
  
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the number of flags is greater than the number of mines in the adjacent tiles', function () {
            it('should execute the normal behavior', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2, 3, 4, 5]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([2]);
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(1).returns([3]);
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(2).returns([4]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              expectedMinefield[2].revealed = true;
              expectedMinefield[3].revealed = true;
              expectedMinefield[4].revealed = true;
    
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.strictEqual(doubles.minefieldUtilsStub.calcTilesToReveal.callCount, 3);
              assert.strictEqual(doubles.setStateStub.callCount, 3);
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[2], [expectedMinefield, 4, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[2], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
              assert.strictEqual(props.onValidTilesRevealed.callCount, 4);
              assert.deepEqual(props.onValidTilesRevealed.args, [[1], [1], [1], [1]]);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if the number of flags is equal to the number of mines in the adjacent tiles', function () {
            it('should execute the normal behavior', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([2]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
    
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
              assert.isTrue(doubles.setStateStub.calledOnce);
              expectedMinefield[2].revealed = true;
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[0], [expectedMinefield, 2, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onValidTilesRevealed));
              assert.isTrue(props.onValidTilesRevealed.calledTwice);
              assert.deepEqual(props.onValidTilesRevealed.args[1], [1]);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });

          describe('if an adjacent tile has a mine', function () {
            it('should inform the Game component that a mine was exploded', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0, 2]);
    
              doubles.minefieldUtilsStub.calcTilesToReveal.onCall(0).returns([0]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.calledOnce);
              assert.isTrue(doubles.setStateStub.calledOnce);
              expectedMinefield[0].revealed = true;
              assert.deepEqual(doubles.minefieldUtilsStub.calcTilesToReveal.args[0], [expectedMinefield, 0, props.dimensions]);
              assert.deepEqual(doubles.setStateStub.args[0], [{ minefield: expectedMinefield }]);
              assert.isTrue(doubles.setStateStub.calledBefore(props.onExplosion));
              assert.isTrue(props.onExplosion.calledOnce);
              assert.deepEqual(props.onExplosion.args[0], []);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
          
          describe('if an adjacent tile has a flag', function () {
            it('should not reveal that tile', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([2]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
          
          describe('if an adjacent tile has a mine and a flag', function () {
            it('should not reveal that tile', function () {
              doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
              const initialMinefield = [
                { revealed: false, hasMine: true, hasFlag: true, numAdjacentMines: 0 },
                { revealed: true, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 1 },
                { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
              ];
    
              const props = {
                dimensions: { rows: 2, cols: 3 },
                numMines: 1,
                flagsEnabled: true,
                onValidTilesRevealed: sandbox.stub(),
                onExplosion: sandbox.stub(),
                onFlagsChanged: sandbox.stub(),
              };
              const minefield = new proxyMinefield.Minefield(props);
              minefield.setState = doubles.setStateStub;
              minefield.state.minefield = initialMinefield;
  
              doubles.setStateStub.callsFake((newState) => {
                minefield.state.minefield = newState.minefield;
              });
  
              doubles.minefieldUtilsStub.findTileIndexes.withArgs(
                props.dimensions, 1, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
              ).returns([0]);
    
              const expectedMinefield = JSON.parse(JSON.stringify(initialMinefield));
              
              minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 1);
              assert.isUndefined(minefield.onMouseUp(1, 2, 0));
              assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
              assert.isTrue(doubles.minefieldUtilsStub.findTileIndexes.calledOnce);
              assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
              assert.isTrue(doubles.setStateStub.notCalled);
              assert.isTrue(props.onExplosion.notCalled);
              assert.isTrue(props.onValidTilesRevealed.calledOnce);
              assert.isTrue(props.onFlagsChanged.notCalled);
            });
          });
        });
      });
    });

    describe('if the LMB was released and the RMB is being held down', function () {
      it('should register a time out of 500ms before treating it as a left click and return void', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const initialMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
        ];

        const props = {
          dimensions: { rows: 2, cols: 2 },
          numMines: 2,
          onValidTilesRevealed: sandbox.stub(),
        };
        const minefield = new proxyMinefield.Minefield(props);
        minefield.setState = doubles.setStateStub;
        minefield.state.minefield = initialMinefield;

        assert.isUndefined(minefield.onMouseUp(1, 0, 2));
        const timerKeys = Object.keys(sandbox.clock.timers);
        assert.strictEqual(timerKeys.length, 1);
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].type, 'Timeout');
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].func, minefield.handleLeftClick);
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].delay, 500);
        assert.deepEqual(sandbox.clock.timers[timerKeys[0]].args, [1]);
        assert.isTrue(doubles.setStateStub.notCalled);
        assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
      });

      describe('if the game has ended', function () {
        it('should skip any processing and return void', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const initialMinefield = [
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          ];
  
          const props = {
            dimensions: { rows: 2, cols: 2 },
            numMines: 2,
            gameEnded: true,
            onValidTilesRevealed: sandbox.stub(),
          };
          const minefield = new proxyMinefield.Minefield(props);
          minefield.setState = doubles.setStateStub;
          minefield.state.minefield = initialMinefield;
  
          assert.isUndefined(minefield.onMouseUp(1, 0, 2));
          assert.isUndefined(sandbox.clock.timers);
          assert.isTrue(doubles.setStateStub.notCalled);
          assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
        });
      });
    });

    describe('if the RMB was released and the LMB is being held down', function () {
      it('should register a time out of 500ms before treating it as a right click and return void', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const initialMinefield = [
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
          { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
        ];

        const props = {
          dimensions: { rows: 2, cols: 2 },
          numMines: 2,
          onValidTilesRevealed: sandbox.stub(),
        };
        const minefield = new proxyMinefield.Minefield(props);
        minefield.setState = doubles.setStateStub;
        minefield.state.minefield = initialMinefield;

        assert.isUndefined(minefield.onMouseUp(1, 2, 1));
        const timerKeys = Object.keys(sandbox.clock.timers);
        assert.strictEqual(timerKeys.length, 1);
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].type, 'Timeout');
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].func, minefield.handleRightClick);
        assert.strictEqual(sandbox.clock.timers[timerKeys[0]].delay, 500);
        assert.deepEqual(sandbox.clock.timers[timerKeys[0]].args, [1]);
        assert.isTrue(doubles.setStateStub.notCalled);
        assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
      });

      describe('if the game has ended', function () {
        it('should skip any processing and return void', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const initialMinefield = [
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 2 },
            { revealed: false, hasMine: true, hasFlag: false, numAdjacentMines: 1 },
          ];
  
          const props = {
            dimensions: { rows: 2, cols: 2 },
            numMines: 2,
            gameEnded: true,
            onValidTilesRevealed: sandbox.stub(),
          };
          const minefield = new proxyMinefield.Minefield(props);
          minefield.setState = doubles.setStateStub;
          minefield.state.minefield = initialMinefield;
  
          assert.isUndefined(minefield.onMouseUp(1, 2, 1));
          assert.isUndefined(sandbox.clock.timers);
          assert.isTrue(doubles.setStateStub.notCalled);
          assert.isTrue(doubles.minefieldUtilsStub.calcTilesToReveal.notCalled);
        });
      });
    });
  });

  describe('componentWillUnmount()', function () {
    describe('if a timeout is registered', function () {
      it('should clear the timeout', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const minefield = new proxyMinefield.Minefield({ onValidTilesRevealed: sandbox.stub() });
        minefield.timeoutId = global.setTimeout(minefield.handleLeftClick, 500, 0);
        minefield.componentWillUnmount();
        assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
      });
    });
  });

  describe('render()', function () {
    it('should return a div element with the Tile components inside', function () {
      doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
      const minefield = new proxyMinefield.Minefield({
        gameEnded: false, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 3, cols: 2 },
        viewport: { width: 0, height: 1 }
      });
      minefield.state.minefield = [
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
      ];

      testStyles.app = {
        maxWidth: '90vw', maxHeight: '95vh', minWidth: '0px', minHeight: '0px', padding: '2vmin'
      };
      testStyles.game = { width: '100%', height: 'calc(90% - 0px)' };
      testStyles.minefield = { width: '100%', height: 'calc(90% - 0px)' };
      const expectedMaxEdgeLength = 0;

      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 0,
        index: 0,
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
        lastInRow: true,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-0');
      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 1,
        index: 1,
        revealed: true,
        hasMine: true,
        hasFlag: true,
        numAdjacentMines: 5,
        lastInRow: false,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-1');
      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 2,
        index: 2,
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
        lastInRow: true,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-2');
      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 3,
        index: 3,
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
        lastInRow: false,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-3');
      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 4,
        index: 4,
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
        lastInRow: true,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-4');
      doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
        key: 5,
        index: 5,
        revealed: false,
        hasMine: false,
        hasFlag: false,
        numAdjacentMines: 0,
        lastInRow: false,
        maxEdgeLength: expectedMaxEdgeLength,
        onMouseUp: minefield.onMouseUp,
      }).returns('tile-5');
      doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1', 'tile-2', 'tile-3', 'tile-4', 'tile-5']).returns('Minefield component');
      
      assert.strictEqual(minefield.render(), 'Minefield component');
    });

    describe('if the game has ended', function () {
      it('should reveal all the tiles', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const minefield = new proxyMinefield.Minefield({
          gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 5, cols: 6 },
          viewport: { width: 0, height: 1 }
        });
        minefield.state.minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
          { revealed: false, hasMine: false, hasFlag: true, numAdjacentMines: 2 },
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
        ];

        testStyles.app = {
          maxWidth: '90vw', maxHeight: '95vh', minWidth: '0px', minHeight: '0px', padding: '2vmin'
        };
        testStyles.game = { width: '100%', height: 'calc(90% - 0px)' };
        testStyles.minefield = { width: '100%', height: 'calc(80% - 0px)' };
        const expectedMaxEdgeLength = 0;
  
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 0,
          index: 0,
          revealed: true,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 0,
          lastInRow: true,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-0');
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 1,
          index: 1,
          revealed: true,
          hasMine: true,
          hasFlag: true,
          numAdjacentMines: 5,
          lastInRow: false,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-1');
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 2,
          index: 2,
          revealed: true,
          hasMine: false,
          hasFlag: true,
          numAdjacentMines: 2,
          lastInRow: false,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-2');
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 3,
          index: 3,
          revealed: true,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 0,
          lastInRow: false,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-3');
        doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1', 'tile-2', 'tile-3']).returns('Minefield component');
  
        assert.strictEqual(minefield.render(), 'Minefield component');
      });
    });

    describe('if the minefield has an equal number of rows and cols', function () {
      describe('if the div#minefield\'s width is lower than its height', function () {
        it('should calculate the Tile maximum edge length to be the available width / #cols floored to an integer', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const minefield = new proxyMinefield.Minefield({
            gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 5, cols: 5 },
            viewport: { width: 800, height: 1000 }
          });
          minefield.state.minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
          ];

          testStyles.app = {
            maxWidth: '90vw', maxHeight: '95vh', minWidth: '0px', minHeight: '0px', padding: '4vmin'
          };
          testStyles.game = { width: '100%', height: 'calc(90% - 26px)' };
          testStyles.minefield = { width: '100%', height: 'calc(95% - 10px)' };
          /*
            app = { width: 656, height: 886 }
            game = { width: 656, height: 771.4 }
            minefield = { width: 656, height: 722.83 }
            widthLength = 131
            heightLength = 144
          */
          const expectedMaxEdgeLength = 131;
    
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 0,
            index: 0,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: true,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-0');
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 1,
            index: 1,
            revealed: true,
            hasMine: true,
            hasFlag: true,
            numAdjacentMines: 5,
            lastInRow: false,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-1');
          doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
    
          assert.strictEqual(minefield.render(), 'Minefield component');
        });
      });

      describe('if the div#minefield\'s height is lower than its width', function () {
        it('should calculate the Tile maximum edge length to be the available height / #rows floored to an integer', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const minefield = new proxyMinefield.Minefield({
            gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 5, cols: 5 },
            viewport: { width: 900, height: 800 }
          });
          minefield.state.minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
          ];

          testStyles.app = {
            maxWidth: '99vw', maxHeight: '85vh', minWidth: '0px', minHeight: '0px', padding: '1vmin'
          };
          testStyles.game = { width: '95%', height: 'calc(90% - 40px)' };
          testStyles.minefield = { width: '100%', height: 'calc(100% - 53px)' };
          /*
            app = { width: 875, height: 664 }
            game = { width: 831.25, height: 557.6 }
            minefield = { width: 831.25, height: 504.6 }
            widthLength = 166
            heightLength = 100
          */
          const expectedMaxEdgeLength = 100;
    
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 0,
            index: 0,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: true,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-0');
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 1,
            index: 1,
            revealed: true,
            hasMine: true,
            hasFlag: true,
            numAdjacentMines: 5,
            lastInRow: false,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-1');
          doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
    
          assert.strictEqual(minefield.render(), 'Minefield component');
        });
      });
    });

    describe('if the minefield does not have an equal number of rows and cols', function () {
      describe('if the Tile\'s maximum edge length allowed by the div#minefield\'s width is lower than the allowed value by its height', function () {
        it('should calculate the Tile maximum edge length to be the one calculated from the width', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const minefield = new proxyMinefield.Minefield({
            gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 2, cols: 5 },
            viewport: { width: 900, height: 800 }
          });
          minefield.state.minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
          ];

          testStyles.app = {
            maxWidth: '99vw', maxHeight: '85vh', minWidth: '0px', minHeight: '0px', padding: '2vmin'
          };
          testStyles.game = { width: '95%', height: 'calc(95% - 6px)' };
          testStyles.minefield = { width: '100%', height: 'calc(92% - 5px)' };
          /*
            app = { width: 859, height: 648 }
            game = { width: 816.05, height: 609.6 }
            minefield = { width: 816.05, height: 555.832 }
            widthLength = 163
            heightLength = 277
          */
          const expectedMaxEdgeLength = 163;
    
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 0,
            index: 0,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: true,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-0');
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 1,
            index: 1,
            revealed: true,
            hasMine: true,
            hasFlag: true,
            numAdjacentMines: 5,
            lastInRow: false,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-1');
          doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
    
          assert.strictEqual(minefield.render(), 'Minefield component');
        });
      });

      describe('if the Tile\'s maximum edge length allowed by the div#minefield\'s height is lower than the allowed value by its width', function () {
        it('should calculate the Tile maximum edge length to be the one calculated from the height', function () {
          doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
          const minefield = new proxyMinefield.Minefield({
            gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 8, cols: 4 },
            viewport: { width: 900, height: 800 }
          });
          minefield.state.minefield = [
            { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
            { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
          ];

          testStyles.app = {
            maxWidth: '99vw', maxHeight: '85vh', minWidth: '0px', minHeight: '0px', padding: '2vmin'
          };
          testStyles.game = { width: '95%', height: 'calc(80% - 12px)' };
          testStyles.minefield = { width: '100%', height: 'calc(60% - 0px)' };
          /*
            app = { width: 859, height: 648 }
            game = { width: 816.05, height: 506.4 }
            minefield = { width: 816.05, height: 303.84 }
            widthLength = 204
            heightLength = 37
          */
          const expectedMaxEdgeLength = 37;
    
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 0,
            index: 0,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: true,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-0');
          doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
            key: 1,
            index: 1,
            revealed: true,
            hasMine: true,
            hasFlag: true,
            numAdjacentMines: 5,
            lastInRow: false,
            maxEdgeLength: expectedMaxEdgeLength,
            onMouseUp: minefield.onMouseUp,
          }).returns('tile-1');
          doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
    
          assert.strictEqual(minefield.render(), 'Minefield component');
        });
      });
    });

    describe('if the viewport relative width for div#app is lower than its minWidth', function () {
      it('should calculate the Tile maximum edge length to be relative to the minWidth value', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const minefield = new proxyMinefield.Minefield({
          gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 5, cols: 5 },
          viewport: { width: 800, height: 1000 }
        });
        minefield.state.minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
        ];

        testStyles.app = {
          maxWidth: '80vw', maxHeight: '95vh', minWidth: '700px', minHeight: '0px', padding: '2vmin'
        };
        testStyles.game = { width: '95%', height: 'calc(100% - 15px)' };
        testStyles.minefield = { width: '99%', height: 'calc(90% - 3px)' };
        /*
          app = { width: 668, height: 918 }
          game = { width: 634.6, height: 903 }
          minefield = { width: 628.254, height: 809.7 }
          widthLength = 125
          heightLength = 161
        */
        const expectedMaxEdgeLength = 125;
  
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 0,
          index: 0,
          revealed: true,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 0,
          lastInRow: true,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-0');
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 1,
          index: 1,
          revealed: true,
          hasMine: true,
          hasFlag: true,
          numAdjacentMines: 5,
          lastInRow: false,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-1');
        doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
  
        assert.strictEqual(minefield.render(), 'Minefield component');
      });
    });

    describe('if the viewport relative height for div#app is lower than its minHeight', function () {
      it('should calculate the Tile maximum edge length to be relative to the minHeight value', function () {
        doubles.minefieldUtilsStub.generateMinefield.returns({ minefield: [], numRevealed: 1});
        const minefield = new proxyMinefield.Minefield({
          gameEnded: true, onValidTilesRevealed: sandbox.stub(), dimensions: { rows: 8, cols: 5 },
          viewport: { width: 900, height: 800 }
        });
        minefield.state.minefield = [
          { revealed: false, hasMine: false, hasFlag: false, numAdjacentMines: 0 },
          { revealed: true, hasMine: true, hasFlag: true, numAdjacentMines: 5 },
        ];

        testStyles.app = {
          maxWidth: '99vw', maxHeight: '85vh', minWidth: '0px', minHeight: '700px', padding: '2vmin'
        };
        testStyles.game = { width: '95%', height: 'calc(100% - 55px)' };
        testStyles.minefield = { width: '100%', height: 'calc(85% - 19px)' };
        /*
          app = { width: 859, height: 668 }
          game = { width: 816.05, height: 613 }
          minefield = { width: 816.05, height: 502.05 }
          widthLength = 163
          heightLength = 62
        */
        const expectedMaxEdgeLength = 62;
  
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 0,
          index: 0,
          revealed: true,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 0,
          lastInRow: true,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-0');
        doubles.createElementStub.withArgs(doubles.tileStub.Tile, {
          key: 1,
          index: 1,
          revealed: true,
          hasMine: true,
          hasFlag: true,
          numAdjacentMines: 5,
          lastInRow: false,
          maxEdgeLength: expectedMaxEdgeLength,
          onMouseUp: minefield.onMouseUp,
        }).returns('tile-1');
        doubles.createElementStub.withArgs('div', { id: "minefield", style: testStyles.minefield }, ['tile-0', 'tile-1']).returns('Minefield component');
  
        assert.strictEqual(minefield.render(), 'Minefield component');
      });
    });
  });
});