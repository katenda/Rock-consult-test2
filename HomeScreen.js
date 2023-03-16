import React, { useState, useEffect,useRef }  from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Button,
    StatusBar,
    TouchableOpacity,
    Text,
    ImageBackground,
    Platform,
    PermissionsAndroid,
    Dimensions,
    TextInput,
    Alert,
    Switch,
    Modal,
    Image,
    FlatList,
    Linking,
    AppState,
    AppRegistry,
  } from 'react-native';
import {useTheme} from '@react-navigation/native'
import {Title, Paragraph,Avatar, IconButton, Colors } from 'react-native-paper';
import * as MyComponents from '../components';
import * as othertheme from '../constants/theme';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage'

import ImagePicker from 'react-native-image-crop-picker';
import MapView,{PROVIDER_GOOGLE,Marker} from "react-native-maps";
import {mapDarkStyle, mapStandardStyle } from '../model/mapData';
import Entypo from 'react-native-vector-icons/Entypo';

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'

import { ActivityIndicator,DataTable,FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Container, Header, Content, Form, Item, Picker,Left,DatePicker } from 'native-base';
import * as primarycolor from '../model/primarycolor'
import * as apikey from '../model/apikey'

import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import * as geolib from 'geolib'; 
import {AuthContext} from '../components/context'
import { Animated, Easing } from 'react-native';
import * as polygon from 'polygon'
import uuid from 'react-uuid';


Geocoder.init(apikey.apikey);

