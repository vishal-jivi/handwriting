import React from 'react';
import { TouchableOpacity, StyleSheet, Text, } from 'react-native';



export const ActionButton = ({ handleOnPress, buttonName }: any) => {

    return (
        <TouchableOpacity
            style={[styles.setButton, { backgroundColor: 'red' }]}
            onPress={handleOnPress}
        >
            <Text style={styles.text}>{buttonName}</Text>
        </TouchableOpacity>
    )
}




const styles = StyleSheet.create({
    setButton: {
        backgroundColor: 'deepskyblue',
        textAlign: 'center',
        fontWeight: '900',
        color: '#fff',
        width: '14%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: '#fff',
        fontWeight: '900',
    },
})




