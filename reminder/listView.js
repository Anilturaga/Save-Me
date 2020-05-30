import React from 'react';

import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Divider,
  TouchableRipple,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { dataAction } from '../redux/actions';
import { Notifications } from 'expo';

class ListScreen extends React.Component {
  state = {
    Messages: [],
  };
  shopDataUpdate = data => {
    this.setState({ Messages: data });
  };
  componentDidUpdate(prevProps) {
    if (this.props.medications !== prevProps.medications) {
      const temp = [];
      for (let shop in this.props.medications) {
        if (shop !== 0 && shop !== '0') {
          console.log('shop: ', shop);
          var count = Object.keys(this.props.medications[shop].reminders)
            .length;
          temp.push({
            time: count,
            title: shop,
            message: this.props.medications[shop].message,
          });
        }
      }
      this.shopDataUpdate(temp);
    }
  }
  componentDidMount() {
    console.log('||||||||||||||||||||');
    const temp = [];
    for (let shop in this.props.medications) {
      if (shop !== 0 && shop !== '0') {
        console.log('shop: ', shop);
        var count = Object.keys(this.props.medications[shop].reminders).length;
        temp.push({
          time: count,
          title: shop,
          message: this.props.medications[shop].message,
        });
      }
    }
    this.shopDataUpdate(temp);
  }
  deleteReminder = medication => {
    try{
    //console.log("||||||||||||||",medication,this.props.medications)
    var meds = this.props.medications;    
    Notifications.cancelAllScheduledNotificationsAsync()
    delete meds[medication];
    console.log("meds",meds)
    for (let id in meds) {
      console.log("id",id)
      for(let rem in meds[id].reminders){
        
        var localMessage = {
          to: this.props.user.expoPushToken,
          sound: 'default',
          title: id.replace('_',' '),
          body: 'For ' + id.message,
          data: { data: 'what is data' },
          _displayInForeground: true,
        };
        console.log(id,rem)
        var Rid = Notifications.scheduleLocalNotificationAsync(localMessage, {
          time: parseInt(rem),
          repeat: 'day',
        });
        meds[id][rem] = Rid
      }
    }
    this.props.medication_update(meds);
  }catch(err){
    console.log("//////////////",err)
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
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: '70%' }}>
              <Text
                style={[
                  styles.headtext,
                  { color: this.props.colorScheme.primarybutton },
                ]}>
                Medications
              </Text>
              <Text
                style={[
                  styles.nexttext,
                  { color: this.props.colorScheme.textcolor },
                ]}>
                {' '}
                Reminders Manager{' '}
              </Text>
            </View>
            <View
              style={[
                styles.headtext,
                {
                  width: '30%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <TouchableRipple
                style={styles.touchable}
                onPress={() => this.props.navigation.push('NewReminder')}
                rippleColor={this.props.colorScheme.primarybutton}>
                <Icon
                  style={[{ color: this.props.colorScheme.primarybutton }]}
                  size={35}
                  name={'ios-add-circle'}
                />
              </TouchableRipple>
            </View>
          </View>

          {this.state.Messages.map((user, i) => (
            <Animatable.View animation="fadeInDown">
              <Card
                style={[
                  styles.card,
                  {
                    backgroundColor: this.props.colorScheme.tabtheme,
                    marginTop: 27,
                  },
                ]}>
                <List.Item
                key = {7227+i}
                  style={styles.listItem}
                  titleStyle={[
                    styles.title,
                    {
                      color: this.props.colorScheme.textcolor,
                      fontSize: 20,
                    },
                  ]}
                  title={user.time}
                  description="times a day"
                  descriptionStyle={[
                    styles.subtitle,
                    { color: this.props.colorScheme.textcolor, fontSize: 16 },
                  ]}
                  left={() => (
                    <Ionicons
                      name="ios-clock"
                      size={32}
                      color={this.props.colorScheme.secondarybutton}
                    />
                  )}
                />
                <Divider />

                <List.Item
                key = {i}
                  style={styles.listItem}
                  titleStyle={[
                    styles.title,
                    {
                      color: this.props.colorScheme.textcolor,
                    },
                  ]}
                  title={user.title.replace('_', ' ')}
                  description={user.message}
                  descriptionStyle={[
                    styles.subtitle,
                    { color: this.props.colorScheme.textcolor },
                  ]}
                  left={() => (
                    <Ionicons
                      name="ios-business"
                      size={32}
                      color={this.props.colorScheme.secondarybutton}
                    />
                  )}
                />
                <Card.Actions
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    mode="contained"
                    color="red"
                    onPress={() => {
                      this.deleteReminder(user.title);
                    }}>
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            </Animatable.View>
          ))}
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
  headtext: {
    fontSize: 30,

    paddingLeft: 20,

    paddingTop: 50,
  },
  card: {
    borderRadius: 27,
    margin: 7,
  },
  nexttext: {
    fontSize: 15,

    paddingLeft: 20,

    paddingTop: 5,

    paddingBottom: 15,
  },

  title: {
    fontSize: 24,
    paddingLeft: 7,
  },

  subtitle: {
    fontSize: 20,
  },
});
const mapDispatchToProps = dispatch => {
  return {
    medication_update: medication => dispatch(dataAction(medication)),
  };
};

const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
  medications: state.medications,
});
export default connect(
  mapStoretoProps,
  mapDispatchToProps
)(ListScreen);
