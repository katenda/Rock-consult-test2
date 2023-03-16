/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import axios from 'axios'
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage'
import * as serverconfig from './model/serverconfig'


ReactNativeForegroundService.add_task( async() =>{
    console.log("am hereeeeeee")
  
   //get location data
   Geolocation.getCurrentPosition(
    async(position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);

      console.log("new cordinates"+position.coords.latitude+position.coords.longitude)

      var userID= await AsyncStorage.getItem('userid')


      //send position updates now
      let form_data = new FormData();
      form_data.append('userID', userID);
      form_data.append('latitude', position.coords.latitude);
      form_data.append('longitude', position.coords.longitude);

      axios.post(serverconfig.backendserverurl+`/customqueries/updateagentposition`, form_data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      .then(res =>{
       // console.log(res.data)

      })
      .catch(error => console.log(error))         

    },
    (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 100000,
      interval:5000,
      fastestInterval:5000,
      forceRequestLocation:true,
    }
);

  
  }, {
    delay: 20000,
    onLoop: true,
    taskId: "taskiiid",
    onError: (e) => console.log(`Error logging:`, e),
  });

  ReactNativeForegroundService.register();

AppRegistry.registerComponent(appName, () => App);
