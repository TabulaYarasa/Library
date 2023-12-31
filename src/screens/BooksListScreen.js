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
import {
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from 'react-native-reanimated';

export default function BooksListScreen({ navigation }) {
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
  const [favBook, setFavBook] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser.uid;
  const STOCK_PIC =
    "https://firebasestorage.googleapis.com/v0/b/my-book-project-4cf0f.appspot.com/o/blank-book-cover-over-png.png?alt=media&token=ce4c1983-ced3-491c-a99b-1822bcccfa2e";

    const author = "unknown"

console.log(user)
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
    

      const booksCollection = collection(FIRESTORE_DB, `users/${user}/books`);
      
      onSnapshot(booksCollection, (snapshot) => {
        const books = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        
        let filteredBooks = books.filter(function (book) {
          return book.favorite;
        });
        setBooks(books);
        
        setFavBook(filteredBooks);
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
    alert(
      `Bar codse wisth type ${type} and data ${bookData} has been scanned!`
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  let newLink=""
  const addBook = async (book) => {
   if(book.volumeInfo.imageLinks){
    console.log("ife girdi")
     const yeniUrl = book.volumeInfo.imageLinks.thumbnail;
      newLink = yeniUrl.replace("http", "https");
    }else{
      console.log("else girdi")
      newLink = STOCK_PIC
    }
    

    const newBook = {
      bookId: book.id,
      volumeInfo: book.volumeInfo,
      webReaderLink: book.accessInfo?.webReaderLink,
      favorite: false,
      created: serverTimestamp(),
      url: newLink,
    };

    const db = await addDoc(
      collection(FIRESTORE_DB, "users", user, "books"),
      newBook
    );
    setScanned(false);
  };

  const toggleFavorite = () => {
    const isFavorite = favorite;
    setFavorite(!isFavorite);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardStyle}
        onPress={() =>
          navigation.navigate("Kitap", {
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
            <Text>{item.volumeInfo.authors ?( item.volumeInfo.authors[0] ):( author)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtering}>
      {favorite ? (
        <Text style={styles.header}>Favorite Books</Text>
      ) : (
        <Text style={styles.header}>Books</Text>
      )}
      <View style={{flexDirection:"row", alignItems: "center"}}>

        <Text style={{ textAlign: "center", marginRight: 8 }}>Filter by</Text>
        <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleFavorite}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={24}
            color={favorite ? "red" : "black"}
            />
        </TouchableOpacity >
            </View>
     
      </View>
   

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
  filtering: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 25,
    marginBottom: 10,
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
