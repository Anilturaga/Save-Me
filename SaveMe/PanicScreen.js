/*import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { Camera } from 'expo-camera';
import { connect } from 'react-redux';

import * as Permissions from 'expo-permissions';

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

class PanicScreen extends React.Component {
  state = {
    hasPermission: null,

    cameraType: Camera.Constants.Type.front,

    touchableHighlightMouseDown: false,
    audio: 'ios-mic',
    location: 'ios-pin',
    loccolor: '#1ABC9C',
    audiocolor: '#1ABC9C',
  };

  async componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    // Camera roll Permission

    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

    // Camera Permission

    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasPermission: status === 'granted' });
  };

  handleCameraType = () => {
    const { cameraType } = this.state;

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  pickImage = async () => {
    if (this.state.location === 'ios-pin') {
      this.setState({
        location: 'ios-airplane',
        loccolor: this.props.colorScheme.primarybutton,
      });
    } else {
      this.setState({
        location: 'ios-pin',
        loccolor: this.props.colorScheme.secondarybutton,
      });
    }
  };

  takePicture = async () => {
    if (this.state.audio === 'ios-mic') {
      this.setState({
        audio: 'ios-mic-off',
        audiocolor: this.props.colorScheme.primarybutton,
      });
    } else {
      this.setState({
        audio: 'ios-mic',
        audiocolor: this.props.colorScheme.secondarybutton,
      });
    }
  };

  render() {
    const { hasPermission } = this.state;

    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: this.props.colorScheme.backgroundcolor,
          }}>
          <Camera
            style={{ flex: 1.5,borderRadius: 27, overflow: 'hidden' }}
            type={this.state.cameraType}
            ref={ref => {
              this.camera = ref;
            }}
          />

          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View
              style={{
                flex: 1.5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'baseline',
                paddingTop: '7%',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',

                  alignItems: 'center',
                }}
                onPress={() => this.pickImage()}>
                <Ionicons
                  name={this.state.location}
                  style={{ fontSize: 40 }}
                  color={this.state.loccolor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',

                  alignItems: 'center',
                }}
                onPress={() => this.takePicture()}>
                <Ionicons
                  name={this.state.audio}
                  style={{ fontSize: 40 }}
                  color={this.state.audiocolor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',

                  alignItems: 'center',
                }}
                onPress={() => this.handleCameraType()}>
                <Ionicons
                  name="md-reverse-camera"
                  style={{ fontSize: 40 }}
                  color={this.props.colorScheme.secondarybutton}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1.5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'baseline',
                paddingBottom: '10%',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', alignItems: 'center' }}
                onPress={() => this.props.navigation.navigate('Panic')}

                //onShowUnderlay={()=>this.setState({touchableHighlightMouseDown:true})}

                //onHideUnderlay={()=>this.setState({touchableHighlightMouseDown:false})}

                //onPress={()=>this.setState({touchableHighlightMouseDown:true})}
              >
                <Ionicons
                  name="ios-close-circle"
                  style={{ fontSize: 80 }}
                  color={this.props.colorScheme.primarybutton}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}

const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
});
export default connect(mapStoretoProps)(PanicScreen);
*/

import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  CardItem,
} from 'react-native';

import { ListItem } from 'react-native-elements';

import { Ionicons, FontAwesome, MaterialIcons ,AntDesign } from '@expo/vector-icons';

import { Card } from 'react-native-elements';

/*

const shuffleArray = array =>

  array

    .map(a => ({ sort: Math.random(), value: a }))

    .sort((a, b) => a.sort - b.sort)

    .map(a => a.value)

*/

export const Messages = [
  {
    title: 'UserName',

    icon: 'user',
  },

  {
    title: 'Phone Number',

    icon: 'phone',
  },

  {
    time: '4:00 PM',

    title: 'Email',

    message: 'Will catch up with you later.',

    icon: 'email',
  },

  {
    time: '4:00 PM',

    title: 'Password',

    message: 'Probably not going to work out :(',

    icon: 'lock',

    icon2: 'alarm',
  },

];

export const Data = [
  {
    title: 'location',

    icon: 'location-on',
  },

  {
    title: 'Apps and sessions',

    icon: 'apps',
  },
  {
    time: '4:00 PM',

    title: 'Fitbit',

    message: 'Will catch up with you later.',

    icon: 'watch',
  },

  {
    time: '4:00 PM',

    title: 'Camera',

    icon: 'camera',
  },

];

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#202020' }}>
        <ScrollView style={{ backgroundColor: '#202020' }}>
          <View>
            <Text style={[styles.headtext, { color: '#E74C3C' }]}>
              Settings
            </Text>

            <Text style={[styles.nexttext, { color: 'white' }]}>
              {' '}
              Account Information{' '}
            </Text>
          </View>

          <Card containerStyle={{ borderRadius: 27, backgroundColor: 'black' }}>
            <View>
              <Text style={styles.insidecard}> Login And Security</Text>
            </View>

            {Messages.map((user, i) => (
              <ListItem
                containerStyle={{ backgroundColor: 'black', color: 'white' }}
                leftIcon={{ name: user.icon, color: '#1ABC9C' }}
                key={i}
                title={user.title}
                titleStyle={[styles.title, { color: 'white' }]}
                chevron
              />
            ))}
            <View>
              <Text style={styles.insidecard}> Data And Permission </Text>
            </View>
            {Data.map((user, i) => (
              <ListItem
                containerStyle={{ backgroundColor: 'black', color: 'white' }}
                leftIcon={{ name: user.icon, color: '#1ABC9C' }}
                key={i}
                title={user.title}
                titleStyle={[styles.title, { color: 'white' }]}
                chevron
              />
            ))}
          </Card>

          <Card containerStyle={{ borderRadius: 27, backgroundColor: 'black' }}>
            <ListItem
              containerStyle={{ backgroundColor: 'black', color: 'white' }}
              leftIcon={{ name: 'power-settings-new', color: '#E74C3C' }}
              title={'Deactivate'}
              titleStyle={[styles.title, { color: '#E74C3C' }]}
              chevron
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  insidecard: {
    paddingTop: 10,

    fontSize: 12,

    paddingLeft: 5,

    paddingBottom: 5,

    color: 'grey',
  },

  nexttext: {
    fontSize: 15,

    paddingLeft: 20,

    paddingTop: 5,

    paddingBottom: 15,
  },

  headtext: {
    fontSize: 30,

    paddingLeft: 20,

    paddingTop: 50,
  },

  title: {
    fontSize: 20,

    color: '#3F3F3F',
  },
});


