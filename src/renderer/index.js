require('./changelog/changelog');
require('./changelog/changelog.html');

const path = window.location.search.split('=')[1];

document.getElementById(
  'app',
).innerHTML = `<object type="text/html" data='./${path}/changelog.html' ></object>`;
