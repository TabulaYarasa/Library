import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated';
import { SharedTransition,withSpring } from 'react-native-reanimated';

export default function TrackDetailScreen() {


  const transition = SharedTransition.custom((values) => {
    'worklet';
    return {
      duration: 300,
      height: withSpring(values.targetHeight),
      width: withSpring(values.targetWidth),
    };
  });
  return (
    <View style={styles.container}>
     <Animated.View
        style={{ width: 100, height: 100, backgroundColor: 'green' }}
        sharedTransitionTag="sharedTag"
        sharedTransitionStyle={transition}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  images: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
})