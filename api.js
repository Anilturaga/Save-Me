/*
import * as firebase from "@firebase/app";

// Add the Firebase services that you want to use
import "@firebase/auth";
import "@firebase/database";
*/
//import * as firebase from 'firebase';
import firebase from "firebase/app"
import "firebase/database";
import * as TaskManager from 'expo-task-manager';
const GEO_FENCING = 'geo-fencing';
import * as Location from 'expo-location';
import { Notifications } from 'expo';

import {
  userAction,
  dataAction,
  productsAction,
  logoutAction,
  analyticsAction,
} from './redux/actions.js';
import { store } from './redux/store.js';

//import firestore from '@react-native-firebase/firestore';
// Initialize Firebase
var firebaseConfig = {
//Put your own project config
};
try {
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  //console.log('working till db');
  var db = firebase.database();
  console.log('initialized db:', db);
  //_loadLogin();
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    //console.error('Firebase initialization error', err.stack);
  }
}
/*
export const _loadLogin = () => {
  firebase
    .auth()
    .signInAnonymously()
    .catch(err => {
      console.log('Error getting documents', err);
    });
};
*/
TaskManager.defineTask(
  GEO_FENCING,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      // check `error.message` for more details.
      console.log('TaskManager error stack', error);
      return false;
    }
    var time = new Date().getTime() + 272;
    var title, body, ptitle, pbody;
    if (eventType === Location.GeofencingEventType.Enter) {
      console.warn("You've entered region:", region);
      //alert('You just crossed the green zone.');
      title = 'Back in green zone';
      ptitle = store.getState().user.username + ' is back in green zone';
      body = 'Geofencing is still active with radius ' + region.radius;
      _localNotifications(title, body, time);
      _pushNotifications(ptitle, body, time);
      return 2;
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.warn("You've left region:", region);
      //alert('You just crossed the green zone.');
      title = 'Crossed the green zone';
      ptitle = store.getState().user.username + ' is outside the green zone';
      body = 'Geofencing is still active with radius ' + region.radius;
      _localNotifications(title, body, time);
      _pushNotifications(ptitle, body, time);
      return 7;
    }
  }
);
export const _localNotifications = (title, body, time) => {
  const localMessage = {
    to: store.getState().user.expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { data: 'what is data' },
    _displayInForeground: true,
  };
  Notifications.scheduleLocalNotificationAsync(localMessage, {
    time: time,
  });
};
export const _pushNotifications = async (title, body, time) => {
  if (typeof variable === 'undefined') {
    var db = firebase.database();
  }
  var contacts = store.getState().user.contacts;
  console.log(contacts);
  var tokenArray = [];
  for (let pns in contacts) {
    console.log(pns);
    db.ref('/' + pns)
      .once('value')
      .then(function(snapshot) {
        if (snapshot.val()) {
          console.log('hit', snapshot.val().expoPushToken);
          var message = {
            to: snapshot.val().expoPushToken,
            sound: 'default',
            title: title,
            body: body,
            data: { data: 'goes here' },
            _displayInForeground: true,
          };
          tokenArray.push(message);
          pushEach(message);
          console.log('loop', tokenArray);
        }
      });
  }
  console.log('Array', tokenArray);
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tokenArray),
  });
};
const pushEach = async message => {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};
export const _login = (username, password) => {
  if (typeof variable === 'undefined') {
    var db = firebase.database();
  }
  console.log('db: ', db);
  db.ref('/' + username)
    .once('value')
    .then(function(snapshot) {
      console.log('snapshot1: ', snapshot);
      if (snapshot.val()) {
        if (snapshot.val().password === password) {
          console.log('if');
          store.dispatch(
            userAction({
              username: username,
              password: password,
              error: '',
            })
          );
          store.dispatch(userAction(snapshot.val()));
        } else {
          console.log('pass wrong');
          store.dispatch(
            userAction({
              username: '',
              password: '',
              error: 'Wrong password',
            })
          );
        }
      } else {
        console.log('u dont');
        store.dispatch(
          userAction({
            username: '',
            password: '',
            error: 'Username does not exist',
          })
        );
      }
      console.log('snapshot2: ', snapshot.val());
      //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
      // ...
    });
  console.log;
};

export const _signup = (pn, username, contacts) => {
  if (typeof variable === 'undefined') {
    var db = firebase.database();
  }
  try {
    console.log('Store from signup ', store);
    console.log('getState', store.getState());
    console.log('getState', store.getState().user);
  } catch (err) {
    console.log(err);
  }
  var data = {
    username: username,
    contacts: contacts,
    panic: false,
    geofence: false,
    expoPushToken: '',
  };
  db.ref('/' + pn)
    .once('value')
    .then(function(snapshot) {
      if (snapshot.val()) {
        store.dispatch(userAction({ error: 'Account already exists' }));
      } else {
        store.dispatch(userAction(data));
        store.dispatch(userAction({ pn, error: '' }));
        firebase
          .database()
          .ref('/' + pn)
          .set(data);
      }
    });
};
export const _setToken = token => {
  console.log(store);
  var storeCopy = store.getState();
  store.dispatch(userAction({ expoPushToken: token }));
  console.log('Token for firebase', token, storeCopy.user.pn);
  db.ref('/' + storeCopy.user.pn)
    .once('value')
    .then(function(snapshot) {
      var obj = snapshot.val();
      obj['expoPushToken'] = token;
      firebase
        .database()
        .ref('/' + storeCopy.user.pn)
        .set(obj);
    });
};
export const _setGeo = status => {
  console.log(store);
  var storeCopy = store.getState();
  store.dispatch(userAction({ geofence: status }));
  console.log('Token for firebase', status, storeCopy.user.pn);
  firebase
    .database()
    .ref('/' + storeCopy.user.pn)
    .set({ geofence: status });
};
export const _logout = (username, password) => {
  console.log('Logout func called in api and calling store dispatch');
  var copy = store.getState();
firebase
    .database()
    .ref('/' + copy.user.pn)
    .remove();
  store.dispatch(logoutAction(store.getState()));
  console.log('logout func state reset: ', store.getState());
};
/*
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('User is signed in');
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    store.dispatch(userAction({ userID: uid }));
    console.log('Auth state in api.js', store.getState());

    // ...
  } else {
    store.dispatch(userAction({ userID: '' }));
    console.log('User is signed out');
    // User is signed out.
    // ...
  }
  // ...
});
*/
