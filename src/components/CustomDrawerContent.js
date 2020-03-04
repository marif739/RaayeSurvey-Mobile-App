import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { Root, Container, Content, Header, Body, Text, Icon, Left, Button, Grid, Row, Col, Right } from "native-base";
import { DrawerItems } from 'react-navigation-drawer'
import AsyncStorage from '@react-native-community/async-storage';
import { getUserData } from '../function/Function'


export const customDrawerContent = (props) => {

    const [ user, setUser ] = useState('')

    getUserData()
        .then(res => {
            setUser(res[0][1]+' '+res[1][1])
        })
        .catch(err => alert('error'))

    return(
    <Container>
          <Row style={{ height: 120, backgroundColor:'#96cd2a', alignItems:'center', justifyContent:'center',  marginBottom:'-2%' }}>
          <Image source={require('../assets/img/back.png')} style={{ width:100, height:100, borderRadius:100 }}/>
          </Row>
          <Row style={{ backgroundColor: '#96cd2a', height: 40, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ color:'#ffffff', fontWeight:'bold'}}>0 points</Text>
          </Row>
      
      <Content>
        <DrawerItems {...props}
        activeTintColor='#2196f3' activeBackgroundColor='rgba(0, 0, 0, .04)'
        inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent'
        style={{backgroundColor: '#000000'}} labelStyle={{ marginLeft:'-3%'}}/>
      </Content>
    </Container>
    )
  }