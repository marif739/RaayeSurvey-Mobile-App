import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Home from '../view/Home'
import Profile from '../view/Profile'

const AppNavigator = createMaterialTopTabNavigator(  
    {  
        Home: Home,
        Profile: Profile,
    },  
    {  
        tabBarOptions: {  
            activeTintColor: 'white',  
            showIcon: true,  
            showLabel:true,  
            style: {  
                backgroundColor:'#96cd2a'  
            }  
        },  
    }  
)  
export default createAppContainer(AppNavigator);  
