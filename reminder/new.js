/*import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Picker,
  TextInput,
} from 'react-native';
import { Button, Title, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';
import Constants from 'expo-constants';

class ScreenComponentTwo extends React.Component {
  static navigationOptions = {
    title: 'some string title 2',
  };
  constructor(props) {
    super(props);
    this.state = { idk: '', selectedValue: 'ADMIRE' };
  }
  setSelectedValue = val => {
    console.log('new val: ', val);
    this.setState({ selectedValue: val });
  };

  render() {
    const products = [];
    console.log('Products from fs: ', this.props.products);
    for (let i in this.props.products) {
      products.push(i);
      console.log('product:', i);
    }
    console.log('selectedvalue: ', this.state.selectedValue);
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: this.props.colorScheme.backgroundcolor },
        ]}>
        <ScrollView
          style={{
            backgroundColor: this.props.colorScheme.backgroundcolor,
            flexDirection: 'column',
          }}>
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
              {this.props.navigation.getParam('retailName', 'Retail shop name')}
            </Text>
          </View>

          <View style={{ flexDirection: 'column', width: '100%' }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ width: '70%' }}>
                <Picker
                  selectedValue={this.state.selectedValue}
                  style={{ width: '100%' }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setSelectedValue(itemValue)
                  }
                  mode="dialog">
                  {products.map(product => (
                    <Picker.Item label={product} value={product} />
                  ))}
                </Picker>
              </View>
              <View style={{ width: '30%' }}>
                <TextInput
                  style={{ width: '100%', borderColor: 'gray', borderWidth: 1 }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
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
    alignSelf: 'center',
    textAlign: 'center',
  },
});
const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
  products: state.products,
});
export default connect(mapStoretoProps)(ScreenComponentTwo);
*/

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Picker,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Button,
  Title,
  Text,
  Card,
  TouchableRipple,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
//import { _shopDataUpload } from '../api';
import { KeyboardAvoidingView } from 'react-native';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import { dataAction } from '../redux/actions';

