'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");
const header = require('../../../src/js/components/Header.js');
const minefield = require('../../../src/js/components/Minefield.js');
const notification = require('../../../src/js/components/Notification.js');

describe('Game', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyGame;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.headerStub = sandbox.stub(header);
    doubles.minefieldStub = sandbox.stub(minefield);
    doubles.notificationStub = sandbox.stub(notification);
    proxyGame = proxyquire('../../../src/js/components/Game.js', {
      'react': react,
      './Header': doubles.headerStub,
      './Minefield': doubles.minefieldStub,
      './Notification': doubles.notificationStub,
      '../styles': {
        game: 'game css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial state', function () {
      const props = {
        gameConfig: {
          numMines: 5,
          numLives: 1,
        },
      };
      const game = new proxyGame.Game(props);

      assert.deepEqual(game.state, {
        minesLeft: props.gameConfig.numMines,
        livesLeft: props.gameConfig.numLives,
        gameEnded: false,
      });
    });
  });

  describe('handleValidTilesRevealed()', function () {
    describe('if the new total number of valid tiles revealed is lower than the number of valid tiles on the minefield', function () {
      it('should not flag the game as ended and return void', function () {
        const props = {
          gameConfig: {
            numMines: 2,
            dimensions: { rows: 3, cols: 4 },
          },
        };
        const game = new proxyGame.Game(props);
        game.setState = doubles.setStateStub;

        assert.isUndefined(game.handleValidTilesRevealed(3));
        assert.isUndefined(game.handleValidTilesRevealed(2));
        assert.isTrue(doubles.setStateStub.notCalled);
      });
    });

    describe('if the new total number of valid tiles revealed is equal to the number of valid tiles on the minefield', function () {
      it('should flag the game as ended and return void', function () {
        const props = {
          gameConfig: {
            numMines: 2,
            dimensions: { rows: 3, cols: 4 },
          },
        };
        const game = new proxyGame.Game(props);
        game.setState = doubles.setStateStub;

        assert.isUndefined(game.handleValidTilesRevealed(8));
        assert.isUndefined(game.handleValidTilesRevealed(2));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ gameEnded: true }]);
      });
    });
  });

  describe('handleFlagsChanged()', function () {
    describe('if the number of flags that changed is positive', function () {
      it('should decrease the number of mines left in the state with the number of flags that changed and return void', function () {
        const game = new proxyGame.Game({ gameConfig: {} });
        game.setState = doubles.setStateStub;

        assert.isUndefined(game.handleFlagsChanged(3));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.typeOf(doubles.setStateStub.args[0][0], 'function');
        assert.deepEqual(doubles.setStateStub.args[0][0]({ minesLeft: 10 }), { minesLeft: 7 });
      });
    });

    describe('if the number of flags that changed is negative', function () {
      it('should increase the number of mines left in the state with the number of flags that changed and return void', function () {
        const game = new proxyGame.Game({ gameConfig: {} });
        game.setState = doubles.setStateStub;
  
        assert.isUndefined(game.handleFlagsChanged(-6));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.typeOf(doubles.setStateStub.args[0][0], 'function');
        assert.deepEqual(doubles.setStateStub.args[0][0]({ minesLeft: 13 }), { minesLeft: 19 });
      });
    });

    describe('if the number of flags that changed puts the number of mines left into the negatives', function () {
      it('should still update the state', function () {
        const game = new proxyGame.Game({ gameConfig: {} });
        game.setState = doubles.setStateStub;
  
        assert.isUndefined(game.handleFlagsChanged(10));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.typeOf(doubles.setStateStub.args[0][0], 'function');
        assert.deepEqual(doubles.setStateStub.args[0][0]({ minesLeft: 6 }), { minesLeft: -4 });
      });
    });
  });

  describe('handleExplosion()', function () {
    it('should subtract 1 to the number of lives left in the state and return void', function () {
      const props = {
        gameConfig: {
          numLives: 2,
        }
      };
      const game = new proxyGame.Game(props);
      game.setState = doubles.setStateStub;

      assert.isUndefined(game.handleExplosion());
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ livesLeft: 1 }]);
    });

    describe('if the number of lives left is equal to one', function () {
      it('should also flag the game as ended', function () {
        const props = {
          gameConfig: {
            numLives: 1,
          }
        };
        const game = new proxyGame.Game(props);
        game.setState = doubles.setStateStub;
  
        assert.isUndefined(game.handleExplosion());
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ livesLeft: 0, gameEnded: true }]);
      });
    });
  });

  describe('render()', function () {
    it('should return a div with id "game" and as children the Header component and the Minefield component', function () {
      const props = {
        viewport: { width: 101, height: 102 },
        gameConfig: {
          numMines: 10,
          dimensions: { rows: 5, cols: 6 },
          flagsEnabled: true,
          gameSeed: 'game seed',
        },
      };
      const game = new proxyGame.Game(props);
      game.state = {
        minesLeft: 4,
        livesLeft: 1,
        gameEnded: false,
      };

      doubles.createElementStub.withArgs(
        'div', { id: 'game', style: 'game css styles' }, '', 'Header component.', 'Minefield component.'
      ).returns('Game component.');
      doubles.createElementStub.withArgs(doubles.headerStub.Header, { minesLeft: 4, lives: 1, gameEnded: false }).returns('Header component.');
      doubles.createElementStub.withArgs(
        doubles.minefieldStub.Minefield,
        {
          viewport: props.viewport,
          gameSeed: props.gameConfig.gameSeed,
          dimensions: props.gameConfig.dimensions,
          numMines: props.gameConfig.numMines,
          flagsEnabled: props.gameConfig.flagsEnabled,
          gameEnded: false,
          onValidTilesRevealed: game.handleValidTilesRevealed,
          onFlagsChanged: game.handleFlagsChanged,
          onExplosion: game.handleExplosion,
        }
      ).returns('Minefield component.');

      assert.strictEqual(game.render(), 'Game component.');
    });

    describe('if the game has ended in a win', function () {
      it('should render the win message', function () {
        const props = {
          viewport: { width: 101, height: 102 },
          gameConfig: {
            numMines: 10,
            dimensions: { rows: 5, cols: 6 },
            flagsEnabled: true,
            gameSeed: 'game seed',
          },
        };
        const game = new proxyGame.Game(props);
        game.state = {
          minesLeft: 4,
          livesLeft: 1,
          gameEnded: true,
        };
  
        doubles.createElementStub.withArgs(
          'div', { id: 'game', style: 'game css styles' }, 'Notification component.', 'Header component.', 'Minefield component.'
        ).returns('Game component.');
        doubles.createElementStub.withArgs(
          doubles.notificationStub.Notification, { id: 'game-notifs', notifText: 'Congratulations!' }
        ).returns('Notification component.');
        doubles.createElementStub.withArgs(doubles.headerStub.Header, { minesLeft: 4, lives: 1, gameEnded: true }).returns('Header component.');
        doubles.createElementStub.withArgs(
          doubles.minefieldStub.Minefield,
          {
            viewport: props.viewport,
            gameSeed: props.gameConfig.gameSeed,
            dimensions: props.gameConfig.dimensions,
            numMines: props.gameConfig.numMines,
            flagsEnabled: props.gameConfig.flagsEnabled,
            gameEnded: true,
            onValidTilesRevealed: game.handleValidTilesRevealed,
            onFlagsChanged: game.handleFlagsChanged,
            onExplosion: game.handleExplosion,
          }
        ).returns('Minefield component.');
  
        assert.strictEqual(game.render(), 'Game component.');
      });
    });

    describe('if the game has ended in a loss', function () {
      it('should render the loss message', function () {
        const props = {
          viewport: { width: 101, height: 102 },
          gameConfig: {
            numMines: 10,
            dimensions: { rows: 5, cols: 6 },
            flagsEnabled: true,
          },
        };
        const game = new proxyGame.Game(props);
        game.state = {
          minesLeft: 4,
          livesLeft: 0,
          gameEnded: true,
          gameSeed: 'game seed',
        };
  
        doubles.createElementStub.withArgs(
          'div', { id: 'game', style: 'game css styles' }, 'Notification component.', 'Header component.', 'Minefield component.'
        ).returns('Game component.');
        doubles.createElementStub.withArgs(
          doubles.notificationStub.Notification, { id: 'game-notifs', notifText: 'Game Over!' }
        ).returns('Notification component.');
        doubles.createElementStub.withArgs(doubles.headerStub.Header, { minesLeft: 4, lives: 0, gameEnded: true }).returns('Header component.');
        doubles.createElementStub.withArgs(
          doubles.minefieldStub.Minefield,
          {
            viewport: props.viewport,
            gameSeed: props.gameConfig.gameSeed,
            dimensions: props.gameConfig.dimensions,
            numMines: props.gameConfig.numMines,
            flagsEnabled: props.gameConfig.flagsEnabled,
            gameEnded: true,
            onValidTilesRevealed: game.handleValidTilesRevealed,
            onFlagsChanged: game.handleFlagsChanged,
            onExplosion: game.handleExplosion,
          }
        ).returns('Minefield component.');
  
        assert.strictEqual(game.render(), 'Game component.');
      });
    });
  });
});