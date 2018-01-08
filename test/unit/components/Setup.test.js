'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");
const difficulty = require('../../../src/js/components/Setup/Difficulty.js');
const flagsEnabled = require('../../../src/js/components/Setup/FlagsEnabled.js');
const numberLives = require('../../../src/js/components/Setup/NumberLives.js');
const gameSeed = require('../../../src/js/components/Setup/GameSeed.js');
const stylishButton = require('../../../src/js/components/StylishButton.js');
const setupUtils = require('../../../src/js/utils/SetupUtils.js');

describe('Setup', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxySetup;
  let testData;

  beforeEach(function () {
    testData = {};
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.difficultyStub = sandbox.stub(difficulty);
    doubles.flagsEnabledStub = sandbox.stub(flagsEnabled);
    doubles.numberLivesStub = sandbox.stub(numberLives);
    doubles.gameSeedStub = sandbox.stub(gameSeed);
    doubles.stylishButtonStub = sandbox.stub(stylishButton);
    doubles.setupUtilsStub = sandbox.stub(setupUtils);
    proxySetup = proxyquire('../../../src/js/components/Setup.js', {
      'react': react,
      './Setup/Difficulty': doubles.difficultyStub,
      './Setup/FlagsEnabled': doubles.flagsEnabledStub,
      './Setup/NumberLives': doubles.numberLivesStub,
      './Setup/GameSeed': doubles.gameSeedStub,
      './StylishButton': doubles.stylishButtonStub,
      '../data': testData,
      '../styles': {
        setup: 'setup css styles',
        startGameButton: 'start game button css styles',
      },
      '../utils/SetupUtils': doubles.setupUtilsStub,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial values for the state', function () {
      doubles.setupUtilsStub.generateSeed.withArgs().returns('game seed');

      const setup = new proxySetup.Setup({});

      assert.deepEqual(setup.state, { difficulty: 0, flagsEnabled: true, numLives: 1, gameSeed: 'game seed' });
      assert.isTrue(doubles.setupUtilsStub.generateSeed.calledOnce);
    });
  });

  describe('handleChange()', function () {
    describe('if the target element has ID "difficulty"', function () {
      it('should validate the select value, update the state with the now selected difficulty index and return void', function () {
        const setup = new proxySetup.Setup({});
        setup.setState = doubles.setStateStub;
        testData.difficulties = [{}, {}];

        const event = {
          target: {
            id: 'difficulty',
            selectedIndex: 0,
          },
        };
        assert.isUndefined(setup.handleChange(event));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ difficulty: 0 }]);
      });

      describe('if the target element is not a select element', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'difficulty',
              value: 'input text value',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });

      describe('if the selected index is not valid', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
          testData.difficulties = [{}, {}];
  
          const event = {
            target: {
              id: 'difficulty',
              selectedIndex: 3,
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
    });

    describe('if the target element has ID "flags-enabled"', function () {
      it('should update the state with the checkbox checked status and return void', function () {
        const setup = new proxySetup.Setup({});
        setup.setState = doubles.setStateStub;

        const event = {
          target: {
            id: 'flags-enabled',
            type: 'checkbox',
            checked: true,
          },
        };
        assert.isUndefined(setup.handleChange(event));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ flagsEnabled: true }]);
      });

      describe('if the checkbox is unchecked', function () {
        it('should update the state with false and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'flags-enabled',
              type: 'checkbox',
              checked: false,
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.calledOnce);
          assert.deepEqual(doubles.setStateStub.args[0], [{ flagsEnabled: false }]);
        });
      });

      describe('if the target element is not a checkbox', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'flags-enabled',
              type: 'text',
              text: 'input text value',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
    });

    describe('if the target element has ID "number-lives"', function () {
      it('should update the state with the input\'s value and return void', function () {
        const setup = new proxySetup.Setup({});
        setup.setState = doubles.setStateStub;

        const event = {
          target: {
            id: 'number-lives',
            type: 'number',
            value: '4',
          },
        };
        assert.isUndefined(setup.handleChange(event));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ numLives: 4 }]);
      });

      describe('if the target element\'s value is zero', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'number-lives',
              type: 'number',
              value: '0',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
      
      describe('if the target element\'s value is negative', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'number-lives',
              type: 'number',
              value: '-3',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
      
      describe('if the target element\'s type is "text"', function () {
        it('should update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'number-lives',
              type: 'text',
              value: '2',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ numLives: 2 }]);
        });
      });

      describe('if the target element is not an input number or text element', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'number-lives',
              type: 'checkbox',
              checked: true,
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
    });

    describe('if the target element has ID "game-seed"', function () {
      it('should update the state with the input\'s value and return void', function () {
        const setup = new proxySetup.Setup({});
        setup.setState = doubles.setStateStub;

        const event = {
          target: {
            id: 'game-seed',
            type: 'text',
            value: 'game seed',
          },
        };
        assert.isUndefined(setup.handleChange(event));
        assert.isTrue(doubles.setStateStub.calledOnce);
        assert.deepEqual(doubles.setStateStub.args[0], [{ gameSeed: 'game seed' }]);
      });

      describe('if the target element is not an input text element', function () {
        it('should not update the state and return void', function () {
          const setup = new proxySetup.Setup({});
          setup.setState = doubles.setStateStub;
  
          const event = {
            target: {
              id: 'game-seed',
              type: 'number',
              value: 'game seed',
            },
          };
          assert.isUndefined(setup.handleChange(event));
          assert.isTrue(doubles.setStateStub.notCalled);
        });
      });
    });
  });

  describe('handleStart()', function () {
    it('should build an object of type IGameConfig, call the App component to start the game and return void', function () {
      testData.difficulties = [
        { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
        { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
      ];

      const props = { onStart: sandbox.stub() };
      const setup = new proxySetup.Setup(props);
      setup.state = {
        difficulty: 1,
        flagsEnabled: true,
        numLives: 2,
        gameSeed: 'game seed',
      };

      assert.isUndefined(setup.handleStart());
      assert.isTrue(props.onStart.calledOnce);
      assert.deepEqual(props.onStart.args[0], [{
        numMines: 40,
        dimensions: { rows: 16, cols: 16 },
        flagsEnabled: true,
        numLives: 2,
        gameSeed: 'game seed',
      }]);
    });

    describe('if the flags are disabled', function () {
      it('should build the correct object of type IGameConfig, call the App component to start the game and return void', function () {
        testData.difficulties = [
          { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
          { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
        ];
        
        const props = { onStart: sandbox.stub() };
        const setup = new proxySetup.Setup(props);
        setup.state = {
          difficulty: 0,
          flagsEnabled: false,
          numLives: 1,
          gameSeed: 'game seed',
        };
  
        assert.isUndefined(setup.handleStart());
        assert.isTrue(props.onStart.calledOnce);
        assert.deepEqual(props.onStart.args[0], [{
          numMines: 10,
          dimensions: { rows: 9, cols: 9 },
          flagsEnabled: false,
          numLives: 1,
          gameSeed: 'game seed',
        }]);
      });
    });
  });

  describe('handleGenerateSeed()', function () {
    it('should call generateSeed(), update the state with the returned value and return void', function () {
      doubles.setupUtilsStub.generateSeed.withArgs().onCall(0).returns('initial seed');
      doubles.setupUtilsStub.generateSeed.withArgs().onCall(1).returns('new random seed');

      const setup = new proxySetup.Setup({ onStart: sandbox.stub() });
      setup.setState = doubles.setStateStub;

      assert.isUndefined(setup.handleGenerateSeed());
      assert.strictEqual(doubles.setupUtilsStub.generateSeed.callCount, 2);
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ gameSeed: 'new random seed' }]);
    });
  });

  describe('render()', function () {
    it('should return a div with id "setup" and as children the input fields for the game settings and the start game StylishButton', function () {
      const setup = new proxySetup.Setup({});
      setup.state = {
        difficulty: 200,
        flagsEnabled: false,
        numLives: 100,
        gameSeed: 'seed value',
      };

      doubles.createElementStub.withArgs(
        'div', { id: 'setup', style: 'setup css styles' }, 'Difficulty element.', 'Flags element.', 'Lives element.', 'Seed element.', 'Start button.'
      ).returns('Setup component.');
      doubles.createElementStub.withArgs(doubles.difficultyStub.Difficulty, {
        value: 200,
        onChange: setup.handleChange,
      }).returns('Difficulty element.');
      doubles.createElementStub.withArgs(doubles.flagsEnabledStub.FlagsEnabled, {
        checked: false,
        onChange: setup.handleChange,
      }).returns('Flags element.');
      doubles.createElementStub.withArgs(doubles.numberLivesStub.NumberLives, {
        value: 100,
        onChange: setup.handleChange,
      }).returns('Lives element.');
      doubles.createElementStub.withArgs(doubles.gameSeedStub.GameSeed, {
        value: 'seed value',
        onChange: setup.handleChange,
        onGenerate: setup.handleGenerateSeed,
      }).returns('Seed element.');
      doubles.createElementStub.withArgs(
        doubles.stylishButtonStub.StylishButton,
        { id: 'start-button', styles: 'start game button css styles', text: 'Start Game', events: { onClick: setup.handleStart } },
      ).returns('Start button.');

      assert.strictEqual(setup.render(), 'Setup component.');
    });
  });
});