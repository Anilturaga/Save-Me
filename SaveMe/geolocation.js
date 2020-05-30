import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import {TouchableRipple} from 'react-native-paper'
//import {TouchableRipple} from 'react-native-paper'
import MapView, { AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Haversine from 'haversine';
import { Notifications } from 'expo';
const LOCATION_TASK_NAME = 'background-location-task';
const CURRENT_LOCATION = 'current-location';
const GEO_FENCING = 'geo-fencing';
import { userAction } from '../redux/actions';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { darkMapStyle, liveMapStyle } from './mapStyle';
import { _setGeo, _localNotifications, _pushNotifications } from '../api';
class App extends Component {
  fixedregion = {
    latitude: 20.45570402,
    longitude: 90.43673178,
    latitudeDelta: 0.0171,
    longitudeDelta: 0.0108,
  };

  constructor(props) {
    super(props);
    this.state = {
      region: this.fixedregion,
      error: '',
      distance: 15,
      showCircle: true,
      geoCenter: this.fixedregion,
      setGeo: false,
      currentMapStyle: darkMapStyle,
    };
    console.disableYellowBox = true;
  }

  _getLocationAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let { coords } = location;
    // console.log(coords);
    let region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0171,
      longitudeDelta: 0.0108,
    };
    this.setState({ region: region });
    console.log('Location by getcurrentposition:', this.state.region);
    this.mapView.animateToRegion(this.state.region, 2000);
    return this.location;
  };
  setMapStyle(status) {
    if (status) {
      this.setState({ setGeo: true, currentMapStyle: liveMapStyle });
    } else {
      this.setState({ setGeo: false, currentMapStyle: darkMapStyle });
    }
  }
  async componentDidMount() {
    // Asking for device location permission
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      this._getLocationAsync();
    } else {
      alert('Location services needed');
    }
  }
  handleDecrease() {
    if (this.state.distance == 100) {
      this.changeDistance(15);
    }
    if (this.state.distance == 200) {
      this.changeDistance(100);
    } else if (this.state.distance == 1000) {
      this.changeDistance(200);
    } else if (this.state.distance == 5000) {
      this.changeDistance(1000);
    }
  }

  handleIncrease() {
    if (this.state.distance == 15) {
      this.changeDistance(100);
    }
    if (this.state.distance == 100) {
      this.changeDistance(200);
    } else if (this.state.distance == 200) {
      this.changeDistance(1000);
    } else if (this.state.distance == 1000) {
      this.changeDistance(5000);
    }
  }

  changeDistance(value) {
    var _this = this;
    this.setState({ distance: value });
  }
  startGeoFencing() {
    //this.setState({ setGeo: true });
    _setGeo(true);
    var time = new Date().getTime();
    var title = 'Geofencing on';
    var body = 'Registered for ' + this.state.distance + 'm';
    var ptitle = this.props.user.username + ' turned on geofence';
    _localNotifications(title, body, time);
    _pushNotifications(ptitle, body, time);
    Location.startGeofencingAsync(GEO_FENCING, [
      {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        radius: this.state.distance,
      },
    ]);
  }
  cancelGeofence() {
    _setGeo(false);
    var time = new Date().getTime();
    var title = 'Geofencing off';
    var body = 'All geofences are now down';
    var ptitle = this.props.user.username + ' turned off geofence';

    _localNotifications(title, body, time);
    _pushNotifications(ptitle, body, time);
    Location.stopGeofencingAsync(GEO_FENCING);
  }
  render() {
    if (this.props.user.geofence) {
      if (this.state.setGeo) {
        console.log('Style correct');
      } else {
        this.setMapStyle(true);
      }
    } else {
      if (this.state.setGeo) {
        this.setMapStyle(false);
      }
    }
    return (
      <View style={styles.container}>
        <MapView
          provider="google"
          initialRegion={this.state.region}
          showsCompass={true}
          showsUserLocation={true}
          ref={ref => (this.mapView = ref)}
          followsUserLocation={true}
          customMapStyle={this.state.currentMapStyle}
          style={styles.map}>
          {console.log(this.state.distance)}
          {this.state.showCircle ? (
            <MapView.Circle
              center={this.state.region}
              radius={this.state.distance}
              strokeColor="green"
              fillColor="white"
            />
          ) : null}
          <MapView.Marker
            coordinate={this.state.region}
            title="me"
            description={null}>
            <View style={styles.meStyle} />
          </MapView.Marker>
        </MapView>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={this.handleDecrease.bind(this)}
            style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.distanceText}
            onPress={this.startGeoFencing.bind(this)}>
            <Text style={styles.buttonText}>
              {this.state.distance > 999
                ? this.state.distance / 1000 + ' KM'
                : this.state.distance + ' m'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleIncrease.bind(this)}
            style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        {this.state.setGeo && (
          <View
            style={[
              styles.cancelContainer,
              { visibility: this.state.setGeo ? 'visible' : 'hidden' },
            ]}>
            <TouchableOpacity
              onPress={this.cancelGeofence.bind(this)}
              style={styles.button}>
              <Text style={styles.cancelbuttonText}>Cancel Geofence</Text>
            </TouchableOpacity>
          </View>
        )}
         <TouchableRipple
              style={styles.side}
              onPress={() => this.props.navigation.navigate('panicbutton')}
              rippleColor={this.props.colorScheme.secondarybutton}>
              <Icon
                style={[{ color: this.props.colorScheme.secondarybutton }]}
                size={50}
                name={'ios-arrow-dropleft-circle'}
              />
            </TouchableRipple>
      </View>
    );
  }
}

const mapStoretoProps = state => ({
  colorScheme: state.colorScheme,
  user: state.user,
});
export default connect(mapStoretoProps)(App);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  side:{
    position: 'absolute',
    left: 0,
    height: '100%',
    padding:7
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceText: {
    flex: 3,
    textAlign: 'center',
    alignItems: 'center',
    color: '#FFF',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 30,
  },
  cancelbuttonText: {
    color: '#FFF',
    fontSize: 17,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    height: 35,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meStyle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#67c0ff',
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#dbdbdb',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

/*
"Haversine code for frontend"
    this.setState({ geoCenter: this.state.region });
    Location.watchPositionAsync(
      { accuracy: 6, timeInterval: 200, distanceInterval: 3 },
      newLocation => {
        let { coords } = newLocation;
        // console.log(coords);
        let currentLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0171,
          longitudeDelta: 0.0108,
        };
        const start = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        };

        const end = {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
        };
        if(Haversine(start, end, { unit: 'meter' })>this.state.distance){
          alert("You just crossed the green zone.")
        }
        console.log(Haversine(start, end, { unit: 'meter' }));
      }
    );
    */

/*
"Residue code"
await Location.startLocationUpdatesAsync(CURRENT_LOCATION, {
      enableHighAccuracy: true,
      distanceInterval: 1,
      timeInterval: 500000,
    });*/
// watchPositionAsync Return Lat & Long on Position Change
/*this.location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 10000,
      },
      newLocation => {
        let { coords } = newLocation;
        // console.log(coords);
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0171,
          longitudeDelta: 0.0108,
        };
        this.setState({ region: region });
      },
      error => console.log(error)
    );*/
