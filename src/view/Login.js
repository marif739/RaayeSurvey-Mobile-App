import React,{useState, useEffect} from 'react'
import Api from '../utils/Api'
import { Container, Content, Grid, Col, Row, Item, Input, Icon, Button, Text } from 'native-base';
import { Image, StatusBar, StyleSheet, Keyboard, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { UIActivityIndicator, BallIndicator } from 'react-native-indicators';
import { toast } from '../function/Function'

export default (props) => {

  const [ state, setState ] = useState({
    email:'',
    password:'',
    emailStyleError:false,
    passwordStyleError:false,
    buttonAction:false
  }) 
  const [ load, setLoad ] = useState(false)
  const { email, password, emailStyleError, passwordStyleError, buttonAction } = state
  
  const login = async () => {
    setLoad(true)
    if(validate()){
        Keyboard.dismiss()

          await Api.post('/login', {email, password})
          .then(res => {
              if(res.data.msg == 'success'){
                if(res.data.res.status == '1'){
                  setLoad(true)
                  props.navigation.navigate('Home');
                  setState({ ...state, emailStyleError:false, passwordStyleError:false, buttonAction:true})
                  storeToken(res.data.res)
                }
                else{
                  props.navigation.navigate('Verify',{token:res.data.res.token})
                }
              }
              else{
                setLoad(false)
                  setState({ ...state, buttonAction:false})
                  toast(res.data.res, 'red')
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
    <Container style={styles.container}>
      <StatusBar backgroundColor="#96cd2a" barStyle="default" />
    <Content>
    
    <Grid style={{ justifyContent:'center', alignItems:'center'}}>
    <Row>
    <Col style={{alignItems: 'center', marginTop:100}}>
    <Image source={require('../assets/img/icon.png')} style={{width:180, height:80}} />
    </Col>
    </Row>

      <Row style={{marginTop:40, paddingRight:25, paddingLeft:25}}>
      <Col style={{ alignItems:'center'}}>
        <Item rounded style={[ styles.emailItem, emailStyleError ? styles.emailItemErrorStyle : styles.emailItemStyle ]}>
        <Icon style={ emailStyleError ? styles.emailTextError : styles.emailText } name='mail'/>
        <Input placeholder='Email' style={ emailStyleError ? styles.emailTextError : styles.emailText } placeholderTextColor="#ffffff"
        value={email} onChangeText={val => setState({...state, email:val})}
       />
        </Item>
        </Col>
        </Row>

      <Row style={{marginTop:15, paddingRight:25, paddingLeft:25}}>
      <Col style={{ alignItems:'center'}}>
        <Item rounded style={[ styles.passwordItem, passwordStyleError ? styles.passwordItemErrorStyle : styles.passwordItemStyle ]}>
        <Icon style={ passwordStyleError ? styles.passwordTextError : styles.passwordText } name='key'/>
        <Input placeholder='Password' style={ passwordStyleError ? styles.passwordTextError : styles.passwordText }
         placeholderTextColor="#ffffff" secureTextEntry={true} value={password} 
        onChangeText={val => setState({...state,password:val})}/>
        </Item>
        </Col>
        </Row>

      <Row style={{marginTop:20}}>
        <Col style={{alignItems:'center'}}>
          {buttonAction === false ?
        <Button rounded bordered style={{width:'50%', justifyContent:'center', borderColor:'#ffffff'}} onPress={login} disabled={buttonAction}>
            <Text style={{ color:'#ffffff'}}>Sign in</Text>
          </Button>
          :
          <UIActivityIndicator color='white'/>
          }
        </Col>
      </Row>

      <Row style={{marginTop:30}}>
        <Col style={{marginLeft:'10%'}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
        <Text style={{color:'#ffffff'}} onPress={() => props.navigation.navigate('Signup')}>Sign up</Text>
        </TouchableOpacity>
        </Col>

        <Col style={{marginLeft:'9%'}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('pass')}>
        <Text style={{color:'#ffffff'}} onPress={() => props.navigation.navigate('pass')}>Forgot Password?</Text>
        </TouchableOpacity>
        </Col>
      </Row>
    </Grid>
    
</Content>
    </Container>


  )

}

  function validate(){

    if(password === ''){
      setState({ ...state, password:'', emailStyleError:false, passwordStyleError:true })
      toast('Password required.', 'red')
    }
    else{
      setState({ ...state, emailStyleError:false, passwordStyleError:false })
      return true;
    }

  if(email === ''){
    setState({ ...state, email:'', emailStyleError:true })
    toast('Email required', 'red')
  }
  else{
    setState({ ...state, emailStyleError:false })
    return true;
  }
}

  async function storeToken (userData){
    console.log(userData.ref_code)
    await AsyncStorage.setItem('token', userData.token)
    await AsyncStorage.setItem('fname', userData.fname)
    await AsyncStorage.setItem('lname', userData.lname)
    await AsyncStorage.setItem('email', userData.email)
    await AsyncStorage.setItem('phone', userData.phone)
    await AsyncStorage.setItem('refCode', userData.ref_code)
    await AsyncStorage.setItem('img', JSON.stringify(userData.img))
    await AsyncStorage.setItem('status', JSON.stringify(userData.status))
  }

  function loginUser(email, password ) {
    return new Promise(async ( resolve, reject ) => {
      await Api.post('/login', {email, password})
      .then(res => resolve(res))
      .catch(err => reject(err))
    })
  }


}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#96cd2a'
  },
  emailItem:{
    borderStyle:'solid'
  },
  emailItemErrorStyle:{
    borderColor:'red'
  },
  emailItemStyle:{
    borderColor:'#ffffff'
  },
  emailTextError:{
    color:'red'
  },
  emailText:{
    color:'#ffffff'
  },
  passwordItem:{
    borderStyle:'solid'
  },
  passwordItemErrorStyle:{
    borderColor:'red'
  },
  passwordItemStyle:{
    borderColor:'#ffffff'
  },
  passwordTextError:{
    color:'red'
  },
  passwordText:{
    color:'#ffffff'
  }

})
