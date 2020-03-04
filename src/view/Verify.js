import React, { useState, useEffect } from 'react'
import Api from '../utils/Api'
import { Container, Content, Grid, Col, Row, Item, Input, Button, Text } from 'native-base';
import { Image, StatusBar, Keyboard } from 'react-native';
import { toast } from '../function/Function'
import { UIActivityIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';


export default (props) => {
        const [ verify, setVerify ] = useState({
            code:'',
            error:false
        })

    const {  code, error } = verify

    const verifyCode = () => {
        if(code === ''){
            toast('Verification Code Required', 'red')
            setVerify({...verify, error:false})
        }
        else{
          setVerify({...verify, error:true})
            Keyboard.dismiss()
            const token = props.navigation.getParam('token');
            verifyUser( code, token )
          .then((res) => {
            if(res.data.msg === 'success'){
                setVerify({ ...verify, error:true})
                storeToken (res.data.res)
                setTimeout(() => {
                  props.navigation.navigate('Home')
                }, 1000);
            }
            else{
                setVerify({ ...verify, error:false})
                toast(res.data.msg, 'red')
            }
          })
          .catch(err => alert(err))
        }
    }
    return(

        <Container style={{ flex:1, backgroundColor:'#333333'}}>
      <StatusBar backgroundColor="#333333" barStyle="default" />
    <Content>
    
    <Grid style={{ justifyContent:'center', alignItems:'center'}}>
    <Row>
    <Col style={{alignItems: 'center', marginTop:100}}>
    <Image source={require('../assets/img/icon.png')} style={{width:180, height:80}} />
    </Col>
    </Row>

    <Row style={{alignItems:'center', justifyContent:'center', marginTop:30}}>
        <Col style={{width:'80%'}}>
        <Text style={{textAlign:'center', color:'#ffffff', fontSize:16}}>
            An email has been sent to your email with verification code.
        </Text>
        </Col>
    </Row>

      <Row style={{marginTop:30, paddingRight:25, paddingLeft:25}}>
      <Col style={{ alignItems:'center'}}>
        <Item rounded style={{ borderStyle:'solid', borderColor:'#ffffff', alignItems:'center'}}>
        <Input placeholder='Code' style={{ color:'#ffffff', textAlign:'center' }} placeholderTextColor="#ffffff"
        value={code} onChangeText={val => setVerify({...verify, code:val})}
       />
        </Item>
        </Col>
        </Row>

      <Row style={{marginTop:20}}>
        <Col style={{alignItems:'center'}}>
          {error === false ? 
        <Button rounded bordered style={{width:'50%', justifyContent:'center', borderColor:'#ffffff'}} disabled={error} onPress={verifyCode}>
          <Text style={{ color:'#ffffff'}}>Verify</Text>
        </Button>
          :
        <UIActivityIndicator color='white'/>
          }
        </Col>
      </Row>

    </Grid>
    
</Content>
    </Container>

    )

    function verifyUser(code, id) {
        return new Promise(async ( resolve, reject ) => {
          await Api.post('/verify', { code, id })
          .then(res => resolve(res))
          .catch(err => reject(err))
        })
      }

      async function storeToken (userData){
        await AsyncStorage.setItem('token', userData.token)
        await AsyncStorage.setItem('fname', userData.fname)
        await AsyncStorage.setItem('lname', userData.lname)
        await AsyncStorage.setItem('email', userData.email)
        await AsyncStorage.setItem('phone', userData.phone)
        await AsyncStorage.setItem('refCode', userData.ref_code)
        await AsyncStorage.setItem('img', JSON.stringify(userData.img))
        await AsyncStorage.setItem('status', JSON.stringify(userData.status))
      }
}