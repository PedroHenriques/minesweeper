'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('Header', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyHeader;

  beforeEach(function () {
    sandbox.useFakeTimers();
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyHeader = proxyquire('../../../src/js/components/Header.js', {
      'react': react,
      '../styles': {
        header: 'header css styles',
        headerTimer: 'header timer css styles',
        headerTimerImg: 'header timer img css styles',
        headerMines: 'header mines css styles',
        headerMinesImg: 'header mines img css styles',
        headerLives: 'header lives css styles',
        headerLivesImg: 'header lives img css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial values for the state', function () {
      const header = new proxyHeader.Header({});

      assert.deepEqual(header.state, { timer: 0 });
    });
  });

  describe('componentDidMount()', function () {
    it('should register an interval with 1000ms and a callback that increments the timer and return void', function () {
      const header = new proxyHeader.Header({});
      header.setState = doubles.setStateStub;

      assert.isUndefined(header.componentDidMount());
      const timersKeys = Object.keys(sandbox.clock.timers);
      assert.strictEqual(timersKeys.length, 1);
      assert.strictEqual(sandbox.clock.timers[timersKeys[0]].type, 'Interval');
      assert.strictEqual(sandbox.clock.timers[timersKeys[0]].interval, 1000);
      assert.deepEqual(sandbox.clock.timers[timersKeys[0]].args, []);
      sandbox.clock.next();
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.typeOf(doubles.setStateStub.args[0][0], 'function');
      assert.deepEqual(doubles.setStateStub.args[0][0]({ timer: 20 }), { timer: 21 });
    });
  });

  describe('componentWillUnmount()', function () {
    it('should unregister the interval advancing the timer and return void', function () {
      const header = new proxyHeader.Header({});
      header.intervalId = global.setInterval(() => {}, 1000);

      assert.isUndefined(header.componentWillUnmount());
      assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
    });

    describe('if an interval is not registered', function () {
      it('should not throw errors due to unecessary calls to global.clearInterval()', function () {
        const header = new proxyHeader.Header({});
  
        assert.isUndefined(header.componentWillUnmount());
        assert.isUndefined(sandbox.clock.timers);
      });
    });
  });

  describe('render()', function () {
    it('should return the header div with the timer, number of mines left and lives remaining elements', function () {
      const props = {
        minesLeft: 10,
        lives: 2,
        gameEnded: false,
      };
      const header = new proxyHeader.Header(props);
      header.state = { timer: 60*2 + 25 };
      header.intervalId = global.setInterval(() => {}, 1000);

      doubles.createElementStub.withArgs(
        'div', { id: 'header', style: 'header css styles' }, 'timer div.', 'mines-left div.', 'lives div.'
      ).returns('Header component.');
      doubles.createElementStub.withArgs('div', { id: 'game-timer', style: 'header timer css styles' }, 'timer img.', '02:25').returns('timer div.');
      doubles.createElementStub.withArgs('img', { src: '/img/timer.png', alt: 'game timer', style: 'header timer img css styles' }).returns('timer img.');
      doubles.createElementStub.withArgs('div', { id: 'mines-left', style: 'header mines css styles' }, 'mine img.', props.minesLeft).returns('mines-left div.');
      doubles.createElementStub.withArgs('img', { src: '/img/mine.png', alt: 'mines left', style: 'header mines img css styles' }).returns('mine img.');
      doubles.createElementStub.withArgs('div', { id: 'lives', style: 'header lives css styles' }, 'lives img.', props.lives).returns('lives div.');
      doubles.createElementStub.withArgs('img', { src: '/img/lives.png', alt: 'lives left', style: 'header lives img css styles' }).returns('lives img.');

      assert.strictEqual(header.render(), 'Header component.');
      assert.strictEqual(Object.keys(sandbox.clock.timers).length, 1);
    });

    describe('if the game has ended', function () {
      it('should unregister the interval advancing the timer', function () {
        const props = {
          minesLeft: 10,
          lives: 2,
          gameEnded: true,
        };
        const header = new proxyHeader.Header(props);
        header.state = { timer: 60*3 + 11 };
        header.intervalId = global.setInterval(() => {}, 1000);
  
        doubles.createElementStub.withArgs(
          'div', { id: 'header', style: 'header css styles' }, 'timer div.', 'mines-left div.', 'lives div.'
        ).returns('Header component.');
        doubles.createElementStub.withArgs('div', { id: 'game-timer', style: 'header timer css styles' }, 'timer img.', '03:11').returns('timer div.');
        doubles.createElementStub.withArgs('img', { src: '/img/timer.png', alt: 'game timer', style: 'header timer img css styles' }).returns('timer img.');
        doubles.createElementStub.withArgs('div', { id: 'mines-left', style: 'header mines css styles' }, 'mine img.', props.minesLeft).returns('mines-left div.');
        doubles.createElementStub.withArgs('img', { src: '/img/mine.png', alt: 'mines left', style: 'header mines img css styles' }).returns('mine img.');
        doubles.createElementStub.withArgs('div', { id: 'lives', style: 'header lives css styles' }, 'lives img.', props.lives).returns('lives div.');
        doubles.createElementStub.withArgs('img', { src: '/img/lives.png', alt: 'lives left', style: 'header lives img css styles' }).returns('lives img.');
  
        assert.strictEqual(header.render(), 'Header component.');
        assert.strictEqual(Object.keys(sandbox.clock.timers).length, 0);
      });

      describe('if an interval is not registered', function () {
        it('should not throw errors due to unecessary calls to global.clearInterval()', function () {
          const props = {
            minesLeft: 10,
            lives: 2,
            gameEnded: true,
          };
          const header = new proxyHeader.Header(props);
          header.state = { timer: 60*3 + 11 };
    
          doubles.createElementStub.withArgs(
            'div', { id: 'header', style: 'header css styles' }, 'timer div.', 'mines-left div.', 'lives div.'
          ).returns('Header component.');
          doubles.createElementStub.withArgs('div', { id: 'game-timer', style: 'header timer css styles' }, 'timer img.', '03:11').returns('timer div.');
          doubles.createElementStub.withArgs('img', { src: '/img/timer.png', alt: 'game timer', style: 'header timer img css styles' }).returns('timer img.');
          doubles.createElementStub.withArgs('div', { id: 'mines-left', style: 'header mines css styles' }, 'mine img.', props.minesLeft).returns('mines-left div.');
          doubles.createElementStub.withArgs('img', { src: '/img/mine.png', alt: 'mines left', style: 'header mines img css styles' }).returns('mine img.');
          doubles.createElementStub.withArgs('div', { id: 'lives', style: 'header lives css styles' }, 'lives img.', props.lives).returns('lives div.');
          doubles.createElementStub.withArgs('img', { src: '/img/lives.png', alt: 'lives left', style: 'header lives img css styles' }).returns('lives img.');
    
          assert.strictEqual(header.render(), 'Header component.');
          assert.isUndefined(sandbox.clock.timers);
        });
      });
    });
  });
});