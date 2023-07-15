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
  PermissionsAndroid,
  Alert
} from 'react-native';
import SignatureScreen from "react-native-signature-canvas";
import WebView from 'react-native-webview';
import RNFetchBlob from "rn-fetch-blob";

const STROKES = [
  {
    number: '1',
    height: 30,
    width: 30,
    radius: 15
  },
  {
    number: '2',
    height: 35,
    width: 35,
    radius: 17.5
  },
  {
    number: '3',
    height: 40,
    width: 40,
    radius: 20
  },
  {
    number: '4',
    height: 45,
    width: 45,
    radius: 22.5,
  },
  {
    number: '5',
    height: 50,
    width: 50,
    radius: 25
  },
  {
    number: '6',
    height: 55,
    width: 55,
    radius: 27.5
  },
  {
    number: '7',
    height: 60,
    width: 60,
    radius: 30
  }
];

const STROKECOLOR = ['black', '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082']


function App(): JSX.Element {
  const ref: any = React.useRef();
  const [signature1, SetSignature] = useState('')
  const [colorText, setPenColor] = useState('black');
  const [penSize, setPenSize] = useState('1');

  const handleColorChange = () => {
    ref.current.changePenColor(colorText);
  };
  const handleOK = (signature: any) => {
    SetSignature(signature)
    // onOK(signature); // Callback from Component props
  };
  const handleUndo = () => {
    ref.current.undo();
  };

  const handleRedo = () => {
    ref.current.redo();
  };

  const handleClear = () => {
    ref.current.clearSignature()
    SetSignature('')
  };

  const onColorChange = (e: any) => {
    console.log(e);
    ref.current.changePenColor(e)

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

  const handleSave = async (signature: any) => {
    ref.current.readSignature()	
  
    if (Platform.OS === 'android') {
      var isReadGranted: any = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to read files',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
    }
    if (isReadGranted === PermissionsAndroid.RESULTS.GRANTED) {
      const dirs = RNFetchBlob.fs.dirs
      var image_data = signature.split('');
      const filePath = dirs.DownloadDir + "/" + 'signture' + new Date().getMilliseconds() + '.png'
      console.log(image_data, filePath , image_data.slice(0,8));
      
      RNFetchBlob.fs.writeFile(filePath, image_data.slice(0,8).toString(), 'base64')
        .then(() => {
          // Alert("Successfuly saved to" + filePath)
          Alert.alert( 'Hurray...!!!','Successfuly saved to' + filePath, [
            
            {text: 'OK'},
          ]);
        })
        .catch((errorMessage) => {
          Alert.alert( 'OOPSSSSS...!!!','Something went wrong' + errorMessage, [
            
            {text: 'OK'},
          ]);
        })
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text>Draw Here</Text>
      <SignatureScreen
        ref={ref}
        onOK={handleSave}
        onClear={handleClear}
        // onGetData	={handleOK}
        penColor={colorText}
        autoClear={true}
        dotSize={0}
        style={{ borderColor: 'black', borderWidth: 3, borderStyle: 'solid', maxHeight: 310 }}
        webStyle='.m-signature-pad {box-shadow: none; border: none ; .m-signature-pad--body {border: none;}.m-signature-pad--footer {display: none; margin: 0px;} body,html { height: 100%; 
         }'
      />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 15 }}>
        <TouchableOpacity
          style={[styles.setButton, { backgroundColor: 'red' }]}
          onPress={onDraw}
        >
          <Text style={styles.text}>Pen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { backgroundColor: 'red' }]}
          onPress={onErase}
        >
          <Text style={styles.text}>Erase</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { backgroundColor: 'red' }]}
          onPress={handleUndo}
        >
          <Text style={styles.text}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { backgroundColor: 'red' }]}
          onPress={handleRedo}
        >
          <Text style={styles.text}>Redo</Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.setButton, { backgroundColor: 'red' }]}
          onPress={handleClear}
        >
          <Text style={styles.text}>Clear</Text>
        </TouchableOpacity>
      </View>
      <Text>Select Stroke here</Text>
      <View style={[styles.row, { display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }]}>
        {STROKES.map((stroke) => {
          return (
            <TouchableOpacity
              onPress={() => onPenSizeChange(stroke.number)}
              style={{ width: stroke.width, height: stroke.height, backgroundColor: stroke.number === penSize ? colorText : '#fff', borderRadius: stroke.radius, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{color: stroke.number !== penSize ? 'black' : '#fff'}}> {stroke.number} </Text>
            </TouchableOpacity>
          )
        })}



      </View>
      <Text>Select color here</Text>
      <View style={[styles.row, { display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }]}>
        {STROKECOLOR.map((color) => {
          return (
            <TouchableOpacity
              onPress={() => onColorChange(color)}
              style={[{ width: 40, height: 40, backgroundColor: color, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }, color === colorText ? { borderWidth: 4, borderColor: color === 'black' ? '#fff' : 'black' } : {}]}
            >
            </TouchableOpacity>
          )
        })}



      </View>
      <View style={[styles.row]}>
        <TouchableOpacity
          style={[styles.setButton, { marginRight: 30, backgroundColor: 'red', width: '50%' }]}
          onPress={handleSave}
        >
          <Text style={styles.text}>Save To Gallery</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.preview}>
        {signature1 ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 'auto', height: 114 }}
            source={{ uri: signature1 }}
          />
        ) : null}
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6e5e3',
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    width: 335,
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
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
    width: '14%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default App;
