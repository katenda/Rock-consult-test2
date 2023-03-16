/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect,useState,useRef} from 'react';
import { View,Alert,Text,TouchableOpacity,StyleSheet,Dimensions,
  StatusBar,Image,Platform,
  PermissionsAndroid,
  ImageBackground,Linking,AppRegistry,AppState
} from 'react-native';
import { NavigationContainer,
   DefaultTheme as NavigationDefaultTheme
  ,DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Provider as PaperProvider,
  DefaultTheme as PaperDafaultTheme,
  DarkTheme as PaperDarkTheme} from 'react-native-paper'

import MainTabsScreen from './screens/MainTabsScreen';
import { DrawerContent } from './screens/DrawerContent';

import RootStackScreen from './screens/RootStackScreen'

import AsyncStorage from '@react-native-community/async-storage'

import {AuthContext} from './components/context'
import { ActivityIndicator } from 'react-native-paper';
import * as apikey from './model/apikey'

import * as primarycolor from './model/primarycolor'
import axios from 'axios'
import * as serverconfig from './model/serverconfig'
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib'; 
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Animated, Easing } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'

const Drawer = createDrawerNavigator();

Geocoder.init(apikey.apikey);

const App = () => {
  const [isDarkTheme,setIsDarkTheme]=React.useState(false);
 
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const initialLoginState={
    isloading: true,
    userName: null,
    userToken:null,
  };

  const customDefaultTheme={
    ...NavigationDefaultTheme,
    ...PaperDafaultTheme,
    colors:{
      ...NavigationDefaultTheme.colors,
      ...PaperDafaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const customDarkTheme={
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors:{
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'

    }
  }

  const theme=isDarkTheme?customDarkTheme:customDefaultTheme;

  
  const loginReducer=(preState,action) =>{
    switch(action.type){
      case 'RETREIVE_TOKEN':
        return {
          ...preState,
          userToken:action.token,
          isloading: false,
        };
      case 'LOGIN':
        return {
          ...preState,
          userName:action.id,
          userToken:action.token,
          isloading: false,          
        };
      case 'LOGOUT':
        return {
          ...preState,
          userName:null,
          userToken:null,          
          isloading: false,
        };        
      case 'REGISTER':
          return {
            ...preState,
            userName:action.id,
            userToken:action.token,            
            isloading: false,
          }; 
      }
  };

  //add event listemer to the app state
  AppState.addEventListener('change', (value)=>{
   // console.log("from"+String(value))
    setAppStateVisible(value)
  });

  const [loginState,dispatch]=React.useReducer(loginReducer,initialLoginState);
  
  const authContext=React.useMemo(()=>({
    signIn: async(uid)=>{
        const items = [['userId',String(uid)]]

        try{
          await AsyncStorage.multiSet(items)
        }catch(e){
          console.log(e)
        }
      
      dispatch({type:'LOGIN',id: uid,token: uid});
    },
    signOut: async()=>{
      //setUserToken(null);
      //setIsLoading(false);  
      try{
        await AsyncStorage.removeItem('userId')
      }catch(e){
        console.log(e)
      }      
      dispatch({type:'LOGOUT'});
    
    },
    signUp:()=>{
      setUserToken('fgtdgdh');
      setIsLoading(false);      
    },
    toggleTheme:()=>{
      setIsDarkTheme(isDarkTheme=>!isDarkTheme)
    },

  }),[]); 


  useEffect(() => {

    const requestPermissions=async()=> {
     

      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
         authorizationLevel: 'whenInUse',
       });
      }
    
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }

    }

    setTimeout(async()=>{
      let userToken;
      userToken=null

      try{
        userToken=await AsyncStorage.getItem('userToken')
      }catch(e){
        console.log(e)
      }
      dispatch({type:'REGISTER',token: userToken});
    },6000);


    requestPermissions();
  }, [])

  const styles=StyleSheet.create({
    signIn:{
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    textSign: {
      fontWeight: 'bold',
      fontSize:18
  },
  
  });


    if(loginState.isloading){
      return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:primarycolor.primarycolor}} >
        <StatusBar backgroundColor={primarycolor.primarycolor} barStyle='light-content'/>

            <View style={{height:'20%',width:'100%'}}>
              <Text style={{alignSelf:'center',fontSize:30,fontWeight:'bold',color:'#fff'}}>Loading </Text>
            </View>
        </View>
      );
    }else{

      return (
        
        <PaperProvider theme={theme}>
        <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>

          {loginState.userToken !==null?
          (
            <Drawer.Navigator drawerContent={props=><DrawerContent {...props}/>}>
             <Drawer.Screen name="HomeDrawer" component={MainTabsScreen} />

            </Drawer.Navigator> 

          )
          :
          <RootStackScreen/>
          }
    

        </NavigationContainer>
        </AuthContext.Provider>
        </PaperProvider>
    
      );
    }
  

};

export default App;


