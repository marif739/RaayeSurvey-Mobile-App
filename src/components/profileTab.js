import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Profile from '../view/Profile'
import About from '../view/profileAbout'

const AppNavigator = createBottomTabNavigator(  
    {  
        Profile: { 
            screen:Profile, 
        },
        About: {
            screen:About
        }
    },  
    {  
        tabBarOptions: {
            activeTintColor: 'white',
            showIcon: false,  
            showLabel:true,
            style: {  
                backgroundColor:'#96cd2a',
                justifyContent:'center',
                alignItems:'center',  
            }  
        },  
    }  
)  
export default createAppContainer(AppNavigator);  
