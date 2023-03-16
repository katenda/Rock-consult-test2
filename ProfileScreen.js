import React, {useRef,useEffect} from 'react';
import {View,Platform,SafeAreaView, StyleSheet,ScrollView,TouchableOpacity} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage'
import NumberFormat from 'react-number-format';
import * as serverconfig from '../model/serverconfig'
import { ActivityIndicator } from 'react-native-paper';
import * as primarycolor from '../model/primarycolor'
import axios from 'axios'
import {useTheme} from '@react-navigation/native'


const ProfileScreen = ({navigation}) => {
  const [isFetching,setisFetching]=React.useState(true)
  const [userprofile,setuserprofile]=React.useState({})
  const {colors}=useTheme();
  const [isConnected, setIsConnected] =React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [agentdataprofile, setagentdataprofile] = React.useState({});
  const [token,settoken]=React.useState('')



  useEffect(() => {

    const getuserdata = async () => {
     

    };


     getuserdata();

}, []);


if (isConnected==false) {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={styles.text}> Not Connected to internet</Text>
    </View>
  );
}else{

  if(isFetching==true){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator animating={true} color={primarycolor.primarycolor} />
    </View>
    );
  }else{
    return (
      <ScrollView style={styles.container}>
  
        

      </ScrollView>
    );
  
  }

}

};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    //paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 18,
    //lineHeight: 14,
    //fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});