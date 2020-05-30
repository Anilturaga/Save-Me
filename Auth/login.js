import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Button, TextInput, Title, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';
import { _login } from '../api.js';
import * as firebase from 'firebase';
import { store } from '../redux/store';

class login extends React.Component {
  state = {
    username: '',
    password: '',
    progress: new Animated.Value(0),
    error: '',
  };
  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  }
  componentDidUpdate(prevProps) {
    if (this.props.user.username !== '' && this.props.user.password !== '') {
      this.props.navigation.navigate('App');
    }
  }
  render() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: this.props.colorScheme.backgroundcolor },
        ]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <KeyboardAvoidingView behavior="position" enabled>
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
            <View style={styles.name}>
              <Title
                style={[
                  { color: this.props.colorScheme.primarybutton },
                  styles.name,
                ]}>
                {' '}
                In
              </Title>
              <Title
                style={[
                  { color: this.props.colorScheme.secondarybutton },
                  styles.name,
                ]}>
                Man
              </Title>
            </View>
            <Text style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              {this.state.error + this.props.user.error}
            </Text>
            <TextInput
              theme={{
                colors: { primary: this.props.colorScheme.primarybutton },
              }}
              style={[
                styles.textinput,
                {
                  backgroundColor: 'white',
                  color: this.props.colorScheme.textcolor,
                },
              ]}
              textcolor="white"
              placeholderTextColor="white"
              selectionColor="white"
              underlineColor="white"
              label="Username"
              value={this.state.username}
              mode="outlined"
              onChangeText={username => this.setState({ username })}
            />
            <TextInput
              theme={{
                colors: { primary: this.props.colorScheme.primarybutton },
              }}
              style={[
                styles.textinput,
                {
                  backgroundColor: 'white',
                  color: this.props.colorScheme.textcolor,
                },
              ]}
              label="Password"
              secureTextEntry={true}
              value={this.state.password}
              mode="outlined"
              onChangeText={password => this.setState({ password })}
            />
            <Button
              style={[
                styles.button,
                {
                  backgroundColor: this.props.colorScheme.secondarybutton,
                  color: this.props.colorScheme.primarybutton,
                },
              ]}
              mode="contained"
              onPress={() => {
                console.log('Pressed');
                if (this.state.username !== '' && this.state.password !== '') {
                  this.setState({ error: '' });
                  _login(this.state.username, this.state.password);
                } else {
                  this.setState({ error: 'All fields must be filled' });
                }
              }}>
              Login
            </Button>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  icon: {
    height: 150,
    width: '100%',
    alignSelf: 'center',
  },
  name: {
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  textinput: {
    padding: 7,
    width: Dimensions.get('window').width,
  },
  button: {
    alignSelf: 'center',
    padding: 7,
  },
});

const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
});
export default connect(mapStoretoProps)(login);
