import React,{ useEffect, useState } from 'react';
import { Animated, View } from 'react-native'

export const FadeInAnim = (props) => {

    const [fadeAnim] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 2000,
          }
        ).start();
      }, [])

    return(
        <Animated.View                 // Special animatable View
          style={{
            ...props.style,
            opacity: fadeAnim,         // Bind opacity to animated value
          }}
        >
          {props.children}
        </Animated.View>
    );
}