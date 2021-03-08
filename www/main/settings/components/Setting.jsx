import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { Switch, Checkbox } from '../../common/sttm-ui';
import { convertKeyToLegacySettingsObjKey } from '../../common/utils';

const { remote } = require('electron');

const { i18n, store } = remote.require('./app');

const Setting = ({ settingObj, stateVar, stateFunction }) => {
  const { title } = settingObj;
  const type = settingObj.type;
  const userSettings = useStoreState(state => state.userSettings);
  const userSettingsActions = useStoreActions(state => state.userSettings);

  const handleInputChange = event => {
    const value = event.target ? event.target.value : event;
    userSettingsActions[stateFunction](value);
    console.log(stateVar);
    store.setUserPref(convertKeyToLegacySettingsObjKey(stateVar), value);
    global.core.platformMethod('updateSettings');
  };

  const handleCheckboxChange = event => {
    const value = event.target.checked;
    userSettingsActions[stateFunction](value);
    console.log(userSettings);
    store.setUserPref(convertKeyToLegacySettingsObjKey(stateVar), value);
    global.core.platformMethod('updateSettings');
  };

  let settingDOM;

  switch (type) {
    case 'range':
      settingDOM = (
        <input
          type="range"
          data-value={userSettings[stateVar]}
          value={userSettings[stateVar]}
          min={settingObj.min}
          max={settingObj.max}
          step={settingObj.step}
          onChange={handleInputChange}
        ></input>
      );
      break;
    case 'dropdown':
      settingDOM = (
        <select value={userSettings[stateVar]} onChange={handleInputChange}>
          {Object.keys(settingObj.options).map((op, opIndex) => (
            <option key={`control-dropdown-options-${opIndex}`} value={op}>
              {i18n.t(`SETTINGS.${settingObj.options[op]}`)}
            </option>
          ))}
        </select>
      );
      break;
    case 'switch':
      settingDOM = (
        <Switch
          controlId={`${title}-switch`}
          className={`control-item-switch-${title}`}
          value={userSettings[stateVar]}
          onToggle={handleInputChange}
        />
      );
      break;
    case 'checkbox':
      settingDOM = (
        <Checkbox
          id={`${title}-checkbox`}
          name={`control-item-checkbox-${title}`}
          handler={handleCheckboxChange}
          checked={userSettings[stateVar]}
        />
      );
      break;
    default:
      return null;
  }

  return settingDOM;
};

Setting.propTypes = {
  settingObj: PropTypes.object,
  stateVar: PropTypes.string,
  stateFunction: PropTypes.string,
};

export default Setting;
