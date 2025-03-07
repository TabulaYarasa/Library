//onPress={() => navigation.navigate("MainFlow")}

import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

const primaryColor = "rgb(22 163 74)"

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const [userName, setUserName] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [visibility1, setVisibility1] = useState(true);
  const alert = () => {
    Alert.alert(
      "Password must be the same", // alert başlığı
      "And you had to be set a username",
      [
        {
          text: "Ok", // düğme metni
          onPress: () => console.log("İptal edildi"), // düğmeye basıldığında yapılacak işlem
          style: "default", // düğme stili
        },
      ]
    );
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) => {
        const user = userCredential.user;

        const userDocRef = doc(FIRESTORE_DB, "Allusers", user?.uid);
        setDoc(userDocRef, {
          email: email,
          userName: userName,
        });
        navigation.navigate("MainFlow");
      });
    } catch (error) {
      alert("Sign up failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#6d6c83" />
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#6d6c83" />
          <TextInput
            style={styles.input}
            value={userName}
            placeholder="User Name"
            autoCapitalize="none"
            onChangeText={(text) => setUserName(text)}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#6d6c83" />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={visibility}
          ></TextInput>
           <TouchableOpacity onPress={() => setVisibility(!visibility)}>
            <MaterialIcons name={visibility ? "visibility" : "visibility-off"} size={24} color="#6d6c83" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#6d6c83" />
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            value={passwordAgain}
            placeholder="Password Again"
            autoCapitalize="none"
            onChangeText={(text) => setPasswordAgain(text)}
            secureTextEntry={visibility1}
          ></TextInput>
           <TouchableOpacity onPress={() => setVisibility1(!visibility1)}>
            <MaterialIcons name={visibility1 ? "visibility" : "visibility-off"} size={24} color="#6d6c83" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: "red", marginBottom: 20 }}>
          {password === passwordAgain ? "" : "Password cannot be different"}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={
                (password === passwordAgain) & (userName != null)
                  ? signUp
                  : alert
              }
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate("SignIn")}
              >
                Login
              </Text>
            </Text>
            {/* <Button title="Create account" onPress={signUp} /> */}
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    flex: 1,
  },

  
 
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 16,
    textAlign: "center",
    color: "#333333",
  },

  signupButton: {
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  loginLink: {
    color: primaryColor,
    fontWeight: "bold",
  },
  inputContainer: {
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
});
