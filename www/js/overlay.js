const electron = require('electron');
const h = require('hyperscript');
const ip = require('ip');
const copy = require('copy-to-clipboard');

const { ipcRenderer, remote } = electron;

const { store } = remote.require('./app');
const analytics = remote.getGlobal('analytics');

const { overlayVars } = store.get('obs').overlayPrefs;
let overlayCast = store.getUserPref('app.overlay-cast');
let announcementOverlay = store.getUserPref('app.announcement-overlay');

const controlPanel = document.querySelector('.control-panel');
const textControls = document.querySelector('.text-controls');
const webview = document.createElement('webview');

const getUrl = () => {
  const overlayPort = remote.getGlobal('overlayPort');
  const host = ip.address();
  return `http://${host}:${overlayPort}/`;
};

let url = getUrl();

const savePrefs = () => {
  store.set('obs', {
    overlayPrefs: {
      overlayVars,
    },
  });
  ipcRenderer.send('update-overlay-vars');
};

const colorInputFactory = (inputName, defaultColor, onchangeAction) =>
  h(
    `div.${inputName}.input-wrap`,
    h(`input.${inputName}.color-input`, {
      type: 'color',
      onchange: onchangeAction,
      value: defaultColor,
    }),
  );

const controlsFactory = (controls, label) =>
  h('div.toggle-text', controls, h('div.setting-label', label));

const changeColor = e => {
  const color = e.target.value;
  overlayVars.textColor = color;
  savePrefs();
};

const changeGurbaniColor = e => {
  const color = e.target.value;
  overlayVars.gurbaniTextColor = color;
  savePrefs();
};

const changeBg = e => {
  const color = e.target.value;
  overlayVars.bgColor = color;
  savePrefs();
};

const increaseBarSize = () => {
  const size = overlayVars.padding;
  const newSize = size < 5 ? size + 0.1 : 5;

  overlayVars.padding = newSize;
  savePrefs();
};
const decreaseBarSize = () => {
  const size = overlayVars.padding;
  const newSize = size > 0.5 ? size - 0.1 : 0.5;

  overlayVars.padding = newSize;
  savePrefs();
};

const increasefontSize = () => {
  const size = overlayVars.fontSize;
  const newSize = size < 14 ? size + 0.25 : 14;
  overlayVars.fontSize = newSize;
  savePrefs();
};
const decreasefontSize = () => {
  const size = overlayVars.fontSize;
  const newSize = size > 1 ? size - 0.25 : 1;

  overlayVars.fontSize = newSize;
  savePrefs();
};

const increaseGurbanifontSize = () => {
  const size = overlayVars.gurbaniFontSize;
  const newSize = size < 15 ? size + 0.25 : 15;
  overlayVars.gurbaniFontSize = newSize;
  savePrefs();
};
const decreaseGurbanifontSize = () => {
  const size = overlayVars.gurbaniFontSize;
  const newSize = size > 1 ? size - 0.25 : 1;

  overlayVars.gurbaniFontSize = newSize;
  savePrefs();
};

const increaseOpacity = () => {
  const opacity = overlayVars.bgOpacity;
  const newSize = opacity > 0.9 ? 1 : opacity + 0.1;

  overlayVars.bgOpacity = newSize;
  savePrefs();
};
const decreaseOpacity = () => {
  const opacity = overlayVars.bgOpacity;
  const newSize = opacity < 0.1 ? 0 : opacity - 0.1;

  overlayVars.bgOpacity = newSize;
  savePrefs();
};

const separator = h('div.separator');
const separatorY = () => h('div.separator-y').cloneNode(true);

const layoutButtonFactory = layoutName =>
  h(
    `div.layout-btn.${layoutName}`,
    h('div.layout-bar.layout-bar-1'),
    h('div.layout-bar.layout-bar-2'),
    h('div.layout-bar.layout-bar-3'),
    h('div.layout-bar.layout-bar-4'),
    {
      onclick: () => {
        document.querySelectorAll('.content-bar').forEach(bar => {
          bar.setAttribute('style', 'transform:none');
        });
        overlayVars.layout = layoutName;
        savePrefs();
        analytics.trackEvent('overlay', 'layout', layoutName);
      },
    },
  );

const resizeButtonFactory = (increaseFunc, decreaseFunc) =>
  h(
    'div.input-wrap.resize-btn',
    h(
      'span.export-btn',
      {
        onclick: () => {
          decreaseFunc();
        },
      },
      h('i.fa.fa-minus-circle.cp-icon'),
    ),
    h(
      'span.export-btn',
      {
        onclick: () => {
          increaseFunc();
        },
      },
      h('i.fa.fa-plus-circle.cp-icon'),
    ),
  );

