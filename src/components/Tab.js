import React from 'react'
import { View, StatusBar, StyleSheet, Text } from 'react-native'
import { Icon } from 'native-base';
import { createAppContainer } from 'react-navigation';
import Tab from './TabNavigator';

const AppNavigator = createAppContainer(Tab);

export default (props) => {
    return(  
        <View style={{flex:1}} >  
            <StatusBar  
                backgroundColor='red'  
                barStyle='light-content'  
            />  
            <View style={styles.header}>  
            <Icon name='menu' />
            </View>  
            <AppNavigator/>  
        </View>  
    )  
}

const styles = StyleSheet.create({  
    wrapper: {  
        flex: 1,  
    },  
    header:{  
        flexDirection: 'row',  
        alignItems: 'center',  
        justifyContent: 'space-between',  
        backgroundColor: 'red',  
        paddingHorizontal: 18,  
        paddingTop: 5,  
    }  
});  