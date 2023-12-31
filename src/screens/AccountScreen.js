import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";

export default function AccountScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [modal, setModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser.uid;
  useEffect(() => {
    const booksCollection = collection(FIRESTORE_DB, "Allusers");

    onSnapshot(booksCollection, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      const currentUser = users.filter((users) => users.id == user);
      setUserInfo(currentUser);
      setEmail(currentUser[0].email);
      setUserName(currentUser[0].userName);
    });
  }, [user]);

  const changeUserName = async () => {
    const userRef = doc(FIRESTORE_DB, `Allusers/${user}`);
    try {
      await updateDoc(userRef, {
        userName: newUserName,
      });
      setModal(!modal);
      setNewUserName("");
    } catch (err) {}
  };

  const handleLogout = () => {
    Alert.alert(
      "Are you sure want to logout", // alert başlığı
      "", // alert mesajı
      [
        // alert düğmeleri
        {
          text: "No", // düğme metni
          // düğmeye basıldığında yapılacak işlem
          style: "default", // düğme stili
        },
        {
          text: "Logout", // düğme metni
          onPress: () => {
            signOut(auth)
              .then(() => {
                console.log("User logged out sussccessfully:");
              })
              .catch((error) => {
                console.log("Error", error);
              });
          }, // düğmeye basıldığında yapılacak işlem
          style: "destructive", // düğme stili
        },
      ]
    );
  };

  const handlePasswordReset = () => {
    Alert.alert(
      "Are you sure want to reset your password", // alert başlığı
      "", // alert mesajı
      [
        // alert düğmeleri
        {
          text: "No", // düğme metni
          // düğmeye basıldığında yapılacak işlem
          style: "default", // düğme stili
        },
        {
          text: "Reset My Password", // düğme metni
          onPress: () => {
            sendPasswordResetEmail(auth, email)
              .then(() => {
                console.log("email başarılı");
                Alert.alert(
                  "Email has been sent", // alert başlığı
                  "", // alert mesajı
                  [
                    // alert düğmeleri
                    {
                      text: "Ok", // düğme metni

                      style: "default", // düğme stili
                    },
                  ]
                );
              })
              .catch((error) => {
                console.log("email başarısız");

                console.error(error);
              });
          }, // düğmeye basıldığında yapılacak işlem
          style: "destructive", // düğme stili
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/user.png")}
          style={styles.images}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.infoHolder}>
          <Text style={styles.text} >{email}</Text>
          <Text style={styles.text}>{userName}</Text>
        </View>
      
        <TouchableOpacity style={styles.button}  onPress={() => setModal(true)}>
          <View style={styles.leftSide}>
            <MaterialCommunityIcons name="account" size={24} color="#6d6c83" />
            <Text>Change User Name</Text>
          </View>
          <AntDesign name="right" size={24} color="#6d6c83" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePasswordReset()}
        >
          <View style={styles.leftSide}>
            <Entypo name="lock" size={24} color="#6d6c83" />
            <Text>Change Password</Text>
          </View>
          <AntDesign name="right" size={24} color="#6d6c83" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleLogout()}>
          <View style={styles.leftSide}>
            <MaterialIcons name="logout" size={24} color="#6d6c83" />
            <Text>Logout</Text>
          </View>
          <AntDesign name="right" size={24} color="#6d6c83" />
        </TouchableOpacity>

        <Modal animationType="slide" transparent={false} visible={modal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Change the user name</Text>
              <TextInput
                mode="outlined"
                style={{ width: 200, margin: 15 }}
                label="New User Name"
                value={newUserName}
                onChangeText={(text) => setNewUserName(text)}
              />
              <View style={{ flexDirection: "row" }}>
                <Button
                  style={{ marginRight: 15 }}
                  mode="elevated"
                  onPress={() => setModal(!modal)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: 15 }}
                  mode="contained"
                  onPress={() => changeUserName()}
                >
                  OK
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },

  leftSide: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(0,0,0,.04)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  images: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: 300,
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  infoHolder: {
    marginVertical: 20,
    alignItems: "center",
    marginBottom:50
  },
  text: {
    fontWeight: "bold",
    marginVertical:3,

  }
});

///{height: 50,width:"100%", marginTop: 30, backgroundColor:"red", position: "absolute", zIndex: 2 }