const copyURLButton = h(
  'div.input-wrap',
  {
    title: `${url}`,
    onclick: () => {
      copy(url);
      analytics.trackEvent('overlay', 'urlCopied', url);
    },
  },
  h('div.export-btn', h('i.fa.fa-files-o.cp-icon')),
  h('div.setting-label', 'Copy URL'),
);

const toggleLarivaar = h(
  'div.input-wrap',
  {
    onclick: evt => {
      overlayVars.overlayLarivaar = !overlayVars.overlayLarivaar;
      savePrefs();

      const isLarivaar = overlayVars.overlayLarivaar;

      const $larivaarIcon = evt.currentTarget.querySelector('.cp-icon');
      $larivaarIcon.classList.toggle('fa-unlink', isLarivaar);
      $larivaarIcon.classList.toggle('fa-link', !isLarivaar);

      const $larivaarLabel = evt.currentTarget.querySelector('.setting-label');
      $larivaarLabel.innerText = `Use ${isLarivaar ? 'Padched' : 'Larivaar'}`;
    },
  },
  h(
    'div.export-btn#larivaar-btn',
    h(`i.fa.cp-icon.${overlayVars.overlayLarivaar ? 'fa-unlink' : 'fa-link'}`),
  ),
  h('div.setting-label', `Use ${overlayVars.overlayLarivaar ? 'Padched' : 'Larivaar'}`),
);

const toggleCast = h(
  'div.input-wrap.cast-toggle',
  {
    onclick: evt => {
      overlayCast = !overlayCast;
      store.setUserPref('app.overlay-cast', overlayCast);
      ipcRenderer.send('toggle-obs-cast', overlayCast);
      ipcRenderer.send('update-settings');

      const $castIcon = evt.currentTarget.querySelector('.cp-icon');
      $castIcon.classList.toggle('fa-toggle-on', overlayCast);
      $castIcon.classList.toggle('fa-toggle-off', !overlayCast);
      document.body.classList.toggle('overlay-off', !overlayCast);

      const $castLabel = evt.currentTarget.querySelector('.setting-label');
      $castLabel.innerText = `${overlayCast ? 'Overlay On' : 'Overlay Off'}`;
      analytics.trackEvent('overlay', 'toggleCast', overlayCast);

      url = getUrl();
      webview.src = `${url}?preview`;
    },
  },
  h('div#cast-btn', h(`i.fa.cp-icon.${overlayCast ? 'fa-toggle-on' : 'fa-toggle-off'}`)),
  h('div.setting-label', `${overlayCast ? 'Overlay On' : 'Overlay Off'}`),
);

const toggleLogo = h(
  'div.input-wrap.logo-toggle',
  {
    onclick: evt => {
      if (overlayCast) {
        overlayVars.overlayLogo = !overlayVars.overlayLogo;
        savePrefs();
        const { overlayLogo } = overlayVars;

        const $logoIcon = evt.currentTarget.querySelector('.cp-icon');
        $logoIcon.classList.toggle('fa-toggle-on', overlayLogo);
        $logoIcon.classList.toggle('fa-toggle-off', !overlayLogo);

        analytics.trackEvent('overlay', 'toggleLogo', overlayLogo);
      }
    },
  },
  h(
    'div#logo-btn',
    h(`i.fa.cp-icon.${overlayVars.overlayLogo ? 'fa-toggle-on' : 'fa-toggle-off'}`),
  ),
  h('div.setting-label', 'Logo'),
);

const toggleAnnouncements = h(
  'div.input-wrap.announcement-toggle',
  {
    onclick: evt => {
      if (overlayCast) {
        announcementOverlay = !announcementOverlay;
        store.setUserPref('app.announcement-overlay', announcementOverlay);
        ipcRenderer.send('update-settings');

        const $announcementIcon = evt.currentTarget.querySelector('.cp-icon');
        $announcementIcon.classList.toggle('fa-toggle-on', announcementOverlay);
        $announcementIcon.classList.toggle('fa-toggle-off', !announcementOverlay);

        analytics.trackEvent('overlay', 'toggleAnnouncements', announcementOverlay);
      }
    },
  },
  h(
    'div#announcement-btn',
    h(`i.fa.cp-icon.${announcementOverlay ? 'fa-toggle-on' : 'fa-toggle-off'}`),
  ),
  h('div.setting-label', 'Announcement'),
);

/** Main Control Bar Items */
controlPanel.append(toggleCast);
controlPanel.append(toggleLogo);
controlPanel.append(toggleAnnouncements);
controlPanel.append(separator);
controlPanel.append(copyURLButton);
controlPanel.append(toggleLarivaar);

