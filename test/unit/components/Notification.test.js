'use strict';
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const react = require('react');
const stylishButton = require('../../../src/js/components/StylishButton.js');

describe('Notification', function () {
  const sandbox = sinon.createSandbox();
  let doubles;
  let proxyNotification;

  beforeEach(function () {
    doubles = {};
    doubles.createElementStub = sandbox.stub(react, 'createElement');
    doubles.setStateStub = sandbox.stub();
    doubles.stylishButtonStub = sandbox.stub(stylishButton);
    proxyNotification = proxyquire('../../../src/js/components/Notification.js', {
      'react': react,
      './StylishButton': doubles.stylishButtonStub,
      '../styles': {
        notification: 'notification css styles',
        notificationButton: 'notificationButton css styles',
      },
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor()', function () {
    it('should set the initial state', function () {
      const notification = new proxyNotification.Notification({});

      assert.deepEqual(notification.state, { hideNotif: false });
    });
  });

  describe('handleHide()', function () {
    it('should update the hideNotif state property to true and return void', function () {
      const notification = new proxyNotification.Notification({});
      notification.setState = doubles.setStateStub;

      assert.isUndefined(notification.handleHide());
      assert.isTrue(doubles.setStateStub.calledOnce);
      assert.deepEqual(doubles.setStateStub.args[0], [{ hideNotif: true }]);
    });
  });

  describe('render()', function () {
    it('should return a div with the id provided in props, a <p> with the notif text and a <button> that hide the notification', function () {
      const notification = new proxyNotification.Notification({ id: 'notification id.', notifText: 'notification text.' });

      doubles.createElementStub.withArgs(
        'div', { id: 'notification id.', style: 'notification css styles' }, 'p notif text elem.', 'StylishButton component.'
      ).returns('Notification content.');
      doubles.createElementStub.withArgs('p', null, 'notification text.').returns('p notif text elem.');
      doubles.createElementStub.withArgs(
        doubles.stylishButtonStub.StylishButton,
        { id: '', styles: 'notificationButton css styles', text: 'Ok', events: { onClick: notification.handleHide } }
      ).returns('StylishButton component.');

      assert.strictEqual(notification.render(), 'Notification content.');
    });

    describe('if the notification is hidden', function () {
      it('should return an empty string', function () {
        const notification = new proxyNotification.Notification({});
        notification.state = { hideNotif: true };

        assert.strictEqual(notification.render(), '');
      });
    });
  });
});