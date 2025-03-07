import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { onSnapshot, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function FavBookScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser.uid;


  useEffect(() => {
    const userCollection = collection(FIRESTORE_DB, "Allusers");

    onSnapshot(userCollection, (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      const otherUsers = users.filter((users) => users.id !=  currentUser)
      setUser(otherUsers);
    });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardStyle}
        onPress={() => {
          navigation.navigate("OthersBooks", {
            id: item.id,
            name: item.userName,
            
          });
        }}
      >
        <View
          style={{
            gap: 20,
            justifyContent: "center",
            height: 50,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              textAlignVertical: "center",
            }}
          >
            {item.userName}
          </Text>
      
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>


      <Text style={styles.header}>Users</Text>
      <FlatList
        data={user}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  cardStyle: {
    backgroundColor: "rgba(0,0,0,.04)",
    margin: 5,
    padding: 5,
    borderRadius: 10,
    paddingLeft: 10,
  },
  header: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 25,
    marginBottom: 10,
  
  
  },
});
