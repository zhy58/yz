import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TouchableOpacity from './TouchableOpacity'
import SelfText from './Text'

export const IconButton = ({ style, icon, text, color, ...rest }) => (
    <TouchableOpacity {...rest} >
      <View style={[styles.iconBtn, style]}>
        <Text style={[styles.icon, color]}>{icon}</Text>
      </View>
      {text ? <Text style={styles.text}>{text}</Text> : <Text />}
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    iconBtn: {
        width: 50,
        // height: 45,
        overflow: 'hidden',
        // backgroundColor: "#EFEFEF",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    icon: {
      fontFamily: 'iconfont',
      fontSize: 44,
      color: '#444',
    },
    text: {
      color: 'white',
      // backgroundColor: 'yellow',
      position: 'relative',
      top: -27,
      fontSize: 12,
      // paddingVertical: 5,
      // width: 50,
      textAlign: "center",
    },
})

export default IconButton
