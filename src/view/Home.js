import React,{ useState,useEffect } from 'react'
import { View, StatusBar, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native'
import { Container, Content, Grid, Row, Col, Tabs, Left, Right } from 'native-base'
import { Card, ListItem, Button, Icon, Overlay } from 'react-native-elements'
import Header from '../components/Header'
import Api from '../utils/Api'
import { getUserData } from '../function/Function'
import { FadeInAnim } from '../components/Animate'
import { UIActivityIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

export default (props) => {

    const [ gri, updateState ] = useState()
    const [ load, updateLoad ] = useState(true)

    useEffect(() => {

        // BackHandler.addEventListener('hardwareBackPress', back);

        setTimeout(() => {
            getData()
          },2000)

          return () => {
            // BackHandler.removeEventListener('hardwareBackPress', back);
          }

    })

    // const back = () => {
    //     Alert.alert("Exit", "Are you sure you want to exit?",
    //      [{ text: "No"},
    //       { text: "Yes", onPress: () => BackHandler.exitApp() }], 
    //       { cancelable: false });  
    //       return true;
    // }


    const getData = async () => {
    const token = await AsyncStorage.getItem('token')
        if(token !== null){
            await Api.get('/survey-main/'+token)
            .then(res => {
                updateState(res.data)
                updateLoad(false)
            })
            .catch(err => console.log(err.response))
        }
    }
    

    const click = (item,des) => {

        let resetAction = StackActions.reset({
            key: undefined,
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'SurveyDetails',params:{survey:item,des:des} })],
        });
        props.navigation.dispatch(resetAction);
    }
    return(

        <Container>
        <StatusBar backgroundColor="#96cd2a" barStyle="default" />
        <Header title='Home' toggle={props.navigation.toggleDrawer}/>
        { load && 
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
        
        <Content style={{ backgroundColor:'#ededed'}}>
            { !load ? (
        <FadeInAnim>

        {gri.map((gri,i) => (
        <Card
        key={i}
        title={gri.title}
        image={gri.image === '' ? require('../assets/img/r.png') : {uri:gri.url+gri.image}}
        imageStyle={{height:130, width:130}}>

        <Row style={{marginTop:10}}>
            <Col style={{width:120, alignItems:'flex-start'}}>
                <Text>Expire In : {gri.expiry_days} Days</Text>
            </Col>

            <Col style={{right:0, alignItems:'flex-end', marginRight:5}}>
                <Text>Date Of Expire : {gri.expiry_date}</Text>      
            </Col>
        </Row>

        <Row style={{marginTop:10}}>
            <Col style={{width:120, alignItems:'flex-start'}}>
                <Text>Cost Type : {gri.cost_type}</Text>
            </Col>

            <Col style={{right:0, alignItems:'flex-end', marginRight:5}}>
                <Text>Price : {gri.price} Rs</Text>     
            </Col>
        </Row>
        


        <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop:10, backgroundColor:'#96cd2a'}}
            onPress={() => click(gri.survey_id,gri.discription)}
            title='Start Survey' />
        </Card>
            ))}
            
            </FadeInAnim>
        ) : null}
        </Content>
        
    </Container>  
    )
}

function survey(id){
    return new Promise(async (resolve,reject) => {
        await Api.get('/survey-get/'+id)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}


const styles = StyleSheet.create({
    GridViewContainer: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        margin: 5,
        borderWidth:1,
        borderColor:'#4388d6',
        backgroundColor: '#fff'
     },
     GridViewTextLayout: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        color: 'gray',
        padding: 10,
      }
})

