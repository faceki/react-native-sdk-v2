/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, createContext, useMemo, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Animated,
  Alert
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './src/screens/facekiEngine';
import { Camera } from 'react-native-vision-camera'
import 'react-native-gesture-handler';
import {
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import axios from 'axios';
import { FacekiContext } from './src/context/faceki_context';
import { getKycRules } from './src/services/KYCService';
import { LoadingComponent } from './src/components/loadingComponet';






function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  

  // For Handling Images from each scree
  const [faceki_payload, setFacekiPayload] = useState({});
  const value: any = useMemo(
    () => ({ faceki_payload, setFacekiPayload }),
    [faceki_payload]
  );

  const [kycRules, setKycRules] = useState<any>(null)



  useEffect(() => {
    Camera.requestCameraPermission()
  })

  useEffect(() => {

      getKycRules().then(res => {
        let data = res.data.data
        if(!data && !data?.allowedKycDocuments)
        {
          Alert.alert(
            'Workflows',
            'Hi, Looks like your company workflows are not configured! Kindly check the docs!'
          );
          
        }else{
          let allowedDocs: any[] = data?.allowedKycDocuments;
          // Add Extra Screen for Selfie
          allowedDocs.push("selfie")
          data.allowedKycDocuments = allowedDocs
          setKycRules(data)
        }
   
      })
    
  }, [])





  return (

    <GestureHandlerRootView style={styles.root}>
      <FacekiContext.Provider value={value}>


        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>

            {kycRules?.allowedKycDocuments.length > 0 && kycRules?.allowedKycDocuments.map((item: any, index: any) => (
              <Stack.Screen key={index} name={"" + index} component={CameraScreen} initialParams={
                {
                  indexNumber: index,
                  item: item,
                  kycDocs: kycRules?.allowedKycDocuments
                }
              } />
            ))}
            {!kycRules?.allowedKycDocuments && <Stack.Screen key={"index"} name={"index"} component={LoadingComponent} />}


          </Stack.Navigator>
        </NavigationContainer>

      </FacekiContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
