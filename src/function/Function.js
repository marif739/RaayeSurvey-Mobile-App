import React from 'react';
import Api from '../utils/Api'
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';


export const isSignedIn = async () => {
        // AsyncStorage.getItem('token')
        // .then(res => {
        //   Api.get('/check-status/'+res)
        //   .then(re => {
        //     if(re.data.msg === 'success'){
        //       resolve(true)
        //     }
        //     else{
        //       resolve(false)
        //     }
        //   })
        //   .catch(err => alert(err))
        // })
        // .catch(err => reject(err))

        const res = await AsyncStorage.getItem('token')
        if(res !== null) {
          Api.get('/check-status/'+res)
          .then(re => {
                if(re.data.msg === 'success'){
                  return 'login'
                }
                else{
                  return 'deactivate'
                }
              })
          .catch(err => alert(err))
        }
        else{
          return 'logout'
        }
}

export function toast(text, color) {
  Toast.show({
    text: text,
    duration:5000,
    textStyle : { color: color },
    buttonText: 'Okay',
    position: "top"
  })
}

export const getUserData = () => {
    return new Promise(( resolve, reject) => {
        AsyncStorage.multiGet(['fname','lname','email','phone','img','status','token'])
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}