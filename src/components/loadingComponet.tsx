import { useRef, useEffect } from "react";
import { View ,Animated} from "react-native"



export const LoadingComponent: any = () => {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      startAnimation();
    }, []);
  
  
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
  
    return (
        <View style={{ alignItems: 'center', backgroundColor:"black" , height:"100%", width:"100%", alignContent:"center", justifyContent:"center"}}>
      <Animated.Image
       source={require('../../assets/images/UaYYYS.png')} 
        style={{
          opacity: fadeAnim, // Set the opacity based on the animated value
          width:"100%",  resizeMode: 'contain'
        }}
      />
    </View>
    )
}
    


