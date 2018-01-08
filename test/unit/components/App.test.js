'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");
const menu = require('../../../src/js/components/App/Menu.js');
const setup = require('../../../src/js/components/Setup.js');
const game = require('../../../src/js/components/Game.js');

describe('App', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyApp;

  beforeEach(function () {
    sandbox.useFakeTimers();
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.menuStub = sandbox.stub(menu);
    doubles.setupStub = sandbox.stub(setup);
    doubles.gameStub = sandbox.stub(game);
    proxyApp = proxyquire('../../../src/js/components/App.js', {
      'react': react,
      './App/Menu': doubles.menuStub,
      './Setup': doubles.setupStub,
      './Game': doubles.gameStub,
      '../styles': {
        app: 'app css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial values for the state', function () {
      doubles.nowStub = sandbox.stub(Date, 'now');
      doubles.nowStub.returns(123);

      const app = new proxyApp.App({});

      assert.deepEqual(
        app.state,
        { gameConfig: null, viewport: null, gameId: 'game-123' }
      );
      assert.isTrue(doubles.nowStub.calledOnce);
    });
  });

  describe('handleNewGame()', function () {
    it('should set the gameConfig and viewport state properties to null, unregister the "resize" event listener and return void', function () {
      const removeEventListenerStub = sandbox.stub();

      const app = new proxyApp.App({});
      app.setState = doubles.setStateStub;
      app.windowFacade = { removeEventListener: removeEventListenerStub };

      assert.isUndefined(app.handleNewGame());
      assert.isTrue(removeEventListenerStub.calledOnce);
      assert.isTrue(removeEventListenerStub.calledBefore(doubles.setStateStub));
      assert.deepEqual(removeEventListenerStub.args[0], ['resize', app.handleResize]);
      assert.isUndefined(sandbox.clock.timers);
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ gameConfig: null, viewport: null }]);
    });

    describe('if a "resize" event is in the queue to be handled', function () {
      it('should clear the timeout', function () {
        const removeEventListenerStub = sandbox.stub();
  
        const app = new proxyApp.App({});
        app.setState = doubles.setStateStub;
        app.resizeTimeoutId = global.setTimeout(app.handleResize, 33);
        app.windowFacade = { removeEventListener: removeEventListenerStub };
  
        assert.isUndefined(app.handleNewGame());
        assert.isTrue(removeEventListenerStub.calledOnce);
        assert.isTrue(removeEventListenerStub.calledBefore(doubles.setStateStub));
        assert.deepEqual(removeEventListenerStub.args[0], ['resize', app.handleResize]);
        assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ gameConfig: null, viewport: null }]);
      });
    });
  });

  describe('handleResetGame()', function () {
    it('should update the "gameId" state property based on the current unix timestamp and return void', function () {
      const app = new proxyApp.App({});
      app.setState = doubles.setStateStub;

      doubles.nowStub = sandbox.stub(Date, 'now');
      doubles.nowStub.returns(7890);

      assert.isUndefined(app.handleResetGame());
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ gameId: 'game-7890' }]);
      assert.isTrue(doubles.nowStub.calledOnce);
    });
  });

  describe('handleStart()', function () {
    it('should set the gameConfig state property to the provided object, the viewport state property to the viewport dimensions, register a "resize" event listener and return void', function () {
      const getViewportDimensionsStub = sandbox.stub();
      const addEventListenerStub = sandbox.stub();

      const viewportDimensions = { width: 101, height: 102 };
      getViewportDimensionsStub.withArgs().returns(viewportDimensions);

      const app = new proxyApp.App({});
      app.setState = doubles.setStateStub;
      app.windowFacade = {
        getViewportDimensions: getViewportDimensionsStub,
        addEventListener: addEventListenerStub,
      };
      
      const config = {
        numMines: 1,
        dimensions: {rows: 2, cols: 3},
        flagsEnabled: true,
        numLives: 4,
      };
      assert.isUndefined(app.handleStart(config));
      assert.isTrue(getViewportDimensionsStub.calledOnce);
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ gameConfig: config, viewport: viewportDimensions }]);
      assert.isTrue(addEventListenerStub.calledOnce);
      assert.isTrue(addEventListenerStub.calledAfter(doubles.setStateStub));
      assert.deepEqual(addEventListenerStub.args[0], ['resize', app.handleResize]);
    });
  });

  describe('handleResize()', function () {
    it('should set a timeout with 33ms that updates the viewport state property with the new viewport dimensions and return void', function () {
      const getViewportDimensionsStub = sandbox.stub();

      const viewport = { width: 101, height: 102 };
      getViewportDimensionsStub.withArgs().returns(viewport);

      const app = new proxyApp.App({});
      app.setState = doubles.setStateStub;
      app.windowFacade = { getViewportDimensions: getViewportDimensionsStub };

      assert.isUndefined(app.handleResize());
      const timersKeys = Object.keys(sandbox.clock.timers);
      assert.strictEqual(timersKeys.length, 1);
      assert.strictEqual(sandbox.clock.timers[timersKeys[0]].type, 'Timeout');
      assert.strictEqual(sandbox.clock.timers[timersKeys[0]].delay, 33);
      assert.deepEqual(sandbox.clock.timers[timersKeys[0]].args, []);
      sandbox.clock.next();
      assert.isTrue(getViewportDimensionsStub.calledOnce);
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ viewport: viewport }]);
      assert.isNull(app.resizeTimeoutId);
    });

    describe('if a call for the state to be updated is already queued', function () {
      it('should ignore this event and return void', function () {
        const getViewportDimensionsStub = sandbox.stub();
  
        const app = new proxyApp.App({});
        app.setState = doubles.setStateStub;
        app.windowFacade = { getViewportDimensions: getViewportDimensionsStub };
        const initialTimeoutId = global.setTimeout(() => {}, 33);
        app.resizeTimeoutId = initialTimeoutId;
  
        assert.isUndefined(app.handleResize());
        assert.isTrue(getViewportDimensionsStub.notCalled);
        assert.isTrue(doubles.setStateStub.notCalled);
        const timersKeys = Object.keys(sandbox.clock.timers);
        assert.strictEqual(timersKeys.length, 1);
        assert.strictEqual(sandbox.clock.timers[timersKeys[0]].id, initialTimeoutId.id);
      });
    });
  });

  describe('componentWillUnmount()', function () {
    it('should unregister the "resize" event listener and return void', function () {
      const removeEventListenerStub = sandbox.stub();

      const app = new proxyApp.App({});
      app.windowFacade = { removeEventListener: removeEventListenerStub };

      assert.isUndefined(app.componentWillUnmount());
      assert.isTrue(removeEventListenerStub.calledOnce);
      assert.deepEqual(removeEventListenerStub.args[0], ['resize', app.handleResize]);
      assert.isUndefined(sandbox.clock.timers);
    });

    describe('if a "resize" event is in the queue to be handled', function () {
      it('should clear the timeout', function () {
        const removeEventListenerStub = sandbox.stub();

        const app = new proxyApp.App({});
        app.resizeTimeoutId = global.setTimeout(app.handleResize, 33);
        app.windowFacade = { removeEventListener: removeEventListenerStub };
  
        assert.isUndefined(app.componentWillUnmount());
        assert.isTrue(removeEventListenerStub.calledOnce);
        assert.deepEqual(removeEventListenerStub.args[0], ['resize', app.handleResize]);
        assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
      });
    });
  });

  describe('render()', function () {
    describe('if state.gameConfig and state.viewport are null', function () {
      it('should return a div with id "app" containing the Setup component as child', function () {
        const app = new proxyApp.App({});
        app.state = { gameConfig: null, viewport: null };

        doubles.createElementStub.withArgs('div', { id: 'app', style: 'app css styles' }, ['Setup component.']).returns('App component.');
        doubles.createElementStub.withArgs(doubles.setupStub.Setup, { key: 'setup', onStart: app.handleStart }).returns('Setup component.');

        assert.strictEqual(app.render(), 'App component.');
      });
    });
    
    describe('if state.gameConfig is not null', function () {
      it('should return a div with id "app" containing the Menu and Game components as children', function () {
        const gameConfig = {
          numMines: 1,
          dimensions: { rows: 2, cols: 3 },
          flagsEnabled: true,
          numLives: 4,
        };
        const viewport = { width: 101, height: 102 };

        const app = new proxyApp.App({});
        app.state = { gameConfig: gameConfig, viewport: viewport, gameId: 'game-1234' };

        doubles.createElementStub.withArgs('div', { id: 'app', style: 'app css styles' }, ['Menu component.', 'Game component.']).returns('App component.');
        doubles.createElementStub.withArgs(doubles.menuStub.Menu, { key: 'menu', onNewGame: app.handleNewGame, onResetGame: app.handleResetGame }).returns('Menu component.');
        doubles.createElementStub.withArgs(doubles.gameStub.Game, { key: 'game-1234', gameConfig: gameConfig, viewport: viewport }).returns('Game component.');

        assert.strictEqual(app.render(), 'App component.');
      });

      describe('if state.viewport is null', function () {
        it('should return a div with id "app" containing the Setup component as child', function () {
          const gameConfig = {
            numMines: 1,
            dimensions: { rows: 2, cols: 3 },
            flagsEnabled: true,
            numLives: 4,
          };
          const app = new proxyApp.App({});
          app.state = { gameConfig: gameConfig, viewport: null };
  
          doubles.createElementStub.withArgs('div', { id: 'app', style: 'app css styles' }, ['Setup component.']).returns('App component.');
          doubles.createElementStub.withArgs(doubles.setupStub.Setup, { key: 'setup', onStart: app.handleStart }).returns('Setup component.');
  
          assert.strictEqual(app.render(), 'App component.');
        });
      });
    });
  });
});