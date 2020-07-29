import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Picker from '@gregfrench/react-native-wheel-picker'

const PickerItem = Picker.Item

export const SelfPicker = ({ data, ...rest }) => (
  <Picker style={styles.picker}
    itemSpace={30}
    itemStyle={styles.itemStyle}
    {...rest}
  >
    {data.map((value, i) => (
      <PickerItem label={value} value={i} key={"money"+value}/>
    ))}
  </Picker>
)

const styles = StyleSheet.create({
  picker: {
    width: 32,
    height: 180
  },
  itemStyle: {
    color: '#444',
    fontSize: 26,
    // fontWeight: "500"
  },
})

export default SelfPicker
