import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  CardItem,
} from 'react-native';

import { connect } from 'react-redux';
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import Constants from 'expo-constants';
import { _logout } from '../api.js';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Divider,
} from 'react-native-paper';
import { themeFunction } from '../redux/actions';

class Settings extends React.Component {
  updateData = () => {
    if (this.props.user.userType !== 'F') {
      this.props.navigation.navigate('Loading', { Login: true });
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
          style={{ backgroundColor: this.props.colorScheme.backgroundcolor }}>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              paddingTop: '7%',
            }}>
            <Text
              style={[
                styles.headtext,
                { color: this.props.colorScheme.primarybutton },
              ]}>
              Settings
            </Text>
            <Text
              style={[
                styles.nexttext,
                { color: this.props.colorScheme.textcolor },
              ]}>
              {' '}
              Account information{' '}
            </Text>
          </View>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: this.props.colorScheme.tabtheme,
              },
            ]}>
            <List.Section>
              <List.Subheader style={[styles.insidecard,{color:this.props.colorScheme.textcolor}]}>
                Login and Security
              </List.Subheader>
              <List.Item
                style={styles.listItem}
                titleStyle={{
                  color: this.props.colorScheme.textcolor,
                  paddingLeft: 7,
                }}
                title={'Username: ' + this.props.user.username}
                left={() => (
                  <Ionicons
                    name="ios-person"
                    size={32}
                    color={this.props.colorScheme.secondarybutton}
                  />
                )}
              />
              <Divider />

              <List.Item
                style={styles.listItem}
                titleStyle={{
                  color: this.props.colorScheme.textcolor,
                  paddingLeft: 7,
                }}
                title={'Phone number: '+this.props.user.pn}
                left={() => (
                  <Ionicons
                    name="ios-key"
                    size={32}
                    color={this.props.colorScheme.secondarybutton}
                  />
                )}
              />

              <Divider />
              <List.Item
                style={styles.listItem}
                titleStyle={{
                  color: this.props.colorScheme.textcolor,
                  paddingLeft: 7,
                }}
                onPress={() =>
                  this.props.UPDATE_THEME({
                    tabtheme: this.props.colorScheme.tabtheme,
                  })
                }
                title="Theme"
                left={() => (
                  <Ionicons
                    name="ios-brush"
                    size={32}
                    color={this.props.colorScheme.secondarybutton}
                  />
                )}
              />
            </List.Section>
          </Card>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: this.props.colorScheme.tabtheme,
                marginTop: 27,
              },
            ]}>
            <List.Item
              style={[
                styles.listItem,
                {
                  backgroundColor: '#E74C3C',
                  borderRadius: 27,
                },
              ]}
              titleStyle={{ color: 'white', paddingLeft: 7 }}
              left={() => <Ionicons name="ios-power" size={32} color="white" />}
              title="Sign out"
              onPress={() => {
                _logout();
                this.props.navigation.navigate('Signup');
              }}
            />
          </Card>
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
  card: {
    borderRadius: 27,
    margin: 7,
  },
  listItem: {
    padding: 27,
  },
  insidecard: {
    fontSize: 12,

    paddingLeft: 32,

    color: 'grey',
  },

  headtext: {
    fontSize: 30,
    alignSelf: 'center',
  },
  nexttext: {
    fontSize: 15,
    paddingBottom: 15,
    alignSelf: 'center',
  },

  title: {
    fontSize: 20,

    color: '#3F3F3F',
  },
});
const mapDispatchToProps = dispatch => {
  return {
    UPDATE_THEME: tabtheme => dispatch(themeFunction(tabtheme)),
  };
};
const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
});
export default connect(
  mapStoretoProps,
  mapDispatchToProps
)(Settings);
