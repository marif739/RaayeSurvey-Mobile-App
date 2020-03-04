import React,{ useState,useEffect } from 'react'
import { View, StatusBar, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler, Share } from 'react-native'
import { Container, Content, Grid, Row, Col, Tabs } from 'native-base'
import { Card, ListItem, Button, Icon, Overlay } from 'react-native-elements'
import Header from '../components/Header'
import Api from '../utils/Api'
import { getUserData } from '../function/Function'
import { FadeInAnim } from '../components/Animate'
import { UIActivityIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

export default (props) => {

    const [ refCode, setRefCode ] = useState('')
    const [ load, updateLoad ] = useState(false)

    useEffect(() => {
        // BackHandler.addEventListener('hardwareBackPress', back);

      return () => {
        // BackHandler.removeEventListener('hardwareBackPress', back);
      }
        
    },[])

    const back = () => {
        // let resetAction = StackActions.reset({
        //     key: undefined,
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'Home'})],
        // });
        // props.navigation.dispatch(resetAction);
    }


    ref()

    function ref(){
        AsyncStorage.getItem('refCode')
        .then(res => setRefCode(res))
        .catch(err => console.log(err))
    }
    

    const click = () => {

    Share.share({
    message: 'Raaye has an awesome Referral Program! Use my referral code "'+refCode+'" to get it',
    url: 'https://raaye.com.pk',
    title: 'Raaye Referral'
    }, {
    dialogTitle: 'Share Referral Code',
    })

    }
    return(

        <Container>
        <StatusBar backgroundColor="#96cd2a" barStyle="default" />
        <Header title='Referral' toggle={props.navigation.toggleDrawer}/>
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

        <Card>
        <View style={{justifyContent:'center'}}>
        <Text style={{marginBottom: 10, alignItems:'center'}}>
            Raaye has an awesome Referral Program! Use my referral code "{refCode}" to get it
        </Text>
        </View>
        <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor:'#96cd2a'}}
            onPress={() => click()}
            title='Share Link' />
        </Card>
            
            </FadeInAnim>
        ) : null}
        </Content>
        
    </Container>  
    )
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