/** Text Control Bar Items */
const topLayoutBtn = layoutButtonFactory('top');
const bottomLayoutBtn = layoutButtonFactory('bottom');
const splitLayoutBtn = layoutButtonFactory('split');
const gurbaniColor = colorInputFactory(
  'toggle-text',
  overlayVars.gurbaniTextColor,
  changeGurbaniColor,
);
const textColor = colorInputFactory('toggle-text', overlayVars.textColor, changeColor);
const backgroundColor = colorInputFactory('background', overlayVars.bgColor, changeBg);
const changeBarSizeButton = resizeButtonFactory(increaseBarSize, decreaseBarSize);
const changefontSizeButton = resizeButtonFactory(increasefontSize, decreasefontSize);
const changeGurbanifontSizeButton = resizeButtonFactory(
  increaseGurbanifontSize,
  decreaseGurbanifontSize,
);
const changeOpacityButton = resizeButtonFactory(increaseOpacity, decreaseOpacity);

textControls.append(controlsFactory([gurbaniColor, changeGurbanifontSizeButton], 'Gurbani'));
textControls.append(separatorY());
textControls.append(controlsFactory([textColor, changefontSizeButton], 'Text'));
textControls.append(separatorY());
textControls.append(controlsFactory(backgroundColor, 'BG'));
textControls.append(separatorY());
textControls.append(controlsFactory(changeBarSizeButton, 'Size'));
textControls.append(controlsFactory(changeOpacityButton, 'Opacity'));
textControls.append(separatorY());
textControls.append(controlsFactory([topLayoutBtn, bottomLayoutBtn, splitLayoutBtn], 'Layout'));

const themeSelector = document.querySelector('.theme-selector');

const themeObjects = {
  aNewDay: {
    label: 'a new day',
    bgColor: '#97d6f7',
    textColor: '#003a8c',
    gurbaniTextColor: '#0e2654',
  },
  baagiBlue: {
    label: 'baagi blue',
    bgColor: '#274f69',
    textColor: '#fff',
    gurbaniTextColor: '#fff',
  },
  khalsaRush: {
    label: 'khalsa rush',
    bgColor: '#ffa61a',
    textColor: '#071f77',
    gurbaniTextColor: '#071f77',
  },
  moodyBlue: {
    label: 'moody blue',
    bgColor: '#2d73a7',
    textColor: '#fff',
    gurbaniTextColor: '#fff',
  },
  blackAndBlue: {
    label: 'black and blue',
    bgColor: '#000',
    textColor: '#a3eafd',
    gurbaniTextColor: '#fff',
  },
  floral: {
    label: 'floral',
    bgColor: '#f5b7d1',
    textColor: '#a3eafd',
    gurbaniTextColor: '#fff',
  },
  khalsaGold: {
    label: 'khalsa gold',
    bgColor: '#58330a',
    textColor: '#ffba00',
    gurbaniTextColor: '#ffba00',
  },
  neverForget: {
    label: 'never forget',
    bgColor: '#000',
    textColor: '#f00',
    gurbaniTextColor: '#f00',
  },
};

const themeSwatchFactory = themeOptions => {
  const themeClass = themeOptions.label
    .toLowerCase()
    .split(' ')
    .join('-');

  return h(
    `div.overlay-theme-swatch.${themeClass}`,
    {
      onclick: () => {
        overlayVars.theme = themeClass;
        overlayVars.textColor = themeOptions.textColor;
        overlayVars.gurbaniTextColor = themeOptions.gurbaniTextColor;
        overlayVars.bgColor = themeOptions.bgColor;
        savePrefs();

        analytics.trackEvent('overlay', 'theme', overlayVars.theme);
      },
    },
    h('span', themeOptions.label),
  );
};

themeSelector.appendChild(h('div.theme-selector-header', 'Presets'));

document.body.classList.toggle('overlay-off', !overlayCast);

Object.keys(themeObjects).forEach(themeObject => {
  themeSelector.appendChild(themeSwatchFactory(themeObjects[themeObject]));
});

webview.src = `${url}?preview`;
webview.className = 'preview';
document.querySelector('.preview-container').prepend(webview);

// Migrate older preferences
if (!overlayVars.padding || overlayVars.fontSize > 14 || overlayVars.gurbaniFontSize > 15) {
  if (typeof overlayVars.padding === 'undefined') {
    overlayVars.padding = 0.5;
  }
  if (overlayVars.fontSize > 14) {
    overlayVars.fontSize = 3;
  }
  if (overlayVars.gurbaniFontSize > 15) {
    overlayVars.gurbaniFontSize = 5;
  }
  savePrefs();
}
