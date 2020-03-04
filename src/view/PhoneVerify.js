import React, { useState, useEffect } from 'react'
import Api from '../utils/Api'
import { Container, Content, Grid, Col, Row, Item, Input, Button, Text } from 'native-base';
import { Image, StatusBar, Keyboard, Alert } from 'react-native';
import { toast } from '../function/Function'
import { UIActivityIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserData } from '../function/Function'


export default (props) => {
        const [ verify, setVerify ] = useState({
            code:'',
            token:'',
            error:false
        })

    useEffect(() => {  
        
      AsyncStorage.getItem('token')
        .then(res => {
          const id = res;
            Api.get('/phoneVerify/'+id+'/send')
            .then(res => {
              //console.log(res._response);
                //if(res.data.msg == 'success'){
                    setVerify({...verify, token:res})
                // }
                // else{
                //     toast(res.data.msg, 'red')
                // }
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

    }, [])

    const {  code, token, error } = verify

    const verifyCode = () => {
        setVerify({...verify, error:true})
        if(code === ''){
            toast('Verification Code Required', 'red')
            setVerify({...verify, error:false})
        }
        else{
            Keyboard.dismiss()
            AsyncStorage.getItem('token')
            .then(res => {
              const id = res;
                Api.get('/phoneVerify/'+id+'/verify/'+code)
                .then(res => {
                    if(res.data.msg == 'success'){
                      setVerify({ ...verify, error:true})
                      Alert.alert(
                        'Verification',
                        'Mobile number verified successfull.',
                        [
                          {text: 'OK', onPress: () => props.navigation.navigate('Profile',{update:'update'})},
                        ],
                        {cancelable: false},
                      );

                      setTimeout(() => {
                        props.navigation.navigate('Profile')
                      }, 5000);
                    }
                    else{
                      setVerify({ ...verify, error:false})
                      toast(res.data.msg, 'red')
                    }
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))


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
            Phone not verified. Press Below Button To Verify.
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
          await Api.get('/phoneVerify/'+id+'/verify/'+code)
          .then(res => resolve(res))
          .catch(err => reject(err))
        })
      }

}