import React,{ useState,useEffect } from 'react'
import { View, StatusBar, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native'
import { Container, Content, Grid, Row, Col, Tabs } from 'native-base'
import { Card, ListItem, Button, Icon, Overlay } from 'react-native-elements'
import Header from '../components/Header'
import Api from '../utils/Api'
import { getUserData } from '../function/Function'
import { FadeInAnim } from '../components/Animate'
import { UIActivityIndicator } from 'react-native-indicators';
import { StackActions, NavigationActions } from 'react-navigation';

export default (props) => {

    const [ surveyDetail, setSurveyDetails ] = useState({
        description:null,
        surveyID:null
    })

    const { description, surveyID } = surveyDetail
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', back);

      setSurveyDetails({
          description:props.navigation.getParam('des'),
          surveyID:props.navigation.getParam('survey')
      })

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', back);
      }
      
        
    },[])

    const back = () => {
        let resetAction = StackActions.reset({
            key: undefined,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home'})],
        });
        props.navigation.dispatch(resetAction);  
          return true;
    }
    

    const click = () => {
        let resetAction = StackActions.reset({
            key: undefined,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'startSurvey',params:{survey:surveyID} })],
        });
        props.navigation.dispatch(resetAction);
    }
    return(

        <Container>
        <StatusBar backgroundColor="#96cd2a" barStyle="default" />
        <Header title='Terms & Conditions' toggle={props.navigation.toggleDrawer}/>
        
        <Content style={{ backgroundColor:'#ededed'}}>
        <FadeInAnim>

        <Card>
        <View style={{justifyContent:'center'}}>
        <Text style={{marginBottom: 10, alignItems:'center'}}>
            { description }
        </Text>
        </View>
        <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor:'#96cd2a'}}
            onPress={() => click()}
            title='Start Survey' />
        </Card>
            
            </FadeInAnim>
        </Content>
        
    </Container>  
    )
}


