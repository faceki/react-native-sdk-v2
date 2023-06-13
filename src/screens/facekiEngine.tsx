/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Clipboard
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { TapGestureHandler } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
import CameraComponent from '../components/cameraComponent';
import axios from 'axios';
import Carousel from '../components/customCarousel';
import { Buffer } from "buffer";
import { readFile } from 'react-native-fs';
import { FacekiContext } from '../context/faceki_context';
var RNFS = require('react-native-fs');
import { CommonActions, StackActions } from '@react-navigation/native';
import { postMultiKYC } from '../services/KYCService';
import { LoadingComponent } from '../components/loadingComponet';

// Icon.loadFont();

const OverLayImage = require('../../assets/images/id_detection_bg.png')
const FacekiLogo = require('../../assets/images/logo_faceki.png')


type SectionProps = PropsWithChildren<{
  title: string;
}>;


const FieldNames: any = {
  "ID Card": {
    front: "id_front_image",
    back: "id_back_image"
  },
  "Driving License": {
    front: "dl_front_image",
    back: "dl_back_image"
  },
  "Passport": {
    front: "pp_front_image",
    back: "pp_back_image"
  },
  "selfie": {
    front: "selfie_image"
  }
}

function CameraScreen({ route, navigation }: any): any {


  const { faceki_payload, setFacekiPayload } = useContext(FacekiContext);
  const [loading, setLoading] = useState<boolean>(false)
  const [apiResponse, setApiResponse] = useState<any>(null)


  const SubmitKYC = async (data: any) => {

    setLoading(true)
    let formdata = new FormData()
    let dataToPost = Object.entries(data).map(([key, value]) => {
      return {
        key,
        value
      }
    })


    for (let index = 0; index < dataToPost.length; index++) {
      const element = dataToPost[index];
      formdata.append(element.key, {
        uri: "file://" + element?.value,
        type: 'image/jpeg',
        name: `photo_${element.key}.jpg`,
      });

    }

    postMultiKYC(formdata).then(res => {
   
      if (res?.data?.responseCode == 0) {
        setApiResponse({
          icon: "check",
          color: "green",
          message: "Verified"
        })
      } else {
        setApiResponse({
          icon: "close",
          color: "red",
          message: "Please try again"
        })

      }
      setTimeout(() => {

        setLoading(false)
       setFacekiPayload(null)

      }, 5000);
    }).catch(e => {
      setApiResponse({
        icon: "close",
        color: "red",
        message: "Please try again"
      })
    })

  }



  return (
    <>
      {!loading && <CameraComponent
        documentName={route?.params?.item}
        onCaptureFunc={(data: any) => {
          if (data?.front?.documentName == "ID Card") {
            setFacekiPayload({ ...faceki_payload, id_front_image: data?.front?.path, id_back_image: data?.back?.path })

          } else if (data?.front?.documentName == "Passport") {
            setFacekiPayload({ ...faceki_payload, pp_front_image: data?.front?.path, pp_back_image: data?.back?.path })

          }
          else if (data?.front?.documentName == "Driving License") {
            setFacekiPayload({ ...faceki_payload, dl_front_image: data?.front?.path, dl_back_image: data?.back?.path })

          } else {
            setFacekiPayload({ ...faceki_payload, selfie_image: data?.front?.path })
            SubmitKYC({ ...faceki_payload, selfie_image: data?.front?.path })

          }
          if (route?.params?.item != "selfie") {

            // If not selfie keep navigating
            navigation.navigate("" + ((+route?.params?.indexNumber) + 1))

          }

        }}
        loading={false}
      />}

       {loading && !apiResponse && <LoadingComponent />}

      {
        apiResponse && <View style={{
          backgroundColor: "black", height: "100%", width: "100%", alignContent: "center", justifyContent: "center", alignItems
            : "center"
        }}>
          <Icon name={apiResponse?.icon} size={100} color={apiResponse?.color} />
          <Text style={{ color: "white", "fontSize": 30 }}> {apiResponse?.message}</Text>

        </View>

      }
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlayText: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: "30%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: 'center'
  },
  bottomTextContainer2: {
    position: 'absolute',
    bottom: "10%",
    alignContent: "center",
    alignItems: "center",
    alignSelf: 'center'
  },
  bottomText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
