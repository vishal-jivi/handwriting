/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid
} from 'react-native';
import SignatureScreen from "react-native-signature-canvas";
import WebView from 'react-native-webview';
import RNFetchBlob from "rn-fetch-blob";


function App(): JSX.Element {
  const ref : any = React.useRef();
  const [signature1, SetSignature] = useState('')
  const [colorText, setPenColor] = useState("");
  const [penSize, setPenSize] = useState('1');

  const handleColorChange = () => {
    ref.current.changePenColor(colorText);
  };
  const handleOK = (signature: any) => {
    console.log(signature);
    SetSignature(signature)
    // onOK(signature); // Callback from Component props
  };
  const handleUndo = () => {
    console.log(ref.current,'------------')
    ref.current.undo();
  };
  
  const handleRedo = () => {
    ref.current.redo();
  };
  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  const handleEnd = () => {
    // ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data: any) => {
    console.log(data);
  };

  const onColorChange = (e: any) => {
    setPenColor(e)
  }

  const onPenSizeChange = (e: any) => {
    let size = parseInt(e)
    ref.current.changePenSize(e, e)
    setPenSize(e)
  }

  const onErase = () => {
    ref.current.erase();
  }

  const onDraw = () => {
    ref.current.draw();
  }

  const handleSave = async () => {
    if (Platform.OS === 'android') {
      console.log('in anroid ')
    var isReadGranted : any = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to read files',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
    }
    console.log('in anroid ',  isReadGranted)

    if (isReadGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const dirs = RNFetchBlob.fs.dirs
      var image_data = signature1.split('data:image/png;base64,');
      console.log(image_data, signature1, '///////////');
      
      const filePath = dirs.DownloadDir+"/"+'signture'+new Date().getMilliseconds()+'.png'
      RNFetchBlob.fs.writeFile(filePath, image_data[1], 'base64')
      .then(() => {
        console.log("Successfuly saved to"+ filePath)
      })
      .catch((errorMessage) =>{
        console.log('Error in file saving to gallery', errorMessage)
      })      }
    }


  return (
    <SafeAreaView style={styles.container}>
      <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        penColor={colorText}
        onGetData={handleData}
        autoClear={true}
        descriptionText={'text'}
        dotSize={0}
        // onChangePenSize={ref.current.changePenSize(10, 10)}
      />
      <TouchableOpacity
          style={[styles.setButton, { marginRight: 30, backgroundColor: 'red' }]}
          onPress={handleSave}
        >
          <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
       <View style={styles.row}>
        <TouchableOpacity
          style={[styles.setButton, { marginRight: 30, backgroundColor: 'red' }]}
          onPress={onErase}
        >
          <Text style={styles.text}>Erase</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Specify Pen Color"
          style={styles.textInput}
          autoCapitalize="none"
          value={penSize}
          onChangeText={(e)=> {onPenSizeChange(e)} }/>
        <TouchableOpacity
          style={styles.setButton}
          onPress={handleColorChange}
        >
          <Text style={styles.text}>Set</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { marginLeft: 30, backgroundColor: 'red' }]}
          onPress={onDraw}
        >
          <Text style={styles.text}>Pen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.setButton, { marginRight: 30, backgroundColor: 'red' }]}
          onPress={handleUndo}
        >
          <Text style={styles.text}>Undo</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Specify Pen Color"
          style={styles.textInput}
          autoCapitalize="none"
          value={colorText}
          onChangeText={(e)=> {onColorChange(e)} }/>
        <TouchableOpacity
          style={styles.setButton}
          onPress={handleColorChange}
        >
          <Text style={styles.text}>Set</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { marginLeft: 30, backgroundColor: 'red' }]}
          onPress={handleRedo}
        >
          <Text style={styles.text}>Redo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.preview}>
        {signature1 ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 'auto', height: 114 }}
            source={{ uri: signature1 }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 335,
    // height: 114,
    // backgroundColor: "#F8F8F8",
    justifyContent: "center",
    // alignItems: "center",
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5
    },
    textSign: {
      color: 'deepskyblue',
      fontWeight: 'bold',
      paddingVertical: 5,
    },
    text: {
      color: '#fff',
      fontWeight: '900',
    },
    textInput: {
      paddingVertical: 10,
      textAlign: 'center'
    },
    setButton: {
      backgroundColor: 'deepskyblue',
      textAlign: 'center',
      fontWeight: '900',
      color: '#fff',
      marginHorizontal: 10,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
    }
});

export default App;
