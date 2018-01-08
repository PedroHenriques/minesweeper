'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('Difficulty', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyDifficulty;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyDifficulty = proxyquire('../../../../src/js/components/Setup/Difficulty.js', {
      'react': react,
      '../../styles': {
        difficultySelect: 'difficulty select css styles'
      },
      '../../data': {
        difficulties: [
          { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
          { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
          { name: 'Expert', rows: 30, cols: 16, mines: 99 },
        ],
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    it('should return a <p> with the label and difficulty select element', function () {
      const props = {
        value: 100,
        onChange: sandbox.stub(),
      };
      const difficulty = new proxyDifficulty.Difficulty(props);

      doubles.createElementStub.withArgs('p', { key: 'difficulty' }, 'Difficulty:', 'Difficulty select element.').returns('Difficulty <p>');
      doubles.createElementStub.withArgs(
        'select', { id: 'difficulty', style: 'difficulty select css styles', value: props.value, onChange: props.onChange }, ['difficulty option 0', 'difficulty option 1', 'difficulty option 2']
      ).returns('Difficulty select element.');
      doubles.createElementStub.withArgs('option', { key: 0, value: 0 }, 'Beginner (9x9 - 10 mines)').returns('difficulty option 0');
      doubles.createElementStub.withArgs('option', { key: 1, value: 1 }, 'Intermediate (16x16 - 40 mines)').returns('difficulty option 1');
      doubles.createElementStub.withArgs('option', { key: 2, value: 2 }, 'Expert (30x16 - 99 mines)').returns('difficulty option 2');

      assert.strictEqual(difficulty.render(), 'Difficulty <p>');
    });
  });
});