function HomeScreen({ navigation }) {

  const theme=useTheme()
  const {colors}=useTheme();

  const dateFormat = 'DD/MM/YYYY';
  const yeardateFormat = 'YYYY';
  const monthdateFormat = 'MM/YYYY';

  const _map = React.useRef(null);
  const HEIGHT=Dimensions.get('screen').height
  const WIDTH=Dimensions.get('screen').width

  const [dataloading,setdataloading]=React.useState(true)
  const appState = useRef(AppState.currentState);
  
    //boolean varaible for consenting
    const [do_conscent,setdo_conscent]=React.useState(false)

    //variable for registration date iniated to current date
    const [registration_date,setregistration_date]=React.useState(moment().format(dateFormat).toString())

    //variable for resondant name
    const [respondent_name,setrespondent_name]=React.useState('')

    //respondent image variables
    const [respondent_photo,setrespondent_photo]=React.useState(null)
    const [respondent_photopath,setrespondent_photopath]=React.useState(null)

    //Gps latitude and longitude
    const [respondent_gpslatititude,setrespondent_gpslatititude]=React.useState(0)
    const [respondent_gpslongitude,setrespondent_gpslongitude]=React.useState(0)

    //respondent comments 
    const [respondent_comments,setrespondent_comments]=React.useState('')

    //compound coordinates list for calcualtes of compound area and shape
    const [compoundcoordinates_list,setcompoundcoordinates_list]=React.useState([])

    //current submitted data
    const [current_subdata,setcurrent_subdata]=React.useState({})


      // Similar to componentDidMount and componentDidUpdate:
      useEffect(() => {
        const getinitialdata=async()=>{
          var conscentdata= JSON.parse(await AsyncStorage.getItem('conscentdata'))
          console.log(conscentdata)

          if (conscentdata!=null){
            setcurrent_subdata(conscentdata)
          }


          //get location data
          Geolocation.watchPosition(
            async(position) => {
              setrespondent_gpslatititude(position.coords.latitude);
              setrespondent_gpslongitude(position.coords.longitude);

              console.log("new cordinates"+position.coords.latitude+position.coords.longitude)

            },
            (error) => {
                // See error code charts below.
                seterror(error.message)
                console.log(error.code, error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 100000,
              interval:5000,
              fastestInterval:5000,
              forceRequestLocation:true,
            }
        );

         setdataloading(false)

        }
        getinitialdata();

    }, []);

    //calculate the area of created area
    const calcultaeAreaofcomppound =()=>{
      var area=0

      if (compoundcoordinates_list.length>0){
        var p = new Polygon(compoundcoordinates_list);
        area=p.area()
      }

      return area;
    }

    //check epmyty dictionary
   const isEmptyObject=(obj)=>{
      for ( var name in obj ) {
        return false;
      }
      return true;
    }


  if (dataloading===true){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator animating={true} color={primarycolor.primarycolor} />
      <Text style={{color:primarycolor.primarycolor,alignSelf:'center'}}> Please wait..</Text>
    </View>
    );
  }else{
    return (
        <ScrollView style={{flex:1,width:'95%',alignSelf:'center'}}>
          <StatusBar backgroundColor={primarycolor.primarycolor} barStyle='light-content'/>
          
        {
          isEmptyObject(current_subdata)===false?
          <View style={{borderColor:primarycolor.primarycolor,borderRadius:15,margin:6,borderWidth:3,padding:4}}>
            <Text style={{fontSize:15,margin:5,alignSelf:'center',color:'#bbb'}}>Submitted data</Text>
            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Name:  {current_subdata.data.respondent_name}</Text>
            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Reg date:  {current_subdata.data.registration_date}</Text>

            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Location coordinates:  {current_subdata.data.respondent_gpslatititude} | {current_subdata.data.respondent_gpslongitude}</Text>
            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Comments:  {current_subdata.data.respondent_comments}</Text>
            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Compound cordinates:  {current_subdata.data.compoundcoordinates_list}</Text>
            <Text style={{fontSize:15,color:primarycolor.primarycolor}}>Compound area:  {current_subdata.data.calculated_area_ofcompund}</Text>

            {
            respondent_photopath!="null"?
            <View style={{alignSelf:'center',width:'75%'}}>
            <Avatar.Image size={70} source={{uri:current_subdata.data.respondent_photopath}} style={{marginLeft:6}}/>
            </View>
            :
            null
            }

          </View>
          :
          null
        }


          <View style={{margin:6}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Do you consent to be registered on our program?</Text>
         
         <View style={{alignSelf:'flex-start'}}>
         <Switch 
            //thumbColor={primarycolor.primarycolor} 
            trackColor={{ false: "red", true: "green" }} 
            color={primarycolor.primarycolor} 
            value={do_conscent} 
            onValueChange={(val)=>{setdo_conscent(val)}} 
            style={{margin:6, }}
             />
         </View>

        </View>

        {
          do_conscent===true?
          <View style={{alignSelf:'center',margin:6}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Registration date</Text>
          <DatePicker
            defaultDate={new Date()}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Date from"
            textStyle={{ color: primarycolor.primarycolor }}
            placeHolderTextStyle={{ color: primarycolor.primarycolor }}
            onDateChange={
              (date) => {
                let formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            
               console.log(formatted_date)
               setregistration_date(formatted_date)
              }
            }
            disabled={false}
            />
        </View>
          :
          null
        }

      

        {
          do_conscent===true?
          <View style={{alignSelf:'center',margin:6}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Respondent Name</Text>
          <TextInput style={{fontSize:20,fontWeight:'900',backgroundColor:primarycolor.lightercolor,width:250}} onChangeText={(val)=>{setrespondent_name(val)}}>
          </TextInput>
        </View>
          :
          null
        }
      

        {
          do_conscent===true?
          <View style={{flexDirection:'row',marginTop:6}}>
          <Text style={{fontWeight:'bold',fontSize:16,color:colors.text}}>Respondent image:</Text>
          <View style={{marginLeft:3,flexDirection:'row'}}>
              <Ionicons.Button name="camera" size={20}  backgroundColor={primarycolor.primarycolor}
                onPress={()=>{
                ImagePicker.openCamera({
                  width: 300,
                  height: 400,
                  cropping: true,
                  includeBase64:true,
                }).then(image => {
                  //console.log(image);
                  setrespondent_photo(image.data)
                  setrespondent_photopath(`data:${image.mime};base64,${image.data}`)
                });
              }}
              style={{margin:3}}
              ></Ionicons.Button>

            <TouchableOpacity
                onPress={()=>{
                  ImagePicker.openPicker({
                    width: 300,
                    height: 400,
                    cropping: true,
                    includeBase64:true,
                  }).then(image => {
                    console.log(image);
                    setrespondent_photo(image.data)
                    setrespondent_photopath(`data:${image.mime};base64,${image.data}`)
                  });

                }}
                style={{borderColor:primarycolor.primarycolor,borderRadius:15,padding:4,borderWidth:3,margin:3}}
                >
                  <Text style={{color:primarycolor.primarycolor,fontSize:20}}>
                    From gallery
                  </Text>
            </TouchableOpacity>

          </View>
        </View>
          :
          null
        }
      

          {
          respondent_photo!=null?
          <View style={{alignSelf:'center',width:'75%'}}>
          <Avatar.Image size={70} source={{uri:respondent_photopath}} style={{marginLeft:6}}/>
          </View>
          :
          null
          }

        <View style={{alignSelf:'center',margin:6}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Respondent compound shape and size</Text>
          <MapView
              style={{height:0.3*HEIGHT,borderColor:primarycolor.primarycolor,borderWidth:1}}
              ref={_map}
              //initialRegion={state.region}
              provider={PROVIDER_GOOGLE}
              customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}
              region={{
                latitude: respondent_gpslatititude,
                longitude: respondent_gpslongitude,
                latitudeDelta: 0.00864195044303443,
                longitudeDelta: 0.000142817690068,
              }}
              onPress={(e) => {
                console.log(e.nativeEvent.coordinate)
                //setcompoundcoordinates_list([...compoundcoordinates_list, { latlng: e.nativeEvent.coordinate }])

                const { coordinate } = e.nativeEvent;
                setcompoundcoordinates_list([...compoundcoordinates_list, { latlng: e.nativeEvent.coordinate, title: 'New Marker' }]);

              } }
              
              >

            
             {
                compoundcoordinates_list.length>0?
                  compoundcoordinates_list.map((marker)=>{

                  <MapView.Marker 
                  identifier={uuid()}
                  coordinate={marker}
                  //icon={require('../assets/package.png')}
                  title={"compound point"}
                  description={"Point"}
                  >
                  </MapView.Marker>
                })

                :
                null

               }

              </MapView>

              <Text style={{fontSize:20,fontWeight:'900'}}>Calculated rea of compound:  {calcultaeAreaofcomppound()} Square metres</Text>
              <Text style={{fontSize:20,fontWeight:'900'}}>Location cordinates: {respondent_gpslatititude} | {respondent_gpslongitude}</Text>

        </View>


        <View style={{alignSelf:'center',margin:6}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>Comments</Text>
          <TextInput style={{fontSize:20,fontWeight:'900',backgroundColor:primarycolor.lightercolor,width:250}} onChangeText={(val)=>{setrespondent_comments(val)}}>
          </TextInput>
        </View>

        <TouchableOpacity
          onPress={ async()=>{
            //now add data to system
            var userId= await AsyncStorage.getItem('userId')
            var conscentdata= JSON.parse(await AsyncStorage.getItem('conscentdata'))

            if (conscentdata!=undefined){
              if(conscentdata.userId===userId){
                alert("consent data exists")
              }else{
                //add conscent data
                const items = [['conscentdata', JSON.stringify({
                  "userId":userId,
                  "data":{
                    "do_conscent":do_conscent,
                    "registration_date":registration_date,
                    "respondent_name":respondent_name,
                    "respondent_gpslatititude":respondent_gpslatititude,
                    "respondent_gpslongitude":respondent_gpslongitude,
                    "respondent_comments":respondent_comments,
                    "compoundcoordinates_list":String(compoundcoordinates_list),
                    "calculated_area_ofcompund":calcultaeAreaofcomppound(),
                    "respondent_photopath":String(respondent_photopath)

                  }

                }) ]]

                try{
                    await AsyncStorage.multiSet(items)
                    alert("Datasubmission successful")

                }catch(e){
                    console.log(e)
                    alert("Failed data creation")
                }

              }

            }else{

              //add conscent data
              const items = [['conscentdata', JSON.stringify({
                "userId":userId,
                "data":{
                  "do_conscent":do_conscent,
                  "registration_date":registration_date,
                  "respondent_name":respondent_name,
                  "respondent_gpslatititude":respondent_gpslatititude,
                  "respondent_gpslongitude":respondent_gpslongitude,
                  "respondent_comments":respondent_comments,
                  "compoundcoordinates_list":String(compoundcoordinates_list),
                  "calculated_area_ofcompund":calcultaeAreaofcomppound(),
                  "respondent_photopath":String(respondent_photopath)

                }

              }) ]]

              try{
                  await AsyncStorage.multiSet(items)
                  alert("Datasubmission successful")

              }catch(e){
                  console.log(e)
                  alert("Failed data creation")
              }

            }
            

          }}
          style={{borderColor:primarycolor.primarycolor,borderRadius:15,padding:4,borderWidth:3,margin:6}}
          >
            <Text style={{color:primarycolor.primarycolor,fontSize:20}}>
              Submit data
            </Text>

        </TouchableOpacity>
        
        </ScrollView>)
  }

}

export default HomeScreen;






