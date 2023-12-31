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

import {
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BooksListScreen({navigation}) {
  //const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [])
  );

  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const booksCollection = collection(
      FIRESTORE_DB,
      "users",
      "furkan",
      "books"
    );

    onSnapshot(booksCollection, (snapshot) => {
      const books = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setBooks(books);
    });
  }, []);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const code = data;
    const bookData = await getBookByISBN(code);
    if (!bookData.items) return;
    addBook(bookData.items[0]);
    setShowScanner(false);
    alert(`Bar code with type ${type} and data ${bookData} has been scanned!`);
    console.log(bookData);
  };

  const addBook = async (book) => {
    //   const book = book1.items[0]
    const newBook = {
      bookId: book.id,
      volumeInfo: book.volumeInfo,
      webReaderLink: book.accessInfo?.webReaderLink,
      // textSnippet: book.searchInfo?.textSnippet,
      favorite: false,
      created: serverTimestamp(),
    };
    const db = await addDoc(
      collection(FIRESTORE_DB, "users", "furkan", "books"),
      newBook
    );
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardStyle}
        onPress={() =>
          navigation.navigate("Kitap", {
            id: item.id,
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
            source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
            style={{ width: 50, height: 75 }}
          />
          <View>
            <Text>{item.volumeInfo.title}</Text>
            <Text>{item.volumeInfo.authors[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showScanner && (
        <View>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ width: "100%", height: "100%", elevation: 2, zIndex: 2 }}
          />
          <TouchableOpacity
            style={styles.fab1}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.fabIcon1}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {hasPermission && (
        <TouchableOpacity
          //  setShowScanner(true);
          style={styles.fab}
          onPress={() => {
            setShowScanner(true);
          }}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  absoluteFillObject: {
    width: "100%",
    height: "100%",
    elevation: 2,
    zIndex: 2,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    right: 20,
    backgroundColor: "#03a9f4",
    borderRadius: 30,
    elevation: 8,
  },
  fab1: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    top: 50,
    right: 20,
    backgroundColor: "#03a9f4",
    borderRadius: 30,
    elevation: 8,
    zIndex: 2,
  },
  fabIcon: {
    fontSize: 24,
    color: "#fff",
  },
  fabIcon1: {
    fontSize: 24,
    color: "#fff",
  },
  cardStyle: {
    backgroundColor: "rgba(0,0,0,.04)",
    margin: 5,
    padding: 5,
    borderRadius: 10,
    paddingLeft: 10,
  },
});

///{height: 50,width:"100%", marginTop: 30, backgroundColor:"red", position: "absolute", zIndex: 2 }
