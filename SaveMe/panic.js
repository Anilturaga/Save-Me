import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Vibration,
  Animated,
  Easing,
  Platform,
} from 'react-native';
  import { Button, TouchableRipple} from 'react-native-paper';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import * as Permissions from 'expo-permissions';
import { _pushNotifications, _localNotifications } from '../api.js';
import { _setToken } from '../api.js';
import Icon from 'react-native-vector-icons/Ionicons';

class Panic extends React.Component {
  state = {
    notification: {},
    progress: new Animated.Value(0),
    cancelButtonState: false,
    expoPushToken: '',
  };
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      var token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
      _setToken(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log('I have a notification', notification);
    this.setState({ notification: notification });
  };
  PanicButton = () => {
    //this.navigation.navigate('PanicScreen');
    //this.props.navigation.popToTop()
    var time = new Date().getTime();
    var title = this.props.user.username + ' needs HELP!';
    var body = this.props.user.pn + ' is in danger';
    _localNotifications(
      'Help requested!',
      'Notifying all your emergency contacts',
      time
    );
    _pushNotifications(title, body, time);

    this.setState({ cancelButtonState: true });
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
    //this.props.navigation.navigate('PanicScreen');
  };
  cancelButton = () => {
    //this.navigation.navigate('PanicScreen');
    //this.props.navigation.popToTop()
    var time = new Date().getTime();
    var title = this.props.user.username + ' is now SAFE!';
    var body = this.props.user.pn + ' cancelled panic';
    _localNotifications(
      'Declaring safety',
      'Notifying all your emergency contacts',
      time
    );
    _pushNotifications(title, body, time);
    this.setState({
      cancelButtonState: false,
      progress: new Animated.Value(0),
    });
    //this.props.navigation.navigate('PanicScreen');
    console.log('State', this.state.cancelButtonState);
  };

  render() {
    console.log(this.state.cancelButtonState);
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.props.colorScheme.backgroundcolor },
        ]}>
          <TouchableRipple
              style={styles.side}
              onPress={() => this.props.navigation.navigate('location')}
              rippleColor={this.props.colorScheme.secondarybutton}>
              <Icon
                style={[{ color: this.props.colorScheme.secondarybutton }]}
                size={50}
                name={'ios-arrow-dropright-circle'}
              />
            </TouchableRipple>
        <TouchableOpacity
          style={{ width: '72%', height: '72%' }}
          onPress={() => this.PanicButton()}>
          <LottieView
            style={[
              styles.icon,
              {
                backgroundColor: this.props.colorScheme.backgroundcolor,
              },
            ]}
            source={require('../assets/SaveMeAnim.json')}
            progress={this.state.progress}
          />
        </TouchableOpacity>
        {this.state.cancelButtonState && (
          <Button
            mode="contained"
            style={{
              backgroundColor: this.props.colorScheme.secondarybutton,
              color: this.props.colorScheme.primarybutton,
            }}
            onPress={() => {
              this.cancelButton();
            }}>
            Cancel Panic
          </Button>
        )}
      </View>
    );
  }
}
const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
});
export default connect(mapStoretoProps)(Panic);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  side:{
    position: 'absolute',
    right: 0,
    height: '100%',
    padding:7
  }
});
