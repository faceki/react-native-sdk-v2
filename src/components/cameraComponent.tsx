/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { runOnJS } from 'react-native-reanimated';

import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Camera, CameraPermissionStatus, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import 'react-native-reanimated';
import { useFrameCallback } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
// Icon.loadFont();
import { labelImage } from "vision-camera-image-labeler";
import { scanFaces, Face } from 'vision-camera-face-detector';
import { Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { FacekiContext } from '../context/faceki_context';


const OverLayImage = require('../../assets/images/id_detection_bg.png')
const OverLayImageSelfie = require('../../assets/images/face_capture_bg.png')
const FacekiLogo = require('../../assets/images/logo_faceki.png')


interface CameraComponent {
    documentName: String,
    onCaptureFunc: Function,
    loading: Boolean,
    index?: any
}

function CameraComponent(props: CameraComponent): JSX.Element {
    const { faceki_payload, setFacekiPayload } = useContext(FacekiContext);

    const devices: any = useCameraDevices()
    const device: any = devices.back
    const camera = useRef<Camera>(null)
    const [captured, setCaptured] = useState(null)
    const [captureMode, setCaptureMode] = useState<any>(true)
    const isFocused = useIsFocused()

    const [frontImage, setFrontImage] = useState<any>(null)
    const [backImage, setBackImage] = useState<any>(null)
    const [capturedImage, setCapturedImage] = useState<any>(null)
    const [side, setSide] = useState<any>("Front")

  

    const captureImage = async () => {
        // If Selfie Last Step
        if (props?.documentName == "selfie") {
            var photo: any = await camera.current?.takePhoto()


            props?.onCaptureFunc({
                front: { documentName: props?.documentName, ...photo },
            })
            return;

        }
        var photo: any = await camera.current?.takePhoto()
        // Otherwise
        if (!frontImage) {
            setFrontImage(photo)
        } else {
            setBackImage(photo)
        }
        setCapturedImage(await fetchImage(`file://${photo.path}`))
        setCaptureMode(false)

    }


    const fetchImage = async (uri: string) => {
  



        const imageResponse = await fetch(uri);
        const imageBlob = await imageResponse.blob();


        const base64Data = await blobToBase64(imageBlob);

        return base64Data
    };

    const blobToBase64 = (blob: any): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                resolve(String(reader.result));
            };
            reader.readAsDataURL(blob);
        });
    };

    const reTakePhoto = () => {
   
        if (side == "Front") {
            setFrontImage(null)
            setCaptureMode(true)
            setCapturedImage(null)
        } else {
            setBackImage(null)
            setCaptureMode(true)
            setCapturedImage(null)
        }

    }
    const LooksGood = () => {
        if (side == "Front") {
            setSide("Back")
            setCaptureMode(true)
            setCapturedImage(null)
        } else {
            // Once Front And Back Image is done
            props?.onCaptureFunc({
                front: { documentName: props?.documentName, ...frontImage },
                back: { documentName: props?.documentName, ...backImage }
            })
        }
    }




    useEffect(() => {

        if(!faceki_payload)
        {
            setCaptureMode(true);
            setCapturedImage(null)
            setSide("Front")
        }
      

    }, [faceki_payload])


    if (device) {
        return (
            < >
                {captureMode &&
                    <>
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={props?.documentName != "selfie" ? devices.back : devices.front}
                            isActive={isFocused}
                            ref={camera}
                            focusable={true}
                            photo={true}

                            // frameProcessor={frameProcessor}
                        >




                        </Camera>
                        <ImageBackground style={StyleSheet.absoluteFill} source={props?.documentName != "selfie" ? OverLayImage : OverLayImageSelfie} >
                            <View style={{ flex: 1, justifyContent: "flex-start", "alignContent": "center", flexDirection: "column", marginTop: "15%" }}>
                                <Image style={{ alignSelf: "center", resizeMode: "contain", width: "50%" }} source={FacekiLogo} />
                                <Text style={{ textAlign: "center", color: "yellow" }}> Scan Your {props?.documentName}  {props?.documentName != "selfie" ? side : ""}</Text>

                            </View>
                            <View style={!captured ? styles.bottomTextContainer : styles.bottomTextContainer2}>
                                {!captured && <TouchableOpacity style={styles.button} onPress={async () => { captureImage() }}>
                                    <Icon name="camera" size={30} color="white" />
                                </TouchableOpacity>}
                            </View>

                        </ImageBackground>
                    </>
                }
                {!captureMode &&
                    <View style={{ height: "100%", width: "100%" }}>
                        <ImageBackground
                            source={{ uri: capturedImage }}
                            style={styles.baseImage}
                        >
                            <ImageBackground
                                source={props?.documentName != "selfie" ? OverLayImage : OverLayImageSelfie}
                                style={styles.overlayImage}
                            >

                                <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-end', marginBottom: "45%" }}>
                                    <View style={{ marginBottom: 10, flexDirection: "column" }}>
                                        <Text style={{ textAlign: "center", color: "white" }}>Retake?</Text>
                                    </View>
                                    <View style={{ marginBottom: 10, flexDirection: "column" }}>
                                        <TouchableOpacity style={{ alignContent: "center", alignSelf: "center" }} onPress={() => {
                                            reTakePhoto()
                                        }}>
                                            <IconSimple name="reload" size={30} color="red" />
                                        </TouchableOpacity>
                                    </View>


                                    <View style={{ paddingTop: 10, flexDirection: "column" }}>
                                        <Text style={{ textAlign: "center", color: "white" }}>Look Good?</Text>
                                    </View>
                                    <View style={{ paddingTop: 10, flexDirection: "column" }}>
                                        <TouchableOpacity style={{ alignContent: "center", alignSelf: "center" }} onPress={() => {
                                            LooksGood()
                                        }}>
                                            <IconSimple name="check" size={30} color="yellow" />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </ImageBackground>
                        </ImageBackground>
                    </View>
                }



            </>)
    } else {
        return <></>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    preview: {
        flex: 1
    },

    baseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlayImage: {
        position: 'absolute',
        // top: 50,
        // left: 50,
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
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

export default CameraComponent;
