import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function LottieScreen({ navigation }) {
  const animation = useRef<LottieView>(null);
  const handleDone = () => {
    navigation.navigate("SignIn");
  };
//   const doneButton = ({ ...props }) => {
//     return (
//       <TouchableOpacity style={styles.button} {...props}>
//         <Text>Done</Text>
//       </TouchableOpacity>
//     );
//   };
  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      bottomBarHighlight={false}
      containerStyles={{ paddingHorizontal: 15 }}
      pages={[
        {
          backgroundColor: "#427D9D",
          image: (
            <View style={styles.lottie}>
              <LottieView
                source={require("../../assets/animation1.json")}
                autoPlay
                style={{
                  width: width * 0.9,
                  height: width,
                }}
              />
            
            </View>
          ),
          title: "Scan",
          subtitle:
            "Adding your book is so easy. Just scan the barcode.",
        },
        {
          backgroundColor: "#9BBEC8",
          image: (
            <View style={styles.lottie}>
              <LottieView
                source={require("../../assets/animation2.json")}
                autoPlay
                loop
                style={{
                  width: width * 0.9,
    height: width,
                }}
              />
            </View>
          ),
          title: "Favoritte",
          subtitle:
            "You can filtering your favoritte books. ",
        },
        {
          backgroundColor: "#DDF2FD",
          image: (
            <View style={styles.lottie}>
              <LottieView
                source={require("../../assets/animation3.json")}
                autoPlay
                loop
                style={{
                  width: width * 0.9,
                  height: width,
                }}
              />
            </View>
          ),
          title: "Firiends",
          subtitle:
            "If you wonder you can see what the others people love reading",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  
});
