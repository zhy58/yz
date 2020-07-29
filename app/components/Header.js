import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import TouchableOpacity from './TouchableOpacity'

export const Header = ({ style, lIcon, rIcon, text, onPressL, onPressR }) => (
  <View style={[styles.header, style]}>
    {buttonView({ onPress: onPressL, icon: lIcon })}
    <Text style={styles.text}>{text}</Text>
    {buttonView({ onPress: onPressR, icon: rIcon })}
  </View>
)

const buttonView = ({ onPress, icon }) => {
  return icon ? (
    <TouchableOpacity onPress={onPress} >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  ) : <Text style={[styles.icon, styles.hideIcon]}>{'\ue6db'}</Text>
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20
  },
  text: {
    fontSize: 18,
    color: '#fff',
    // color: '#444',
  },
  icon: {
    fontFamily: 'iconfont',
    fontSize: 30,
    color: '#fff',
    // color: '#444',
  },
  hideIcon: {
    color: "transparent"
  },
})

export default Header
