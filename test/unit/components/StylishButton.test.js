'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require("react");

describe('StylishButton', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyStylishButton;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    proxyStylishButton = proxyquire('../../../src/js/components/StylishButton.js', {
      'react': react,
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial state', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});

      assert.deepEqual(stylishButton.state, { isActivated: false, isFocused: false, isHovered: false });
    });
  });

  describe('handleMouseDown()', function () {
    it('should set the "isActivated" state property to TRUE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      const event = {
        button: 0,
      };
      assert.isUndefined(stylishButton.handleMouseDown(event));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isActivated: true }]);
    });

    describe('if the mouse button is not the LMB', function () {
      it('should not set the "isActivated" state property to TRUE', function () {
        const stylishButton = new proxyStylishButton.StylishButton({});
        stylishButton.setState = doubles.setStateStub;
  
        const event = {
          button: 2,
        };
        assert.isUndefined(stylishButton.handleMouseDown(event));
        assert.isTrue(doubles.setStateStub.notCalled);
      });
    });
  });

  describe('handleMouseUp()', function () {
    it('should set the "isActivated" state property to FALSE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      const event = {
        button: 0,
      };
      assert.isUndefined(stylishButton.handleMouseUp(event));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isActivated: false }]);
    });

    describe('if the mouse button is not the LMB', function () {
      it('should not set the "isActivated" state property to FALSE', function () {
        const stylishButton = new proxyStylishButton.StylishButton({});
        stylishButton.setState = doubles.setStateStub;
  
        const event = {
          button: 2,
        };
        assert.isUndefined(stylishButton.handleMouseUp(event));
        assert.isTrue(doubles.setStateStub.notCalled);
      });
    });
  });

  describe('handleMouseEnter()', function () {
    it('should set the "isHovered" state property to TRUE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      assert.isUndefined(stylishButton.handleMouseEnter({}));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isHovered: true }]);
    });
  });
  
  describe('handleMouseLeave()', function () {
    it('should set the "isHovered" state property to FALSE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      assert.isUndefined(stylishButton.handleMouseLeave({}));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isHovered: false }]);
    });
  });
  
  describe('handleFocus()', function () {
    it('should set the "isFocused" state property to TRUE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      assert.isUndefined(stylishButton.handleFocus({}));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isFocused: true }]);
    });
  });
  
  describe('handleBlur()', function () {
    it('should set the "isFocused" state property to FALSE and return void', function () {
      const stylishButton = new proxyStylishButton.StylishButton({});
      stylishButton.setState = doubles.setStateStub;

      assert.isUndefined(stylishButton.handleBlur({}));
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ isFocused: false }]);
    });
  });

  describe('render()', function () {
    it('should return a <button> with the id and styles.base provided as props', function () {
      const props = {
        id: 'button id',
        styles: {
          base: { base: 'button base css styles' },
        },
        text: 'button text',
        events: {},
      };
      const stylishButton = new proxyStylishButton.StylishButton(props);

      doubles.createElementStub.withArgs(
        'button', { id: 'button id', style: { base: 'button base css styles' } }, 'button text'
      ).returns('StylishButton component.');

      assert.strictEqual(stylishButton.render(), 'StylishButton component.');
    });

    describe('if event listeners were provided as props', function () {
      it('should add them to the returned <button>', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
          },
          text: 'button text',
          events: { onClick: () => {}, onMove: () => {} },
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button', { id: 'button id', style: { base: 'button base css styles' }, ...props.events }, 'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":active" property', function () {
      it('should add the onMouseDown and onMouseUp properties to the returned <button>', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':active': { ':active': 'button :active css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":hover" property', function () {
      it('should add the onMouseEnter and onMouseLeave properties to the returned <button>', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { ':hover': 'button :hover css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":focus" property', function () {
      it('should add the onFocus and onBlur properties to the returned <button>', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':focus': { ':focus': 'button :focus css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":active", ":hover" and ":focus" property', function () {
      it('should add the all the relevant event listeners', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":active" and ":hover" property', function () {
      it('should add the all the relevant event listeners', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":active" and ":focus" property', function () {
      it('should add the all the relevant event listeners', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the provided styles has a ":hover" and ":focus" property', function () {
      it('should add the all the relevant event listeners', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isActivated" state property is true', function () {
      it('should add the styles for the ":active" property of the provided styles', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':active': { ':active': 'button :active css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isActivated = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', ':active': 'button :active css styles' },
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isHovered" state property is true', function () {
      it('should add the styles for the ":hover" property of the provided styles', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { ':hover': 'button :hover css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isHovered = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', ':hover': 'button :hover css styles' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isFocused" state property is true', function () {
      it('should add the styles for the ":focus" property of the provided styles', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':focus': { ':focus': 'button :focus css styles' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isFocused = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', ':focus': 'button :focus css styles' },
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isHovered", "isActivated" and "isFocused" state properties are true', function () {
      it('should add the styles for the ":hover", ":active" and ":focus" in this order', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isHovered = true;
        stylishButton.state.isActivated = true;
        stylishButton.state.isFocused = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', key1: ':hover', key2: ':active', key3: ':focus' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isHovered", "isActivated" state properties are true', function () {
      it('should add the styles for the ":hover" and ":active" in this order', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isHovered = true;
        stylishButton.state.isActivated = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', key1: ':hover', key2: ':active', key3: ':active' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isHovered", "isFocused" state properties are true', function () {
      it('should add the styles for the ":hover" and ":focus" in this order', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isHovered = true;
        stylishButton.state.isFocused = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', key1: ':hover', key2: ':hover', key3: ':focus' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });

    describe('if the "isActivated" and "isFocused" state properties are true', function () {
      it('should add the styles for the ":active" and ":focus" in this order', function () {
        const props = {
          id: 'button id',
          styles: {
            base: { base: 'button base css styles' },
            ':hover': { key1: ':hover', key2: ':hover', key3: ':hover' },
            ':active': { key2: ':active', key3: ':active' },
            ':focus': { key3: ':focus' },
          },
          text: 'button text',
          events: {},
        };
        const stylishButton = new proxyStylishButton.StylishButton(props);
        stylishButton.state.isActivated = true;
        stylishButton.state.isFocused = true;
  
        doubles.createElementStub.withArgs(
          'button',
          {
            id: 'button id',
            style: { base: 'button base css styles', key2: ':active', key3: ':focus' },
            onMouseEnter: stylishButton.handleMouseEnter,
            onMouseLeave: stylishButton.handleMouseLeave,
            onMouseDown: stylishButton.handleMouseDown,
            onMouseUp: stylishButton.handleMouseUp,
            onFocus: stylishButton.handleFocus,
            onBlur: stylishButton.handleBlur,
          },
          'button text'
        ).returns('StylishButton component.');
  
        assert.strictEqual(stylishButton.render(), 'StylishButton component.');
      });
    });
  });
});