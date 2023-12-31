import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Image,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { getBookByISBN } from "../../api/books";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function OthersBooksScreen({ navigation, route }) {
  //const navigation = useNavigation();
  const { id } = route.params;

  const [books, setBooks] = useState([]);
  const [emptyCheck, setEmptyCheck] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser.uid;
  const STOCK_PIC =
    "https://firebasestorage.googleapis.com/v0/b/my-book-project-4cf0f.appspot.com/o/blank-book-cover-over-png.png?alt=media&token=ce4c1983-ced3-491c-a99b-1822bcccfa2e";

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = await user.uid;
        console.log("current user " + uid);
      } else {
        console.log("no ussers");
        navigation.navigate("SignFlow");
      }
    });
  }, [user]);

  useEffect(() => {
    const booksCollection = collection(FIRESTORE_DB, `users/${id}/books`);

    onSnapshot(booksCollection, (snapshot) => {
      const books = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      setBooks(books);
    });
  }, []);

  useEffect(() => {
    if (books == null || books.length == 0) {
      console.log("boş buralar");
      setEmptyCheck(false);
    } else {
      console.log("buralarda mevsim yaz mı");
      console.log(books);
      setEmptyCheck(true);
    }
  });
  console.log(emptyCheck);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardStyle}
        onPress={() =>
          navigation.navigate("OthersKitap", {
            userId : id,
            id: item.id,
            name: item.volumeInfo.title,
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={{
              uri: item.url // resmin kaynağını belirle
                ? item.url // eğer objenin imageLinks katoloğu varsa, oradan al
                : STOCK_PIC, // eğer yoksa, sabit bir URL ver
            }}
            style={{ width: 50, height: 75 }}
          />

          <View>
            <Text
              style={{ fontWeight: "bold", marginBottom: 10, fontSize: 15 }}
            >
              {item.volumeInfo.title}
            </Text>
            <Text>{item.volumeInfo.authors[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {emptyCheck ? <Text style={styles.header}>Books</Text> : null}

      {emptyCheck ? (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontWeight: "bold" }}>
            This user hasn't add books yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },

  header: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 25,
    marginBottom: 10,
  },

  cardStyle: {
    backgroundColor: "rgba(0,0,0,.04)",
    margin: 5,
    padding: 5,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
