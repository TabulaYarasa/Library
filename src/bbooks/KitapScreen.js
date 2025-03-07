import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/FirebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Animated from 'react-native-reanimated';
import { BounceIn, BounceOut } from 'react-native-reanimated';

export default function KitapScreen({ route, navigation }) {
  const { id } = route.params;
  const [book, setBook] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser.uid;
  const STOCK_PIC =
    "https://firebasestorage.googleapis.com/v0/b/my-book-project-4cf0f.appspot.com/o/blank-book-cover-over-png.png?alt=media&token=ce4c1983-ced3-491c-a99b-1822bcccfa2e";



  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const fbDoc = await getDoc(
        doc(FIRESTORE_DB, `users/${user}/books/${id}`)
      );
      if (!fbDoc.exists()) return;
      const data = await fbDoc.data();
      console.log(data);
      setBook(data);
    };
    load();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("current user" + uid);
      } else {
        console.log("no users");
        navigation.navigate("SignFlow");
      }
    });
  }, [user]);

  useEffect(() => {
    if (!book) return;
    const favorite = book.favorite;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={24}
            color={favorite ? "red" : "black"}
          />
        </TouchableOpacity>
      ),
    });
  }, [book]);

  const removeBook = () => {
    console.log("removeBook Çağrıldı");
    const fbdoc = doc(FIRESTORE_DB, `users/${user}/books/${id}`);
    deleteDoc(fbdoc);
    navigation.goBack();
  };

  const toggleFavorite = () => {
    const isFavorite = book.favorite;
    const fbdoc = doc(FIRESTORE_DB, `users/${user}/books/${id}`);
    updateDoc(fbdoc, { favorite: !isFavorite });
    setBook({ ...book, favorite: !isFavorite });
  };
  return (
    <ScrollView>
      <View style={styles.card}>
        {book && (
          <>
            <View style={styles.infoBar}>
              <Text style={styles.pageCount}>
                Sayfa Sayısı: {book.volumeInfo.pageCount}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Silmek istediğinize emin misiniz?", // alert başlığı
                    "Bu işlem geri alınamaz.", // alert mesajı
                    [
                      // alert düğmeleri
                      {
                        text: "İptal", // düğme metni
                        onPress: () => console.log("İptal edildi"), // düğmeye basıldığında yapılacak işlem
                        style: "default", // düğme stili
                      },
                      {
                        text: "Sil", // düğme metni
                        onPress: () => removeBook(), // düğmeye basıldığında yapılacak işlem
                        style: "destructive", // düğme stili
                      },
                    ]
                  );
                }}
              >
                <MaterialIcons name="delete-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <Image
            
         
              style={styles.image}
              source={{
                uri: book.url // resmin kaynağını belirle
                  ? book.url // eğer objenin imageLinks katoloğu varsa, oradan al
                  : STOCK_PIC, // eğer yoksa, sabit bir URL ver
              }}
            />
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
            <Text>{book.volumeInfo.description}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 20,
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
  image: {
    marginTop: 10,
    width: 200,
    height: 300,
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  pageCount: {},
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
