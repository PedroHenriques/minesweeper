'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('GameSeed', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyGameSeed;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyGameSeed = proxyquire('../../../../src/js/components/Setup/GameSeed.js', {
      'react': react,
      '../../styles': {
        gameSeedInput: 'game seed css styles',
        gameSeedGenerate: 'game seed generate css style'
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    it('should return a <p> with the game seed text and input populated with the initial seed value and the randomize button', function () {
      const props = {
        value: 'game seed',
        onChange: sandbox.stub(),
        onGenerate: sandbox.stub(),
      };
      const gameSeed = new proxyGameSeed.GameSeed(props);

      doubles.createElementStub.withArgs('p', { key: 'game-seed' }, 'Seed:', 'Seed text element.', 'Generate button.').returns('Seed <p>');
      doubles.createElementStub.withArgs(
        'input', { id: 'game-seed', style: 'game seed css styles', type: 'text', value: 'game seed', onChange: props.onChange }
      ).returns('Seed text element.');
      doubles.createElementStub.withArgs(
        'img', { src: '/img/dice.png', style: 'game seed generate css style', title: 'Generate new seed!', alt: 'generate new seed', onClick: props.onGenerate }
      ).returns('Generate button.');
      
      assert.strictEqual(gameSeed.render(), 'Seed <p>');
    });
  });
});