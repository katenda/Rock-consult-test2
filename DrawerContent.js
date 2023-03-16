import React, { useState, useEffect }  from 'react';
import {View,StyleSheet} from 'react-native'
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {useTheme,Avatar,Title,Caption,Paragraph,Drawer,Text,TouchableRipple,Switch} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from 'react-native-reanimated';
import {AuthContext} from '../components/context'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import * as serverconfig from '../model/serverconfig'
import * as primarycolor from '../model/primarycolor'

export function DrawerContent(props){
    const paperTheme=useTheme()
    const {signOut,toggleTheme}=React.useContext(AuthContext)

    const [userprofile,setProfileData]=useState({});

      // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {


        const fetchData = async () => {
            var userId= await AsyncStorage.getItem('userId')
            var userslist= await AsyncStorage.getItem('userslist')

            var nwarray=[]
            nwarray=JSON.parse(userslist)

            const results = nwarray.filter((request) => {
                return request.userId.toLowerCase().includes(userId);
                // Use the toLowerCase() method to make it case-insensitive
              });

            if (results.length === 1) {
                setProfileData(results[0])
            }

         };
         fetchData();

    }, []);
    
    return(
    <View style={{flex:1}}>
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <View style={{flexDirection:'row',marginTop:15}}>
                     <View style={{flexDirection:'column',marginLeft:15}}>
                         <Title style={styles.title}>{userprofile.user_name}</Title>

                     </View>
                    </View>

                </View>
            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem
                icon={({color,size})=>(
                    <Icon name='home-outline'
                    color={color}
                    size={size}
                    ></Icon>
                )}
                label="Home"
                onPress={()=>{props.navigation.navigate('Home')}}
                >

                </DrawerItem>                

                <DrawerItem
                icon={({color,size})=>(
                    <Icon name='account-outline'
                    color={color}
                    size={size}
                    ></Icon>
                )}
                label="Profile"
                onPress={()=>{props.navigation.navigate('Profile')}}
                >
                </DrawerItem>  


            </Drawer.Section>
            <Drawer.Section title="preferences">
                <TouchableRipple onPress={()=>{toggleTheme()}}>
                    <View style={styles.preference}>
                        <Text>Dark Theme</Text>
                        <View pointerEvents="none">
                        <Switch value={paperTheme.dark}></Switch>
                        </View>
                    </View>
                </TouchableRipple>

                </Drawer.Section> 
            
            </View>

        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
            icon={({color,size})=>(
                <Icon name='exit-to-app'
                color={color}
                size={size}
                ></Icon>
            )}
            label="Sign Out"
            onPress={()=>{signOut()}}
            >

            </DrawerItem>

        </Drawer.Section>
    </View>
    );
}

const styles=StyleSheet.create({
    drawerContent:{
        flex:1
    },
    userInfoSection:{
        paddingLeft: 20
    },
    title:{
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },
    title1:{
        fontSize: 14,
        marginTop: 3,
    },
    caption: {
        fontSize: 14,
        lineHeight: 14
    },
    row:{
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section:{
        flexDirection: 'row',
        alignItems:'center',
        marginRight:15
    },
    Paragraph:{
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection:{
        marginTop:15
    },
    bottomDrawerSection:{
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth:1
    },
    preference:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    },
})