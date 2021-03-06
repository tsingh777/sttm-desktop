const h = require('hyperscript');
// const fs = require('fs');
const Noty = require('noty');
const themes = require('./themes.json');

const { store } = require('electron').remote.require('./app');

// const imagesPath = 'assets/custom_backgrounds';

const defaultTheme = themes[0];

/* defaultTheme.bgImage = '';
const getCurrentTheme = () => {
  const currentThemeString = localStorage.getItem('customTheme');
  if (currentThemeString) {
    try {
      return JSON.parse(currentThemeString);
    } catch (error) {
      new Noty({
        type: 'error',
        text: `There is an error reading current theme.
        Try checking theme file for errors. If error persists,
        report it at www.sttm.co`,
        timeout: 3000,
        modal: true,
      }).show();
      return defaultTheme;
    }
  }
  return defaultTheme;
}; */

const swatchFactory = themeInstance =>
  h(
    'li.theme-instance',
    {
      style: {
        'background-color': themeInstance['background-color'],
        'background-image': themeInstance['background-image'] ? `url(assets/img/custom_backgrounds/${themeInstance['background-image']})` : 'none',
      },
      onclick: () => {
        // const newTheme = themeInstance;
        // newTheme.bgImage = getCurrentTheme().bgImage;
        try {
          document.body.classList.remove(store.getUserPref('app.theme'));
          store.setUserPref('app.theme', themeInstance.key);
          document.body.classList.add(themeInstance.key);
          global.core.platformMethod('updateSettings');
        } catch (error) {
          new Noty({
            type: 'error',
            text: `There is an error parsing this theme.
            Try checking theme file for errors. If error persists,
            report it at www.sttm.co`,
            timeout: 3000,
            modal: true,
          }).show();
        }
      },
    },
    h(
      `span.${themeInstance.name}`,
      {
        style: {
          color: themeInstance['gurbani-color'],
        },
      },
      themeInstance.name));

/*
const bgTileFactory = (bgImage) => {
  const bgImageUrl = bgImage ? `url(../${imagesPath}/${bgImage})` : '';
  return h(
    'li.theme-instance',
    {
      style: {
        'background-image': bgImageUrl,
      },
      onclick: () => {
        const currentTheme = getCurrentTheme();
        currentTheme.bgImage = bgImage;
        try {
          localStorage.setItem('customTheme', JSON.stringify(currentTheme));
          global.core.platformMethod('updateTheme');
        } catch (error) {
          new Noty({
            type: 'error',
            text: `There is an error adding this background to current theme.
            Try checking themes.json for errors. If error persists,
            report it at www.sttm.co`,
            timeout: 3000,
            modal: true,
          }).show();
        }
      },
    },
  );
};
*/
const swatchHeaderFactory = headerText => h('header.options-header', headerText);

module.exports = {
  defaultTheme,
  init() {
    const themeOptions = document.querySelector('#custom-theme-options');

    themeOptions.appendChild(swatchHeaderFactory('Colours'));

    themes.forEach((themeInstance) => {
      if (themeInstance.type === 'COLOR') {
        themeOptions.appendChild(swatchFactory(themeInstance));
      }
    });

    themeOptions.appendChild(swatchHeaderFactory('Backgrounds'));
    themes.forEach((themeInstance) => {
      if (themeInstance.type === 'BACKGROUND') {
        themeOptions.appendChild(swatchFactory(themeInstance));
      }
    });
    themeOptions.appendChild(swatchHeaderFactory('Special Conditions'));
    themes.forEach((themeInstance) => {
      if (themeInstance.type === 'SPECIAL') {
        themeOptions.appendChild(swatchFactory(themeInstance));
      }
    });

    /* customThemeOptions.appendChild(swatchHeaderFactory('Custom Backgrounds'));
    // customThemeOptions.appendChild(bgTileFactory(''));
    fs.readdir(imagesPath, (err, images) => {
      images.forEach((image) => {
        customThemeOptions.appendChild(bgTileFactory(image));
      });
    }); */
  },
};
