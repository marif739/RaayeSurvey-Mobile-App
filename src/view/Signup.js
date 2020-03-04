import React, { useState, useEffect } from 'react'
import { Container, Content, Grid, Col, Row, Item, Input, Icon, Button, Text, Label } from 'native-base';
import { Image, StatusBar, Picker, StyleSheet, Keyboard, View, PermissionsAndroid, CheckBox, Linking, TouchableOpacity } from 'react-native';
import { Overlay, ButtonGroup } from 'react-native-elements'
import { UIActivityIndicator, BallIndicator } from 'react-native-indicators';
import Api from '../utils/Api'
import { toast } from '../function/Function'
import DatePicker from 'react-native-datepicker'
import Geolocation from '@react-native-community/geolocation';

export default (props) => {

  const [ user, setUser ] = useState({
    fname: '',
    lname: '',
    gender: '',
    dob: '',
    email: '',
    password: '',
    phone: '',
    network: '',
    coords : '',
    ref : '',
    buttonAction:false,
    error:'date'
  })
  const [ load, setLoad ] = useState(false)
  const [ selectedIndex, setSelectedInex ] = useState(0)
  const [ check, setcheck ] = useState(false)
  const { fname, lname, gender, dob, email, password, phone, network, coords, ref, buttonAction, error } = user

  useEffect(() => {

    loc()
    async function loc(){

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Raaye',
            'message': 'Raaye would like to access your location for better experience'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition((info) => {
            setUser({...user, coords:info.coords.latitude+'-'+info.coords.longitude})
          },
          (error) => {
            console.log('Request location error',error)
          },
          {enableHighAccuracy: false, timeout: 2000, maximumAge: 3600000}
          );
          
        } else {
          console.log("location permission denied")
          
        }
      } catch (err) {
        console.warn(err)
      }

    }
    
  },[])

  const update = () => {
    const val = selectedIndex == 0 ? 1 : 0
    setSelectedInex(val)
  }

  const Register = () => {
    if(validate()){
      Keyboard.dismiss()
      setLoad(true)
      setUser({ ...user, buttonAction:true})

          Api.post('register', {fname, lname, gender, dob, email, password, phone, network, coords, ref})
          .then(res => {
            if(res.data.msg == 'success'){
              setLoad(true)
              props.navigation.navigate('Verify',{token:res.data.res.token});
              setUser({ ...user, emailStyleError:false, passwordStyleError:false, buttonAction:true})
          }
          else{
            setLoad(false)
            setUser({ ...user, buttonAction:false})
              toast(res.data.msg, 'red')
          }
          })
          .catch(err => console.log(err.response))

    }
  }

  if(load){
    return(
      <View style={{flex:1, backgroundColor:'#96cd2a', justifyContent:'center'}}>
            
                <View style={{alignItems:'center'}}>
            <BallIndicator color='white' style={{ marginTop:50 }} size={80}/>
            </View>
            
        </View>
    )
  }
  else{

  return (
    <Container style={{backgroundColor:'#96cd2a'}}>
    <StatusBar backgroundColor="#96cd2a" barStyle="default" />
    <Content>
    {buttonAction &&
            <Overlay
                isVisible={true}
                windowBackgroundColor="rgba(.5, .5, .5, .5)"
                overlayBackgroundColor="#fff"
                width={80}
                height={60}
            >
                <UIActivityIndicator color='black' />
            </Overlay>
        }
    <Grid>

    <Row style={{ justifyContent:'center', alignItems: 'center', marginTop:30}}>
    <Image source={require('../assets/img/icon.png')} style={{width:200, height:90}} />
    </Row>

    <Row style={{ marginTop:20, justifyContent:'center', alignItems: 'center'}}>
      <Col>
      <ButtonGroup
      onPress={update}
      selectedIndex={selectedIndex}
      buttons={['Personal Details', 'Other']}
      containerStyle={{height: 50}}
      selectedButtonStyle={{backgroundColor:'#96cd2a'}}
    />
      </Col>
    </Row>
      { selectedIndex == 0 ? (
        <>
    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'fname' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>First Name</Label>
        <Input style={{color:'#ffffff'}} value={fname} onChangeText={val => setUser({...user, fname:val})}/>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20,  marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'lname' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>Last Name</Label>
        <Input style={{color:'#ffffff'}} value={lname} onChangeText={val => setUser({...user, lname:val})}/>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item style={[{borderStyle:'solid',}, error === 'gender' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Gender"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ flex: 1, color: '#ffffff' }}
                itemStyle={{backgroundColor:'#fff'}}
                onValueChange={(val, ind) => {
                  if(val != "0"){
                    setUser({...user, gender:val})
                  }
                }}
                selectedValue={gender}
              >
              <Picker.Item label="Gender" value="0"/>
                <Picker.Item label="Male" value="1" />
                <Picker.Item label="Female" value="2" />
              </Picker>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:30, justifyContent:'center', alignItems:'center'}}>
    <Item style={[{borderStyle:'solid', width:'100%'}, error === 'dob' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <DatePicker
        style={{width: '100%'}}
        date={dob}
        mode="date"
        placeholder="Select date of Birth"
        maxDate={new Date()}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            borderColor:'#fff',
          },
          placeholderText:{
            color:'#ffffff'
          },
          dateText:{
            color:'#ffffff'
          }
        }}
        onDateChange={(date) => { setUser({...user, dob:date}) }}
        />
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'email' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>Email</Label>
        <Input style={{color:'#ffffff'}} value={email} onChangeText={val => setUser({...user, email:val})}/>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'password' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>Password</Label>
        <Input style={{color:'#ffffff'}} secureTextEntry={true} value={password} onChangeText={val => setUser({...user, password:val})}/>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'phone' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>Mobile Number</Label>
        <Input style={{color:'#ffffff'}} value={phone} onChangeText={val => setUser({...user, phone:val})} keyboardType={'numeric'}/>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item style={[{borderStyle:'solid'}, error === 'network' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Gender"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ flex: 1, color: '#ffffff' }}
                itemStyle={{backgroundColor:'#fff'}}
                selectedValue={network}
                onValueChange={(val, ind) => {
                  if(val !== "0"){
                    setUser({...user, network:val})
                  }
                }}
              >
              <Picker.Item label="Mobile Network" value="0"/>
                <Picker.Item label="Ufone" value="ufone" />
                <Picker.Item label="Zong" value="zong" />
                <Picker.Item label="Jazz" value="jazz" />
                <Picker.Item label="Warid" value="warid" />
                <Picker.Item label="Telenor" value="telenor" />
              </Picker>
        </Item>
    </Row>

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20,}}>
        <CheckBox 
            value={check}
            onValueChange={() => {
              check ? setcheck(false) : setcheck(true)
            }}
            style={{borderColor:'#fff', color:'#fff'}}
        />
        <Text style={{color:'#ffffff', marginTop:5}}>
        Do you have a referral code?
        </Text>
    </Row>

    {check && (

    <Row style={{ paddingLeft:20, paddingRight:20, marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Item floatingLabel  style={[{borderStyle:'solid'}, error === 'ref' ? {borderColor:'red'} : {borderColor:'#ffffff'} ]}>
        <Label style={{color:'#ffffff'}}>Referral Code</Label>
        <Input style={{color:'#ffffff'}} value={ref} onChangeText={val => setUser({...user, ref:val})}/>
        </Item>
    </Row>

    )}

    <Row style={{ paddingLeft:20, marginTop:20}}>
        <TouchableOpacity onPress={() => Linking.openURL('https://raaye.com.pk/policy')}>
        <Text style={{color: '#fff', fontSize:16}}>
          By clicking Register, you agree to our Terms and that you have read our <Text style={{color:'blue', fontSize:16, fontWeight:'bold'}}>Policy</Text>
        </Text>
      </TouchableOpacity>
    </Row>


    <Row style={{marginTop:30, justifyContent:'center', alignItems:'center'}}>
      {buttonAction === false ?
    <Button rounded bordered style={{width:'50%', justifyContent:'center', alignItems:'center', borderColor:'#ffffff'}} onPress={Register} disabled={buttonAction}>
      <Icon name='unlock' style={{color:'#ffffff'}}/>
      <Text style={{marginLeft:'-10%', color:'#ffffff'}}>Register</Text>
    </Button>
      :
      <UIActivityIndicator color='white'/>
      }
    </Row>

    <Row style={{width:'85%', marginTop:20, marginLeft:30, justifyContent:'center', marginBottom:'5%', alignItems:'center'}}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
    <Text style={{color:'#ffffff'}} onPress={() => props.navigation.navigate('Login')}>Already have an account? Click Here...</Text>
    </TouchableOpacity>
    </Row>
  </>
      ) : (
        <>
        
        <View>
          <Text>Other Screen</Text>
        </View>
        
        </>
      )}
        
    </Grid>

    
</Content>
    </Container>
  )

}


function validate() {
//Password Validate
const passwordPreg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/

//Email Validate
const emailPreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//name validate
const namePreg = /^[a-z]+$/i

//phone Validate
const phoneReg = /^[0][1-9]\d{9}$|^[1-9]\d{10}$/

    if(check && ref == ''){
        setUser({...user, ref:'', error:'ref'})
        toast('Please Enter Referral Code', 'red') 
    }
    else if(network === ''){
      setUser({...user, network:'', error:'network'})
      toast('Select Network', 'red')
    }
    else if(phone == ''){
      setUser({ ...user, phone:'', error:'phone' })
      toast('Mobile Number Required', 'red')
    }
    else if(phoneReg.test(phone) !== true){
        setUser({ ...user, phone:'', error:'phone'})
        toast('Invalid Mobile Number, eg( 03412584631 )', 'red')
    }
    else if(passwordPreg.test(password) !== true){
      setUser({ ...user, password:'', error:'password' })
      toast('Password must be at least 6 character long and conatin one numeric digit, one uppercase and lowercase letter.', 'red')
    }
    else if(emailPreg.test(email.trim()) !== true){
      setUser({ ...user, email:'', error:'email' })
      toast('Invalid Email Format', 'red')
    }
    else if(dob == ''){
      setUser({...user, dob:'', error:'dob'})
      toast('Date of birth required', 'red')
    }
    else if(gender === ''){
      setUser({...user, gender:'', error:'gender'})
      toast('Select Gender', 'red')
    }
    else if(lname == ''){
      setUser({ ...user, lname:'', error:'lname' })
      toast('Last name required', 'red')
    }
    else if(namePreg.test(lname.trim()) !== true){
      setUser({ ...user, lname:'', error:'lname' })
      toast('Only alphabets are allowed', 'red')
    }
    else if(fname == ''){
      setUser({ ...user, fname:'', error:'fname' })
      toast('First name required', 'red')
    }
    else if(namePreg.test(fname.trim()) !== true){
      setUser({ ...user, fname:'', error:'fname' })
      toast('Only alphabets are allowed', 'red')
    }
    else{
      return true
    }

    }

}
