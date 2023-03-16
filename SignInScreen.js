import React, { useState, useEffect,useRef } from 'react'
import {View,Text,Button,StyleSheet,Dimensions,TouchableOpacity,Platform,
    TextInput,StatusBar,Alert,Modal,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import {Title, Paragraph,Avatar, IconButton, Colors } from 'react-native-paper';

import {AuthContext} from '../components/context'
import {useTheme} from '@react-navigation/native'
import axios from 'axios'
import * as serverconfig from '../model/serverconfig'
import * as primarycolor from '../model/primarycolor'
import { ActivityIndicator,DataTable } from 'react-native-paper';
import SocialButton from '../model/SocialButton';
import AsyncStorage from '@react-native-community/async-storage'
import uuid from 'react-uuid';


const SignInScreen=({navigation})=>{
    const { colors}=useTheme();
    const [dataloading,setdataloading]=React.useState(true)
    const [email, setemail] =React.useState('');
    const [signupmodalvisible, setsignupmodalvisible] =React.useState(false);

    const phoneInput = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [formattedText, setformattedText] = React.useState("");

    const [user_name, setuser_name] =React.useState('');
    const [pass_word, setpass_word] =React.useState('');


// Similar to componentDidMount and componentDidUpdate:
useEffect(() => {
    const fetchData = async () => {
    //set data loading to false
    setdataloading(false)

 
    };
    fetchData();

}, []);



    const [data,setData]=React.useState({
        username:'',
        password:'',
        check_textInPutChange: false,
        secureTextEntry: true,
        isValidUser:true,
        isValidPassword:true
    });


    const {signIn}=React.useContext(AuthContext)

    const textInputChange=(val)=>{
        if(val.trim().length >= 4){
            setData({
                ...data,
                username: val,
                check_textInPutChange: true,
                isValidUser:true
            })
        }else{
            setData({
                ...data,
                username: val,
                check_textInPutChange: false,
                isValidUser:false
            })
        }
    }


    const handlePaswordChange=(val)=>{

        if(val.trim().length >= 8){
            setData({
                ...data,
                password: val,
                isValidPassword: true
            })
        }else{
            setData({
                ...data,
                password: val,
                isValidPassword: false
            })
        }
       
    }

    const updateSecureTextEntry=()=>{
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry 
        })
    }

    const handleValidUser=(val)=>{
        if(val.trim().length>=3){
            setData({
                ...data,
                isValidUser: true
            });
        }else{
            setData({
                ...data,
                isValidUser: false
            });
        }

    }


  //check valid email
  const validateemail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      return false;
    }
    else {
      return true;
    }
  }

    //change phone 
    const  onChangePhoneText =(val) => {
        setformattedText(val)
        }


    if (dataloading===true){
        return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator animating={true} color={primarycolor.primarycolor} />
          </View> 
        );
      }else{
        return(
            <View style={styles.containers}>
                <StatusBar backgroundColor={primarycolor.primarycolor} barStyle='light-content'/>
              
              {/*Signup modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={signupmodalvisible}
                    
                >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <View style={{justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'row'}}>
                <TouchableOpacity>
                        <IconButton
                        icon="close-circle-outline"
                        color={primarycolor.primarycolor}
                        size={30}
                        onPress={() => {setsignupmodalvisible(!signupmodalvisible);}}
                        />  

                </TouchableOpacity>
                </View>

                <Text style={{fontWeight:'900',alignSelf:'center'}}>Sign up here</Text>

                <View style={{flexDirection:'row',marginTop:6,padding:3}}>
                    <TextInput
                    placeholderTextColor={primarycolor.primarycolor}
                    placeholder="User name"
                    autoCapitalize="none"
                    onChangeText={(val)=>setuser_name(val)}
                    style={{width:'80%',margin:4,borderRadius:10,borderWidth:1,borderColor:primarycolor.primarycolor}}
                    />
                </View>

                <View style={{flexDirection:'row',marginTop:6,padding:3}}>
                    <TextInput
                    placeholderTextColor={primarycolor.primarycolor}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(val)=>setpass_word(val)}
                    style={{width:'80%',margin:4,borderRadius:10,borderWidth:1,borderColor:primarycolor.primarycolor}}
                    secureTextEntry={true}
                    />
                </View>

                <TouchableOpacity
                    onPress={ async()=>{
                        var nwarray=[]

                        var userslist= await AsyncStorage.getItem('userslist')
                        console.log(userslist)
                        nwarray=JSON.parse(userslist)

                        //signup here
                        console.log({
                            "key":uuid(),
                            "userid":uuid(),
                            "pass_word":pass_word,
                            "user_name":user_name
                        })

                        //search for existing user
                        const results = nwarray.filter((request) => {
                            return request.user_name.toLowerCase().includes(user_name);
                            // Use the toLowerCase() method to make it case-insensitive
                          });

                        if (results.length === 1) {
                            alert("User already registered")
                        
                        }else{

                            nwarray.push({
                                "key":uuid(),
                                "userid":uuid(),
                                "pass_word":pass_word,
                                "user_name":user_name
                            })
                            
                           // setall_userlist([...all_userlist, ]);

                            const items = [['userslist',JSON.stringify(nwarray)]]

                            try{
                                await AsyncStorage.multiSet(items)
                                alert("User signup success")

                            }catch(e){
                                console.log(e)
                                alert("Failed creation")
                            }
                        }

                    }}
                    style={{alignSelf:'center',borderWidth:2,borderRadius:16,padding:4,margin:3,borderColor:primarycolor.primarycolor}}
                    >
                        <Text style={{color:primarycolor.primarycolor,fontSize:20}}>
                        Sign up
                        </Text>
                    </TouchableOpacity>

                </View>
                </View>
                </Modal>   

                {/**main login form */}             
                
                
                <View style={styles.header}>
                 <Text style={styles.text_header}>Login</Text>
                </View>
                <Animatable.View animation="fadeInUpBig" style={[styles.footer,{backgroundColor: colors.background}]}>
                    <Text style={[styles.text_footer,{color:colors.text}]}>User name</Text>
                    <View style={styles.action}>
                    
                    <TextInput
                        placeholderTextColor={primarycolor.primarycolor}
                        placeholder="Username"
                        //secureTextEntry={data.secureTextEntry?true:false}
                        style={[styles.TextInput,{color:colors.text}]}
                        autoCapitalize="none"
                        onChangeText={(val)=>setuser_name(val)}
                        />
                    </View>

                    <Text style={[styles.text_footer,{color:colors.text,marginTop:35}]}>Password</Text>
    
                    <View style={styles.action}>
                        <FontAwesome
                        name="lock"
                        color={colors.text}
                        size={20} 
                         />
                        <TextInput
                        placeholderTextColor={primarycolor.primarycolor}
                        placeholder="Your Password"
                        secureTextEntry={data.secureTextEntry?true:false}
                        style={[styles.TextInput,{color:colors.text}]}
                        autoCapitalize="none"
                        onChangeText={(val)=>setpass_word(val)}
                        />
                        <TouchableOpacity
                        onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry?
                            <Feather
                            name="eye-off"
                            color="grey"
                            size={20}
                            />                        
                            :
                            <Feather
                            name="eye"
                            color="grey"
                            size={20}
                            />                        
                            }
    
                        </TouchableOpacity>
    
                    </View>
                    {data.isValidPassword?null:
                    null
                    /*<Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMessage}>Password must be atleast eight characters long.</Text>
                    </Animatable.View>   */             
                    }
    
    
                    <View style={styles.button}>
                    <TouchableOpacity
                        onPress={ async()=>{

                            var nwarray=[]
                            var userslist= await AsyncStorage.getItem('userslist')
                            console.log(userslist)
                            nwarray=JSON.parse(userslist)
    

                            if (user_name===''){
                                Alert.alert("Field Alert","Username is missing",[
                                    {text: 'Okay'}
                                ]);
                            }else if(pass_word===''){
                                Alert.alert("Field Alert","Password missing",[
                                    {text: 'Okay'}
                                ]);
                            }
                            
                            else{
                                setdataloading(true)

                            //search for existing user
                            const results = nwarray.filter((request) => {
                                return request.user_name.toLowerCase().includes(user_name);
                                // Use the toLowerCase() method to make it case-insensitive
                            });

                            if (results.length === 1) {

                                const results1 = nwarray.filter((request) => {
                                    return request.pass_word.toLowerCase().includes(pass_word);
                                    // Use the toLowerCase() method to make it case-insensitive
                                });

                                if (results1.length === 1) {
                                    signIn(String(results[0].userid));
                                    alert("Logged in ")
                                    setdataloading(false)

                                }else{
                                    alert("User password wrong")
                                    setdataloading(false)

                                }

                            
                            }else{
                                alert("User doesnt exist")
                                setdataloading(false)

                            }}
                        }}

                        style={styles.signIn}>
                        <LinearGradient
                        colors={[primarycolor.lightercolor,primarycolor.primarycolor]}
                        style={styles.signIn}
                        >
                            <Text style={[styles.textSign,{color:'#fff'}]}>
                                Sign In
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>

                    <View style={{marginTop:10,alignItems:'center',alignSelf:'center',flexDirection:'row'}}>
                    <Text>Dont have Account?</Text>
                    <TouchableOpacity onPress={()=>{
                        setsignupmodalvisible(true)

                    }}>
                    <Text style={{alignSelf:'center',fontStyle:'italic',fontSize:16,color:primarycolor.primarycolor,marginLeft:3}}>Sign Up</Text>
                    </TouchableOpacity>
                    </View>                    
    
                </Animatable.View>         
            </View>
        );

      }
};

export default SignInScreen;

const {height}=Dimensions.get("screen");
const height_logo=height*0.28;


const styles=StyleSheet.create({
    containers:{
        flex: 1,
        backgroundColor: primarycolor.primarycolor,
    },
    header:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 30,
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0:-12,
        paddingLeft: 10,
        color: '#05375a'
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'center',
        marginTop: 25
    },
    signIn:{
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontWeight: 'bold',
        fontSize:18
    },
    errorMessage: {
        color: 'red',
        fontSize:10

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        borderColor:primarycolor.primarycolor,
        margin:10,
        padding: 3,
        alignItems: 'flex-start',
        shadowColor: primarycolor.primarycolor,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth:1
      },

});