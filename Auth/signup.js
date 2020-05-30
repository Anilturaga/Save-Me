import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Button, TextInput, Title, Text, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';
import { _signup } from '../api.js';
import * as firebase from 'firebase';
import { store } from '../redux/store';
import { Notifications } from 'expo';

class login extends React.Component {
  state = {
    username: '',
    pn: 0,
    progress: new Animated.Value(0),
    error: '',
    contacts: {},
    contactsPn: [722],
    contactsUser: [''],
    contactError: '',
    expoPushToken: '',
  };
  
  componentDidMount() {
    if (this.props.user.username !== '' && this.props.user.pn !== 0) {
      this.props.navigation.navigate('App', { Login: 'true' });
    } else {
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
      }).start();
      //this.registerForPushNotificationsAsync();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.username !== '' && this.props.user.pn !== 0) {
      this.props.navigation.navigate('App', { Login: 'true' });
    }
  }
  setContactsPn = (val, index) => {
    var currentPn = this.state.contactsPn;
    currentPn[index] = val;
    this.setState({ contactsPn: currentPn });
  };
  setContactsUser = (val, index) => {
    var currentUser = this.state.contactsUser;
    currentUser[index] = val;
    this.setState({ contactsUser: currentUser });
  };
  addNewContact = () => {
    if (this.state.contactsPn[this.state.contactsPn.length - 1].length !== 10) {
      this.setState({ contactError: 'Wrong format for phone number' });
    } else {
      this.setState({ contactError: '' });
      var currentUser = this.state.contactsUser;
      var currentPn = this.state.contactsPn;
      currentPn.push(9);
      currentUser.push('');
      this.setState({ contactsUser: currentUser, contactsPn: currentPn });
    }
  };
  submitData = () => {
    console.log(typeof this.state.pn);
    if (this.state.pn.length === 10) {
      if (this.state.contactsPn.length > 0) {
        console.log(this.state.pn);
        var contacts = {};
        this.state.contactsPn.map((val, index) => {
          contacts[val] = this.state.contactsUser[index];
        });
        console.log('Contacts obj', contacts);
        _signup(this.state.pn, this.state.username, contacts);
      } else {
        this.setState({ contactError: 'Emergency contacts required' });
      }
    } else {
      this.setState({ error: 'Wrong format for your phone number' });
    }
  };
  render() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: this.props.colorScheme.backgroundcolor },
        ]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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
              Save
            </Title>
            <Title
              style={[
                { color: this.props.colorScheme.secondarybutton },
                styles.name,
              ]}>
              Me
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
            label="Phone Number"
            keyboardType="numeric"
            value={this.state.pn}
            mode="outlined"
            onChangeText={pn => this.setState({ pn })}
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
            label="Username"
            value={this.state.username}
            mode="outlined"
            onChangeText={username => this.setState({ username })}
          />
          <View style={styles.name}>
            <Title
              style={[
                { color: this.props.colorScheme.primarybutton },
                styles.name,
              ]}>
              {' '}
              Emergency Contacts
            </Title>
          </View>
          <Card
            style={[
              styles.card,
              { backgroundColor: this.props.colorScheme.tabtheme },
            ]}>
            {this.state.contactsPn.map((cPn, index) => (
              <View>
                <Text style={{ paddingLeft: 7,color:this.props.colorScheme.textcolor }}>Contact {index + 1}</Text>
                <TextInput
                  theme={{
                    colors: { primary: this.props.colorScheme.primarybutton },
                  }}
                  style={[
                    styles.contactTextInput,
                    {
                      backgroundColor: 'white',
                      color: this.props.colorScheme.textcolor,
                    },
                  ]}
                  textcolor="white"
                  placeholderTextColor="white"
                  selectionColor="white"
                  underlineColor="white"
                  label="Phone Number"
                  keyboardType="numeric"
                  value={this.state.contactsPn[index]}
                  mode="outlined"
                  onChangeText={pn => this.setContactsPn(pn, index)}
                />

                <TextInput
                  theme={{
                    colors: { primary: this.props.colorScheme.primarybutton },
                  }}
                  style={[
                    styles.contactTextInput,
                    {
                      backgroundColor: 'white',
                      color: this.props.colorScheme.textcolor,
                      paddingBottom: 40,
                    },
                  ]}
                  label="Username"
                  value={this.state.contactsUser[index]}
                  mode="outlined"
                  onChangeText={username =>
                    this.setContactsUser(username, index)
                  }
                />
              </View>
            ))}
            <Text style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              {this.state.contactError}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                mode="contained"
                style={{
                  backgroundColor: this.props.colorScheme.primarybutton,
                  color: this.props.colorScheme.secondarybutton,
                }}
                onPress={() => this.addNewContact()}>
                New Contact
              </Button>
            </View>
          </Card>
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
              if (this.state.pn !== '' && this.state.username !== '') {
                this.setState({ error: '' });
                this.submitData();
              } else {
                this.setState({ error: 'All fields must be filled' });
              }
            }}>
            Sign Up
          </Button>
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
  card: {
    borderRadius: 27,
    margin: 7,
    padding: 27,
    elevation: 4,
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
  contactTextInput: {
    padding: 7,
    width: '100%',
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
