'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('FlagsEnabled', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyFlagsEnabled;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyFlagsEnabled = proxyquire('../../../../src/js/components/Setup/FlagsEnabled.js', {
      'react': react,
      '../../styles': {
        flagsEnabledCheckbox: 'checkbox css styles.',
        flagsEnabledLabel: 'label css styles.',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    describe('if props.checked is true', function () {
      it('should return a <p> with the enable flags checkbox checked and label', function () {
        const props = {
          checked: true,
          onChange: sandbox.stub(),
        };
        const flagsEnabled = new proxyFlagsEnabled.FlagsEnabled(props);
  
        doubles.createElementStub.withArgs('p', { key: 'flags-enabled' }, 'checkbox element.', 'label element.').returns('Flags <p>');
        doubles.createElementStub.withArgs(
          'input', { id: 'flags-enabled', type: 'checkbox', checked: true, onChange: props.onChange, style: 'checkbox css styles.' }
        ).returns('checkbox element.');
        doubles.createElementStub.withArgs(
          'label', { htmlFor: 'flags-enabled', style: 'label css styles.' }, 'Enable flags'
        ).returns('label element.');
  
        assert.strictEqual(flagsEnabled.render(), 'Flags <p>');
      });
    });

    describe('if props.checked is false', function () {
      it('should return a <p> with the enable flags checkbox unchecked and label', function () {
        const props = {
          checked: false,
          onChange: sandbox.stub(),
        };
        const flagsEnabled = new proxyFlagsEnabled.FlagsEnabled(props);
  
        doubles.createElementStub.withArgs('p', { key: 'flags-enabled' }, 'checkbox element.', 'label element.').returns('Flags <p>');
        doubles.createElementStub.withArgs(
          'input', { id: 'flags-enabled', type: 'checkbox', checked: false, onChange: props.onChange, style: 'checkbox css styles.' }
        ).returns('checkbox element.');
        doubles.createElementStub.withArgs(
          'label', { htmlFor: 'flags-enabled', style: 'label css styles.' }, 'Enable flags'
        ).returns('label element.');
  
        assert.strictEqual(flagsEnabled.render(), 'Flags <p>');
      });
    });
  });
});