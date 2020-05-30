import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createSwitchNavigator, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { FAB, Portal } from 'react-native-paper';
import LoginScreen from './Auth/login.js';
import SignupScreen from './Auth/signup.js';
import Panic from './SaveMe/panic.js';
import Geoloc from './SaveMe/geolocation.js';
import PanicScreen from './SaveMe/PanicScreen.js';
import ListViewScreen from './reminder/listView.js';
import SettingsScreen from './settings/settings.js';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import NewScreen from './reminder/new.js';
// Before rendering any navigation stack
import { enableScreens } from 'react-native-screens';
enableScreens();
var red = store.getState().colorScheme.primarybutton;
var blue = store.getState().colorScheme.secondarybutton;
var backgroundcolor = store.getState().colorScheme.backgroundcolor;
var tabtheme = store.getState().colorScheme.tabtheme;
var textcolor = store.getState().colorScheme.textcolor;

function handleChange() {
  red = store.getState().colorScheme.primarybutton;
  blue = store.getState().colorScheme.secondarybutton;
  backgroundcolor = store.getState().colorScheme.backgroundcolor;
  tabtheme = store.getState().colorScheme.tabtheme;
  textcolor = store.getState().colorScheme.textcolor;
}
const subscribe = store.subscribe(handleChange);
subscribe();
class ScreenComponentOne extends React.Component {
  static navigationOptions = {
    title: 'some string title',
  };
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 27, backgroundColor: 'black' }}>
        <Text>One</Text>
        <Button
          title="Stack a screen"
          onPress={() => {
            this.props.navigation.navigate('addReminder');
          }}
        />
      </View>
    );
  }
}
class ScreenComponentTwo extends React.Component {
  static navigationOptions = {
    title: 'some string title',
  };
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 27, backgroundColor: 'black' }}>
        <Text>Two</Text>
        <Button
          title="Go Back"
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
      </View>
    );
  }
}
class Tabes extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, paddingTop: 27, backgroundColor: 'black' }}>
        <Text>tabs</Text>
        <Button
          raised
          theme={{ roundness: 3 }}
          title={red}
          onPress={() => {
            this.props.navigation.navigate(
              'SaveMe',
              {},
              NavigationActions.navigate({ routeName: 'addReminder' })
            );
          }}
        />
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    ListView: ListViewScreen,
    NewReminder: NewScreen,
  },
  {
    initialRouteName: 'ListView',
    /* The header config from HomeScreen is now here */
    headerMode: 'none',
  }
);
const PanicSwitcher = createSwitchNavigator(
  {
    Panic: Panic,
    PanicScreen: PanicScreen,
    //Auth: AuthStack,
  },
  {
    initialRouteName: 'Panic',
  }
);

const topNav = createMaterialTopTabNavigator(
  {
    panicbutton: {
      screen: PanicSwitcher,
      navigationOptions: {
        tabBarLabel: 'Save Me',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-heart-half'}
            />
          </View>
        ),
      },
    },
    location: {
      screen: Geoloc,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-compass'}
            />
          </View>
        ),
      },
    },
  },
  {
    //pagerComponent: ViewPagerAdapter,
    initialRouteName: 'panicbutton',
    swipeEnabled: true,
    lazy: true,
    defaultNavigationOptions: {
      tabBarVisible: false,
    },
    style: {
      paddingTop: Constants.statusBarHeight,
      backgroundColor: backgroundcolor,
    },
  }
);

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-settings'}
            />
          </View>
        ),
      },
    },
    SaveMe: {
      screen: topNav,

      navigationOptions: {
        tabBarLabel: 'Save Me',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-pulse'} />
          </View>
        ),
        /*activeColor: '#f60c0d',
        inactiveColor: '#f65a22',
        barStyle: { backgroundColor: '#f69b31' },*/
      },
    },
    Reminder: {
      screen: AppNavigator,
      navigationOptions: {
        tabBarLabel: 'Reminders',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-list-box'}
            />
          </View>
        ),
      },
    },
  },
  {
    initialRouteName: 'SaveMe',
    activeColor: red,
    inactiveColor: blue,
    barStyle: { backgroundColor: tabtheme },
    shifting: true,
  }
);

let TabContainer = connect(state => ({
  colorScheme: state.colorScheme,
  user: state.user,
}))(TabNavigator);
const loginSwitcher = createSwitchNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    App: TabContainer,
    PanicScreen: PanicScreen,
    //Auth: AuthStack,
  },
  {
    initialRouteName: 'Signup',
  }
);
const AppContainer = createAppContainer(loginSwitcher);
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}
