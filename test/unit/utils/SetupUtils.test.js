'use strict';
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const setupUtils = require('../../../src/js/utils/SetupUtils.js');

describe('MinefieldUtils', function () {
  const sandbox = sinon.createSandbox();
  let doubles;

  beforeEach(function () {
    doubles = {};
    doubles.randomStub = sandbox.stub(Math, 'random');
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('generateSeed()', function () {
    it('should generate a string with 3 to 10 characters between the UTF-16 decimal code 33 to 126 and return it', function () {
      doubles.randomStub.withArgs().onCall(0).returns(0.2); // 4 chars in the string
      doubles.randomStub.withArgs().onCall(1).returns(0.1); // char code 42
      doubles.randomStub.withArgs().onCall(2).returns(0.2); // char code 51
      doubles.randomStub.withArgs().onCall(3).returns(0.3); // char code 61
      doubles.randomStub.withArgs().onCall(4).returns(0.4); // char code 70

      assert.strictEqual(setupUtils.generateSeed(), '*3=F');
      assert.strictEqual(doubles.randomStub.callCount, 5);
    });

    describe('if the number generated, used to calculate the number of characters in the string, is zero', function () {
      it('should generate a string with 3 characters', function () {
        doubles.randomStub.withArgs().onCall(0).returns(0); // 3 chars in the string
        doubles.randomStub.withArgs().returns(0.2); // char code 51
  
        assert.strictEqual(setupUtils.generateSeed(), '333');
        assert.strictEqual(doubles.randomStub.callCount, 4);
      });
    });
    
    describe('if the number generated, used to calculate the number of characters in the string, is 0.999', function () {
      it('should generate a string with 10 characters', function () {
        doubles.randomStub.withArgs().onCall(0).returns(0.9999); // 10 chars in the string
        doubles.randomStub.withArgs().returns(0.1); // char code 42
  
        assert.strictEqual(setupUtils.generateSeed(), '**********');
        assert.strictEqual(doubles.randomStub.callCount, 11);
      });
    });

    describe('if a number generated, used to calculate decimal code of a characters, is zero', function () {
      it('should match the character with decimal code 33', function () {
        doubles.randomStub.withArgs().onCall(0).returns(0); // 3 chars in the string
        doubles.randomStub.withArgs().returns(0); // char code 33
  
        assert.strictEqual(setupUtils.generateSeed(), '!!!');
        assert.strictEqual(doubles.randomStub.callCount, 4);
      });
    });
    
    describe('if a number generated, used to calculate decimal code of a characters, is 0.999', function () {
      it('should match the character with decimal code 126', function () {
        doubles.randomStub.withArgs().onCall(0).returns(0); // 3 chars in the string
        doubles.randomStub.withArgs().returns(0.999); // char code 126
  
        assert.strictEqual(setupUtils.generateSeed(), '~~~');
        assert.strictEqual(doubles.randomStub.callCount, 4);
      });
    });
  });
});