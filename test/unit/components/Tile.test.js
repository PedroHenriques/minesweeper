'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('Tile', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyTile;
  let testStyles;

  beforeEach(function () {
    testStyles = {
      tile: {
        base: { base: 'base css' },
        revealed: { revealed: 'revealed css' },
        mine: { mine: 'mine css' },
        adjacentMines: {
          1: { adjacentMines: '1 adjacentMines css' },
          2: { adjacentMines: '2 adjacentMines css' },
          3: { adjacentMines: '3 adjacentMines css' },
          4: { adjacentMines: '4 adjacentMines css' },
          5: { adjacentMines: '5 adjacentMines css' },
          6: { adjacentMines: '6 adjacentMines css' },
          7: { adjacentMines: '7 adjacentMines css' },
          8: { adjacentMines: '8 adjacentMines css' },
        },
        flag: { flag: 'flag css' },
        incorrectFlag: { incorrectFlag: 'incorrectFlag css' },
        lastInRow: { lastInRow: 'lastInRow css' },
        edgeLengthAdjustments: [],
      }
    };
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    proxyTile = proxyquire('../../../src/js/components/Tile.js', {
      'react': react,
      '../styles': testStyles,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    describe('if the tile is revealed', function () {
      it('should return a div element with the styles for "tile.base, tile.revealed, tile.adjacentMines", the "onMouseUp" and "onContextMenu" mouse event listeners and the number of adjacent mines as the content', function () {
        const props = {
          index: 1,
          revealed: true,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 2,
          lastInRow: false,
          maxEdgeLength: 100,
          onMouseUp: sandbox.stub(),
        };
        const tile = new proxyTile.Tile(props);

        doubles.createElementStub.returns('Tile component');

        assert.strictEqual(tile.render(), 'Tile component');
        assert.isTrue(doubles.createElementStub.calledOnce);
        assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
        assert.strictEqual(doubles.createElementStub.args[0][2], '2');
        assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
        assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
        assert.deepEqual(doubles.createElementStub.args[0][1].style, {
          base: 'base css',
          revealed: 'revealed css',
          adjacentMines: '2 adjacentMines css',
          width: '100px',
          height: '100px',
          lineHeight: '100px',
        });
        assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
        assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

        const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
        doubles.createElementStub.args[0][1].onMouseUp(eventObj);
        assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
        doubles.createElementStub.args[0][1].onContextMenu(eventObj);
        assert.isTrue(eventObj.preventDefault.calledOnce);
      });

      describe('if the tile is the last on a row', function () {
        it('should add the style for "tile.lastInRow"', function () {
          const props = {
            index: 1,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 2,
            lastInRow: true,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);
  
          doubles.createElementStub.returns('Tile component');
  
          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '2');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            revealed: 'revealed css',
            adjacentMines: '2 adjacentMines css',
            lastInRow: 'lastInRow css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });
      });

      describe('if the number of adjacent mines is zero', function () {
        it('should not show a zero in the content', function () {
          const props = {
            index: 1,
            revealed: true,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: false,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);
  
          doubles.createElementStub.returns('Tile component');
  
          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            revealed: 'revealed css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });

        describe('if the tile is the last on a row', function () {
          it('should add the styles for "tile.lastInRow"', function () {
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 0,
              lastInRow: true,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
    
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              lastInRow: 'lastInRow css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
    
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });
      });

      describe('if the tile has 1+ adjacent mines', function () {
        describe('if the edge length has extra dedicated styles', function () {
          it('should add them to the returned div', function () {
            testStyles.tile.edgeLengthAdjustments = [
              { edgeLength: 50, styles: { edgeLengthAdjustments: 'length 50 css.' } },
              { edgeLength: 100, styles: { edgeLengthAdjustments: 'length 100 css.' } },
              { edgeLength: 150, styles: { edgeLengthAdjustments: 'length 150 css.' } },
            ];

            const numMines = 1;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 95,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '1 adjacentMines css',
              edgeLengthAdjustments: 'length 100 css.',
              width: '95px',
              height: '95px',
              lineHeight: '95px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });

        describe('if the edge length has no extra dedicated styles', function () {
          it('should not add any extra styles to the returned div', function () {
            testStyles.tile.edgeLengthAdjustments = [
              { edgeLength: 50, styles: { edgeLengthAdjustments: 'length 50 css.' } },
              { edgeLength: 100, styles: { edgeLengthAdjustments: 'length 100 css.' } },
              { edgeLength: 150, styles: { edgeLengthAdjustments: 'length 150 css.' } },
            ];

            const numMines = 1;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 200,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '1 adjacentMines css',
              width: '200px',
              height: '200px',
              lineHeight: '200px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });

        describe('if it has 1 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "1" as the content', function () {
            const numMines = 1;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '1 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 1;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '1 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 2 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "2" as the content', function () {
            const numMines = 2;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '2 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 2;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '2 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 3 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "3" as the content', function () {
            const numMines = 3;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '3 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 3;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '3 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 4 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "4" as the content', function () {
            const numMines = 4;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '4 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 4;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '4 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 5 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "5" as the content', function () {
            const numMines = 5;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '5 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 5;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '5 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 6 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "6" as the content', function () {
            const numMines = 6;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '6 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 6;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '6 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 7 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "7" as the content', function () {
            const numMines = 7;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '7 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 7;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '7 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 8 adjacent mine', function () {
          it('should add the "tile.adjacentMines" styles to the returned div and "8" as the content', function () {
            const numMines = 8;
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              adjacentMines: '8 adjacentMines css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 8;
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], `${numMines}`);
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                adjacentMines: '8 adjacentMines css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
      });

      describe('if the tile has a flag', function () {
        describe('if the tile has a mine', function () {
          it('should return a div element with the styles for "tile.base, tile.revealed, tile.flag", the "onMouseUp" and "onContextMenu" mouse event listeners and empty content', function () {
            const props = {
              index: 1,
              revealed: true,
              hasMine: true,
              hasFlag: true,
              numAdjacentMines: 2,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);

            doubles.createElementStub.returns('Tile component');

            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              flag: 'flag css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: true,
                hasMine: true,
                hasFlag: true,
                numAdjacentMines: 2,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
  
              doubles.createElementStub.returns('Tile component');
  
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                flag: 'flag css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
              const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onMouseUp(eventObj);
              assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });

        describe('if the tile does not have a mine', function () {
          it('should add the styles for "tile.incorrectFlag" instead of "tile.flag"', function () {
            const props = {
              index: 1,
              revealed: true,
              hasMine: false,
              hasFlag: true,
              numAdjacentMines: 2,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
  
            doubles.createElementStub.returns('Tile component');
  
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              incorrectFlag: 'incorrectFlag css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: true,
                hasMine: false,
                hasFlag: true,
                numAdjacentMines: 2,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
    
              doubles.createElementStub.returns('Tile component');
    
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                revealed: 'revealed css',
                incorrectFlag: 'incorrectFlag css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
    
              const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onMouseUp(eventObj);
              assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
      });

      describe('if the tile has a mine', function () {
        it('should return a div element with the styles for "tile.base, tile.revealed, tile.mine", the "onMouseUp" and "onContextMenu" mouse event listeners and the number of adjacent mines as the content', function () {
          const props = {
            index: 1,
            revealed: true,
            hasMine: true,
            hasFlag: false,
            numAdjacentMines: 2,
            lastInRow: false,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);

          doubles.createElementStub.returns('Tile component');

          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            revealed: 'revealed css',
            mine: 'mine css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });

        describe('if the tile is the last on a row', function () {
          it('should add the styles for "tile.lastInRow"', function () {
            const props = {
              index: 1,
              revealed: true,
              hasMine: true,
              hasFlag: false,
              numAdjacentMines: 2,
              lastInRow: true,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
  
            doubles.createElementStub.returns('Tile component');
  
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              revealed: 'revealed css',
              mine: 'mine css',
              lastInRow: 'lastInRow css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });
      });
    });

    describe('if the tile is not revealed', function () {
      it('should return a div element with the styles for "tile.base", the "onMouseUp" and "onContextMenu" mouse event listeners and empty content', function () {
        const props = {
          index: 1,
          revealed: false,
          hasMine: false,
          hasFlag: false,
          numAdjacentMines: 2,
          lastInRow: false,
          maxEdgeLength: 100,
          onMouseUp: sandbox.stub(),
        };
        const tile = new proxyTile.Tile(props);

        doubles.createElementStub.returns('Tile component');

        assert.strictEqual(tile.render(), 'Tile component');
        assert.isTrue(doubles.createElementStub.calledOnce);
        assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
        assert.strictEqual(doubles.createElementStub.args[0][2], '');
        assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
        assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
        assert.deepEqual(doubles.createElementStub.args[0][1].style, {
          base: 'base css',
          width: '100px',
          height: '100px',
          lineHeight: '100px',
        });
        assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
        assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

        const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
        doubles.createElementStub.args[0][1].onMouseUp(eventObj);
        assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
        doubles.createElementStub.args[0][1].onContextMenu(eventObj);
        assert.isTrue(eventObj.preventDefault.calledOnce);
      });

      describe('if the tile is the last on a row', function () {
        it('should add the style for "tile.lastInRow"', function () {
          const props = {
            index: 1,
            revealed: false,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 2,
            lastInRow: true,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);
  
          doubles.createElementStub.returns('Tile component');
  
          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            lastInRow: 'lastInRow css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });
      });

      describe('if the number of adjacent mines is zero', function () {
        it('should leave the content empty', function () {
          const props = {
            index: 1,
            revealed: false,
            hasMine: false,
            hasFlag: false,
            numAdjacentMines: 0,
            lastInRow: false,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);
  
          doubles.createElementStub.returns('Tile component');
  
          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });

        describe('if the tile is the last on a row', function () {
          it('should add the styles for "tile.lastInRow"', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 0,
              lastInRow: true,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
    
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              lastInRow: 'lastInRow css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
    
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });
      });

      describe('if the tile has 1+ adjacent mines', function () {
        describe('if it has 1 adjacent mine', function () {
          it('should leave the content empty', function () {
            const numMines = 1;
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 1;
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 2 adjacent mine', function () {
          it('should leave the content empty', function () {
            const numMines = 2;
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 2;
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 3 adjacent mine', function () {
          it('should leave the content empty', function () {
            const numMines = 3;
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 3;
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 4 adjacent mine', function () {
          it('should leave the content empty', function () {
            const numMines = 4;
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: numMines,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const numMines = 4;
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: numMines,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 5 adjacent mine', function () {
          it('should leave the content empty', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 5,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: 5,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 6 adjacent mine', function () {
          it('should leave the content empty', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 6,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: 6,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 7 adjacent mine', function () {
          it('should leave the content empty', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 7,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: 7,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
  
        describe('if it has 8 adjacent mine', function () {
          it('should leave the content empty', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: false,
              numAdjacentMines: 8,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
    
            doubles.createElementStub.returns('Tile component');
            
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
      
            const eventObj = { preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: false,
                numAdjacentMines: 8,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
      
              doubles.createElementStub.returns('Tile component');
              
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
        
              const eventObj = { preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
      });

      describe('if the tile has a flag', function () {
        describe('if the tile has a mine', function () {
          it('should return a div element with the styles for "tile.base, tile.flag", the "onMouseUp" and "onContextMenu" mouse event listeners and empty content', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: true,
              hasFlag: true,
              numAdjacentMines: 2,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);

            doubles.createElementStub.returns('Tile component');

            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              flag: 'flag css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: true,
                hasFlag: true,
                numAdjacentMines: 2,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
  
              doubles.createElementStub.returns('Tile component');
  
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                flag: 'flag css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
              const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onMouseUp(eventObj);
              assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });

        describe('if the tile does not have a mine', function () {
          it('should return a div element with the styles for "tile.base, tile.flag", the "onMouseUp" and "onContextMenu" mouse event listeners and empty content', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: false,
              hasFlag: true,
              numAdjacentMines: 2,
              lastInRow: false,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
  
            doubles.createElementStub.returns('Tile component');
  
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              flag: 'flag css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });

          describe('if the tile is the last on a row', function () {
            it('should add the styles for "tile.lastInRow"', function () {
              const props = {
                index: 1,
                revealed: false,
                hasMine: false,
                hasFlag: true,
                numAdjacentMines: 2,
                lastInRow: true,
                maxEdgeLength: 100,
                onMouseUp: sandbox.stub(),
              };
              const tile = new proxyTile.Tile(props);
    
              doubles.createElementStub.returns('Tile component');
    
              assert.strictEqual(tile.render(), 'Tile component');
              assert.isTrue(doubles.createElementStub.calledOnce);
              assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
              assert.strictEqual(doubles.createElementStub.args[0][2], '');
              assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
              assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
              assert.deepEqual(doubles.createElementStub.args[0][1].style, {
                base: 'base css',
                flag: 'flag css',
                lastInRow: 'lastInRow css',
                width: '100px',
                height: '100px',
                lineHeight: '100px',
              });
              assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
              assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
    
              const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
              doubles.createElementStub.args[0][1].onMouseUp(eventObj);
              assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
              doubles.createElementStub.args[0][1].onContextMenu(eventObj);
              assert.isTrue(eventObj.preventDefault.calledOnce);
            });
          });
        });
      });

      describe('if the tile has a mine', function () {
        it('should return a div element with the styles for "tile.base", the "onMouseUp" and "onContextMenu" mouse event listeners and empty content', function () {
          const props = {
            index: 1,
            revealed: false,
            hasMine: true,
            hasFlag: false,
            numAdjacentMines: 2,
            lastInRow: false,
            maxEdgeLength: 100,
            onMouseUp: sandbox.stub(),
          };
          const tile = new proxyTile.Tile(props);

          doubles.createElementStub.returns('Tile component');

          assert.strictEqual(tile.render(), 'Tile component');
          assert.isTrue(doubles.createElementStub.calledOnce);
          assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
          assert.strictEqual(doubles.createElementStub.args[0][2], '');
          assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
          assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
          assert.deepEqual(doubles.createElementStub.args[0][1].style, {
            base: 'base css',
            width: '100px',
            height: '100px',
            lineHeight: '100px',
          });
          assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
          assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');

          const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
          doubles.createElementStub.args[0][1].onMouseUp(eventObj);
          assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
          doubles.createElementStub.args[0][1].onContextMenu(eventObj);
          assert.isTrue(eventObj.preventDefault.calledOnce);
        });

        describe('if the tile is the last on a row', function () {
          it('should add the styles for "tile.lastInRow"', function () {
            const props = {
              index: 1,
              revealed: false,
              hasMine: true,
              hasFlag: false,
              numAdjacentMines: 2,
              lastInRow: true,
              maxEdgeLength: 100,
              onMouseUp: sandbox.stub(),
            };
            const tile = new proxyTile.Tile(props);
  
            doubles.createElementStub.returns('Tile component');
  
            assert.strictEqual(tile.render(), 'Tile component');
            assert.isTrue(doubles.createElementStub.calledOnce);
            assert.strictEqual(doubles.createElementStub.args[0][0], 'div');
            assert.strictEqual(doubles.createElementStub.args[0][2], '');
            assert.deepEqual(Object.keys(doubles.createElementStub.args[0][1]), ['id', 'style', 'onMouseUp', 'onContextMenu']);
            assert.strictEqual(doubles.createElementStub.args[0][1].id, 'tile-1');
            assert.deepEqual(doubles.createElementStub.args[0][1].style, {
              base: 'base css',
              lastInRow: 'lastInRow css',
              width: '100px',
              height: '100px',
              lineHeight: '100px',
            });
            assert.typeOf(doubles.createElementStub.args[0][1].onMouseUp, 'function');
            assert.typeOf(doubles.createElementStub.args[0][1].onContextMenu, 'function');
  
            const eventObj = { button: 0, buttons: 1, preventDefault: sandbox.stub() };
            doubles.createElementStub.args[0][1].onMouseUp(eventObj);
            assert.isTrue(props.onMouseUp.calledWithExactly(1, 0, 1));
            doubles.createElementStub.args[0][1].onContextMenu(eventObj);
            assert.isTrue(eventObj.preventDefault.calledOnce);
          });
        });
      });
    });
  });
});