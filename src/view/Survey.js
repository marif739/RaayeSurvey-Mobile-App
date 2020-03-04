import React,{ useState,useEffect } from 'react'
import { View, StatusBar, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { Container, Content, Grid, Row, Col } from 'native-base'
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import Header from '../components/Header'
import Api from '../utils/Api'

export default (props) => {
    
    const [ cat, setCat] = useState();
    const [ load, setLoad ] = useState(true)
    useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
        return props.navigation.navigate('Cat');
    });

    const ca = props.navigation.getParam('survey');
    survey(ca)
    .then(res => {
        setCat(res.data)
        setLoad(false)
    })
    .catch(err => alert(err))
    },[])

    return(
        <Container>
            <StatusBar backgroundColor="#333333" barStyle="default" />
            <Header title='Survey' toggle={props.navigation.toggleDrawer}/>
            <Content>
            {!load &&
            cat.map((l, i) => (
            <ListItem
                key={i}
                title={l.survey.title}
                subtitle={l.survey.title}
                bottomDivider
                onPress={() => props.navigation.navigate('startSurvey',{survey:l.survey.id})}
            />
            ))
            }
            </Content>
        </Container>
    )
}

function survey(id){
    return new Promise(async (resolve, reject) => {
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

