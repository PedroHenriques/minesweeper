'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('NumberLives', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyNumberLives;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyNumberLives = proxyquire('../../../../src/js/components/Setup/NumberLives.js', {
      'react': react,
      '../../styles': {
        numLivesInput: 'number lives css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    it('should return a <p> with the enable flags checkbox checked and label', function () {
      const props = {
        value: 23,
        onChange: sandbox.stub(),
      };
      const numberLives = new proxyNumberLives.NumberLives(props);

      doubles.createElementStub.withArgs('p', { key: 'number-lives' }, 'Number of lives:', 'Lives text element.').returns('Lives <p>');
      doubles.createElementStub.withArgs(
        'input', { id: 'number-lives', style: 'number lives css styles', type: 'number', value: 23, onChange: props.onChange }
      ).returns('Lives text element.');

      assert.strictEqual(numberLives.render(), 'Lives <p>');
    });
  });
});