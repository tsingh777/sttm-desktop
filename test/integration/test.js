/* eslint-disable consistent-return */
const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');
const mocha = require('mocha');
const fs = require('fs');

const describe = mocha.describe;
const it = mocha.it;

function screenShot(app) {
  app.browserWindow.capturePage().then((imageBuffer) => {
    fs.writeFile(`screenshots/screen-shot-${(new Date()).getMilliseconds()}.png`, imageBuffer);
  });
}

describe('Application launch', function () {
  this.timeout(10000);

  before(() => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
    });
    return this.app.start();
  });

  after(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', () => this.app.client.getWindowCount().then(count => assert.ok(count === 2, 'Application opens')));

  it('can toggle to non presenter view', () => {

  });
});
