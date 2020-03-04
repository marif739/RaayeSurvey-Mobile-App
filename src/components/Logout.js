import React,{ useEffect } from 'react'
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

export default (props) => {

    //const token = AsyncStorage.getItem('token');
    useEffect(() => {
        AsyncStorage.clear()
        .then(() => props.navigation.navigate('Login'))
    })

    
    return( 
        <View>
        </View>
     )
}