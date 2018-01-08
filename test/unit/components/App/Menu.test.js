'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require('react');
const stylishButton = require('../../../../src/js/components/StylishButton');

describe('Menu', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyMenu;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.stylishButtonStub = sandbox.stub(stylishButton);
    proxyMenu = proxyquire('../../../../src/js/components/App/Menu.js', {
      'react': react,
      '../StylishButton': doubles.stylishButtonStub,
      '../../styles': {
        menu: 'menu css styles',
        newGameButton: 'new game button css styles',
        resetGameButton: 'reset button css styles',
        githubLink: 'github link css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('render()', function () {
    it('should return a div with ID "menu" with the new game and reset StylishButtons and github link as children', function () {
      const props = {
        onNewGame: sandbox.stub(),
        onResetGame: sandbox.stub(),
      };
      const menu = new proxyMenu.Menu(props);

      doubles.createElementStub.withArgs('div', { id: 'menu', style: 'menu css styles' }, 'new game button.', 'reset button.', 'github link.').returns('Menu component.');
      doubles.createElementStub.withArgs(
        doubles.stylishButtonStub.StylishButton,
        { id: 'new-game-btn', styles: 'new game button css styles', text: 'New Game', events: { onClick: props.onNewGame } }
      ).returns('new game button.');
      doubles.createElementStub.withArgs(
        doubles.stylishButtonStub.StylishButton,
        { id: 'reset-game-btn', styles: 'reset button css styles', text: 'Reset Game', events: { onClick: props.onResetGame } }
      ).returns('reset button.');
      doubles.createElementStub.withArgs(
        'a',
        { style: 'github link css styles', href: 'https://github.com/PedroHenriques/Minesweeper', target: '_blank' },
        'Source Code'
      ).returns('github link.');

      assert.strictEqual(menu.render(), 'Menu component.');
    });
  });
});