const _shopDataUpload = (a, b, c, d) => {
  console.log('_shopDataUpload');
};
class ScreenComponentTwo extends React.Component {
  static navigationOptions = {
    title: 'some string title 2',
  };
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
      remindersTime: [],
      ids: [],
      hours: [],
      minutes: [],
      error: '',
      show: false,
      mode: 'time',
      date: new Date(),
    };
  }
  sendData = () => {
    const localMessage = {
      to: this.props.user.expoPushToken,
      sound: 'default',
      title: this.state.title,
      body: 'For ' + this.state.message,
      data: { data: 'what is data' },
      _displayInForeground: true,
    };
    var obj = {};
    this.state.remindersTime.map(each => {
      var id = Notifications.scheduleLocalNotificationAsync(localMessage, {
        time: each,
        repeat: 'day',
      });
      console.log(id)
      obj[each] = id;
    });
    console.log("remin",obj,this.state.remindersTime)
    var tim = this.state.title.replace(' ', '_');
    var submit = {};
    (submit[tim] = {
      message: this.state.message,
      reminders: obj,
    }),
      this.props.medication_update(submit);
  };
  componentDidMount() {
    /*
    var temp = JSON.stringify(
      this.props.navigation.getParam('medicineName', 'Medicine')
    );
    temp = temp.replace(/"/g, '');
    this.stateSetter(
      temp,
      this.props.medications[temp].message,
      this.props.medications[temp].reminders
    );
    var retail = this.props.medications[temp];*/
    console.log('mount');
  }
  deleteReminder = index => {
    var r = this.state.remindersTime;
    var h = this.state.hours;
    var m = this.state.minutes;
    r.splice(index, 1);
    h.splice(index, 1);
    m.splice(index, 1);
    this.setState({ remindersTime: r, hours: h, minutes: m });
  };
  displayTimePicker = () => {
    this.setState({ show: true });
  };

  onChange = (event, selectedDate) => {
    console.log('onChange', event, selectedDate);
    const currentDate = selectedDate || this.state.date;
    console.log('currentData', currentDate);
    this.setState({ show: false, date: currentDate });
    var dateUTC = new Date(currentDate);
    dateUTC = dateUTC.getTime();
    var dateIST = new Date(dateUTC);
    //date shifting for IST timezone (+5 hours and 30 minutes)
    //dateIST.setHours(dateIST.getHours() + 5);
    //dateIST.setMinutes(dateIST.getMinutes() + 30);
    var r = this.state.remindersTime;
    var h = this.state.hours;
    var m = this.state.minutes;
    r.push(dateIST.getTime());
    h.push(dateIST.getHours());
    m.push(dateIST.getMinutes());
    this.setState({ remindersTime: r, hours: h, minutes: m });
  };
  render() {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: this.props.colorScheme.backgroundcolor },
        ]}>
        <ScrollView
          style={{
            backgroundColor: this.props.colorScheme.backgroundcolor,
            flexDirection: 'column',
          }}>
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
              New medication reminder
            </Text>
          </View>
          <Text style={{ color: 'red', width: '100%', textAlign: 'center' }}>
            {this.state.error}
          </Text>
          <Card
            style={[
              styles.card,
              {
                backgroundColor: this.props.colorScheme.tabtheme,
                marginTop: 27,
                marginBottom: 27,
              },
            ]}>
            <TextInput
              theme={{
                colors: { primary: this.props.colorScheme.primarybutton },
              }}
              style={{
                backgroundColor: 'white',
                color: this.props.colorScheme.textcolor,
              }}
              label="Medication name(Unique)"
              value={this.state.title}
              mode="outlined"
              onChangeText={title => this.setState({ title })}
            />
            <TextInput
              theme={{
                colors: { primary: this.props.colorScheme.primarybutton },
              }}
              style={{
                backgroundColor: 'white',
                color: this.props.colorScheme.textcolor,
              }}
              label="Cures/controles"
              value={this.state.message}
              mode="outlined"
              onChangeText={message => this.setState({ message })}
            />
          </Card>
          <Card
            style={[
              styles.card,
              { backgroundColor: this.props.colorScheme.tabtheme },
            ]}>
            <Text style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              {this.state.error}
            </Text>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              {this.state.hours.map((hour, index) => (
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Text
                    style={[
                      styles.smalltext,
                      {
                        width: '67%',
                        color: this.props.colorScheme.textcolor,
                      },
                    ]}>
                    {hour + ':' + this.state.minutes[index]}
                  </Text>
                  <TouchableRipple
                    style={styles.touchableSmall}
                    onPress={() => this.deleteReminder(index)}
                    rippleColor="red">
                    <Icon
                      style={[{ color: 'red' }]}
                      size={27}
                      name={'ios-close-circle-outline'}
                    />
                  </TouchableRipple>
                </View>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 27,
              }}>
              <Button
                mode="contained"
                style={{
                  backgroundColor: this.props.colorScheme.primarybutton,
                  color: this.props.colorScheme.secondarybutton,
                }}
                onPress={() => this.displayTimePicker()}>
                New reminder
              </Button>
            </View>
          </Card>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 27,
            }}>
            <TouchableRipple
              style={styles.touchable}
              onPress={() => this.props.navigation.goBack()}
              rippleColor={this.props.colorScheme.primarybutton}>
              <Icon
                style={[{ color: this.props.colorScheme.primarybutton }]}
                size={50}
                name={'ios-trash'}
              />
            </TouchableRipple>
            <TouchableRipple
              style={styles.touchable}
              onPress={() => {
                this.sendData();
                this.props.navigation.goBack();
              }}
              rippleColor={this.props.colorScheme.primarybutton}>
              <Icon
                style={[{ color: this.props.colorScheme.primarybutton }]}
                size={50}
                name={'ios-save'}
              />
            </TouchableRipple>
          </View>
        </ScrollView>

        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              this.onChange(event, selectedDate);
            }}
          />
        )}
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
    alignSelf: 'center',
    textAlign: 'center',
  },
  smalltext: {
    fontSize: 20,
  },
  card: {
    borderRadius: 27,
    margin: 7,
    padding: 27,
    elevation: 4,
  },
  touchable: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  touchableSmall: {
    width: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
});
export default connect(
  mapStoretoProps,
  mapDispatchToProps
)(ScreenComponentTwo);
