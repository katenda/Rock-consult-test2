import React, { useState, useEffect,useRef }  from 'react';
import {View,Text,Button,StyleSheet,Dimensions,Image,TouchableOpacity,StatusBar,AppState} from 'react-native'

import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import HomeScreen from './HomeScreen'
import ProfileScreen from './ProfileScreen'

import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import * as serverconfig from '../model/serverconfig'
import {Avatar} from 'react-native-paper'
import {useTheme} from '@react-navigation/native'
import * as primarycolor from '../model/primarycolor'
import { withBadge } from 'react-native-elements'

const HomeStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack=createStackNavigator();
const OrderStack=createStackNavigator();
const TripStack=createStackNavigator();

const Tab = createMaterialBottomTabNavigator();


const HomeStackScreen=({navigation})=>{
    const {colors}=useTheme();
    const {height}=Dimensions.get("screen").height;
    const {width}=Dimensions.get("screen").width;

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const height_logo=height*0.07;
    const width_logo=width*0.12;

    const styles=StyleSheet.create({
      logo: {
          width: '100%',
          height: '100%'
      },

  });



    // Similar to componentDidMount and componentDidUpdate:
    const [userprofile,setProfileData]=useState({});
    useEffect(() => {
      const fetchData = async () => {
          try {
      

  
          } catch (err) {
            console.log(err);
          }
      };
      fetchData();

  }, []);



  return (
    <HomeStack.Navigator screenOptions={{
      headerStyle:{
        backgroundColor: colors.background,
        shadowColor: colors.background,//ios
        elevation:0  //android
      },
      headerTintColor: primarycolor.primarycolor,
      headerTitleStyles:{
        fontWeight: 'bold'
      }
  }}

  >
    <HomeStack.Screen name="Home" component={HomeScreen} options={{title:"",
    headerLeft: ()=>(

      <View style={{flexDirection:'row'}}>
      <View>
      <Icon.Button 
      name="ios-menu" 
      size={25} 
      backgroundColor={colors.background}
      color={primarycolor.primarycolor}
      onPress={()=>navigation.openDrawer()}>
      </Icon.Button>
      </View>
 

      </View>
    ),
    headerRight: ()=>(
      <View style={{flexDirection:'row',marginRight:10}}>
        <TouchableOpacity style={{paddingHorizontal: 10,marginTop:5}} onPress={()=>{navigation.navigate('Profile')}}>
        <Avatar.Image size={30} source={{uri:String(userprofile.profile_pic)}} />
        </TouchableOpacity>
      </View>
    ),  
  }}/>

  </HomeStack.Navigator>
  );

}
  


const ProfileStackScreen=({navigation})=>{
  const {colors}=useTheme();
  const [userprofile,setProfileData]=useState({});
  useEffect(() => {
    const fetchData = async () => {
        try {
          //getting the user profile
          userID= await AsyncStorage.getItem('userId')


        } catch (err) {
          console.log(err);
        }
    };
    fetchData();

}, []);


return  (
  <ProfileStack.Navigator screenOptions={{
    headerStyle:{
      backgroundColor: colors.background,
      shadowColor: colors.background,//ios
      elevation:0  //android
    },
    headerTintColor: primarycolor.primarycolor,
    headerTitleStyles:{
      fontWeight: 'bold'
    }
}}>
  <ProfileStack.Screen name="Profile" component={ProfileScreen}
  options={{title:"Profile",
  headerLeft: ()=>(
    <Icon.Button name="ios-menu" size={25}
    backgroundColor={colors.background}
    color={primarycolor.primarycolor}   
    onPress={()=>navigation.openDrawer()}></Icon.Button>
  )
  ,
    headerRight: ()=>(
      <View style={{flexDirection:'row',marginRight:10}}>
        <TouchableOpacity style={{paddingHorizontal: 10,marginTop:5}} onPress={()=>{navigation.navigate('Profile')}}>
        <Avatar.Image size={30} source={{uri:String(userprofile.profile_pic)}} />
        </TouchableOpacity>
      </View>
    ),
}}/>



</ProfileStack.Navigator>
);
}  



const MainTabScreen=()=>{
  const [notifications,setnotifications]=React.useState([])

  const MessagesBadge = withBadge(notifications.length)(Icon)

// Similar to componentDidMount and componentDidUpdate:
 useEffect(() => {
  const getData=async ()=>{
    const userId= await AsyncStorage.getItem('userId')

 
  }


  getData();

}, []);


  return ( 
  <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
    shifting={true}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor:primarycolor.primarycolor,
        tabBarIcon: ({ color }) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor:primarycolor.primarycolor,
        tabBarIcon: ({ color }) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
    

  </Tab.Navigator>);
}



export default MainTabScreen;


