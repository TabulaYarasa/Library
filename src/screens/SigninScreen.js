import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
const primaryColor = "rgb(22 163 74)"
export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(true);

  const auth = getAuth();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("MainFlow");
      });
    } catch (error) {
      const errorCode = error.errorCode;
      const errorMessage = error.errorMessage;
      alert("Sign in failed" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.title}>Welcome Back!</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#6d6c83" />
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Entypo name="lock" size={24} color="#6d6c83" />
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

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={signIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate("SignUp")}
              >
                Sign up
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



  signupLink: {
    color: primaryColor,
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: primaryColor,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 16,
    textAlign: "center",
    color: "#333333",
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
