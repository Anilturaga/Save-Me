import { combineReducers } from 'redux';

import {
  UPDATE_THEME,
  USER,
  DATA_DOWNLOAD,
  PRODUCTS_LIST,
  LOG_OUT,
  ANALYTICS,
} from './actions';

const merge = (prev, next) => Object.assign({}, prev, next);

const createUserReducer = (
  state = {
    username: '',
    pn: 0,
    contacts: {},
    panic: false,
    geofence: false,
    error: '',
    expoPushToken: '',
    
  },
  action
) => {
  switch (action.type) {
    case USER:
      var temp = merge(state, action.payload);
      console.log(
        'temp',
        temp,
        'action',
        action.payload,
        'merge',
        merge(state, temp)
      );
      return merge(state, temp);
    case LOG_OUT:
      return {
        username: '',
        pn: 0,
        contacts: {},
        panic: false,
        geofence: false,
        error: '',
        expoPushToken: '',
      };
    default:
      //console.log('Def', state);
      return state;
  }
};
const themeReducer = (
  state = {
    tabtheme: '#eee',
    backgroundcolor: 'white',
    textcolor: 'black',
    primarybutton: '#FF5454',
    secondarybutton: '#5FDAFF',
  },
  action
) => {
  switch (action.type) {
    case UPDATE_THEME:
      if (action.payload.tabtheme === '#202020') {
        action.payload = {
          tabtheme: '#eee',
          backgroundcolor: 'white',
          textcolor: 'black',
          primarybutton: '#FF5454',
          secondarybutton: '#5FDAFF',
        };
      } else {
        action.payload = {
          tabtheme: '#202020',
          backgroundcolor: 'black',
          textcolor: 'white',
          primarybutton: '#FF5454',
          secondarybutton: '#5FDAFF',
        };
      }
      return merge(state, action.payload);
    default:
      return state;
  }
};
const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case DATA_DOWNLOAD:
      return merge(state, action.payload);
    case LOG_OUT:
      return {};
    default:
      return state;
  }
};
function reducer(state = {}, action) {
  return {
    colorScheme: themeReducer(state.colorScheme, action),
    user: createUserReducer(state.user, action),
    medications: dataReducer(state.medications, action),
  };
}

export default reducer;
