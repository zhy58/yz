import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'

import TouchableOpacity from './TouchableOpacity'
import Image from './Image'

const { width } = Dimensions.get("window")
export const ImageButton = ({ style, imgStyle, source, text, ...rest }) => (
    <View>
        <TouchableOpacity style={[styles.btn, style]} {...rest}>
            <Image source={source} style={[styles.img, imgStyle]} />
        </TouchableOpacity>
        <Text style={styles.marginV5}>{text}</Text>
    </View>
)

const styles = StyleSheet.create({
    btn: {
        height: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#000",
        overflow: "hidden",
        borderWidth: 0.5,
        borderColor: '#f2f2f2',
        color: '#444',
        borderRadius: 8
    },
    img: {
        height: 150,
        width: width - 60
    },
    marginV5: {
        marginVertical: 8,
        textAlign: "center",
        color: '#fff',
        // color: '#444',
        fontSize: 18,
    },
})

export default ImageButton
