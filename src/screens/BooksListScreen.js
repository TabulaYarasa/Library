import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { getBookByISBN } from "../../api/books";
import { Ionicons } from "@expo/vector-icons";
import {
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function BooksListScreen({ navigation }) {
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
  const [hasPermission, setHasPermission] = useState(null);
  const [books, setBooks] = useState([]);
  const [favBook, setFavBook] = useState([]);
  const [favorite, setFavorite] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser?.uid;
  const STOCK_PIC =
    "https://firebasestorage.googleapis.com/v0/b/my-book-project-4cf0f.appspot.com/o/blank-book-cover-over-png.png?alt=media&token=ce4c1983-ced3-491c-a99b-1822bcccfa2e";

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current user:", user.uid);
      } else {
        navigation.navigate("SignFlow");
      }
    });
  }, [auth, navigation]);

  useEffect(() => {
    if (!user) return;
    const booksCollection = collection(FIRESTORE_DB, `users/${user}/books`);
    onSnapshot(booksCollection, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredBooks = booksData.filter((book) => book.favorite);
      setBooks(booksData);
      setFavBook(filteredBooks);
    });
  }, [user]);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const code = data;
    const bookData = await getBookByISBN(code);
    if (!bookData.items) return;
    addBook(bookData.items[0]);
    setShowScanner(false);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  let newLink = "";
  const addBook = async (book) => {
    if (book.volumeInfo.imageLinks) {
      const thumbnailUrl = book.volumeInfo.imageLinks.thumbnail;
      newLink = thumbnailUrl.replace("http", "https");
    } else {
      newLink = STOCK_PIC;
    }

    const newBook = {
      bookId: book.id,
      volumeInfo: book.volumeInfo,
      webReaderLink: book.accessInfo?.webReaderLink,
      favorite: false,
      created: serverTimestamp(),
      url: newLink,
    };

    await addDoc(collection(FIRESTORE_DB, "users", user, "books"), newBook);
    setScanned(false);
  };

  const toggleFavorite = () => {
    setFavorite((prev) => !prev);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardStyle}
      onPress={() =>
        navigation.navigate("Kitap", {
          id: item.id,
          name: item.volumeInfo.title,
        })
      }
    >
      <View style={styles.cardContent}>
        <Image
          source={{
            uri: item.url ? item.url : STOCK_PIC,
          }}
          style={{ width: 50, height: 75 }}
        />
        <View>
          <Text style={styles.titleText}>{item.volumeInfo.title}</Text>
          <Text>
            {item.volumeInfo.authors
              ? item.volumeInfo.authors[0]
              : "unknown"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtering}>
        {favorite ? (
          <Text style={styles.header}>Favorite Books</Text>
        ) : (
          <Text style={styles.header}>Books</Text>
        )}
        <View style={styles.filterOptions}>
          <Text style={styles.filterText}>Filter by</Text>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFavorite}>
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={24}
              color={favorite ? "red" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showScanner && (
        <View style={styles.scannerContainer}>
          <Camera
            style={styles.cameraStyle}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            type={Camera.Constants.Type.back}
          />
          <TouchableOpacity
            style={styles.fab1}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.fabIcon1}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      {favorite ? (
        <FlatList
          data={favBook}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {hasPermission && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowScanner(true)}
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
  filtering: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 25,
  },
  filterOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    textAlign: "center",
    marginRight: 8,
  },
  filterButton: {
    marginRight: 15,
  },
  scannerContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    elevation: 2,
    zIndex: 2,
  },
  cameraStyle: {
    width: "100%",
    height: "100%",
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
  cardContent: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,
  },
});
