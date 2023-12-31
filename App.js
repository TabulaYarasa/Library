import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import UsersScreen from "./src/screens/UsersScreen";
import TrackDetailScreen from "./src/screens/TrackDetailScreen";
import BooksListScreen from "./src/screens/BooksListScreen";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import KitapScreen from "./src/bbooks/KitapScreen";
import {
  TouchableOpacity,
  Button,
  ActivityIndicator,
  View,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import OthersBooksScreen from "./src/screens/OthersBooksScreen";
import LottieScreen from "./src/screens/LottieScreen";
import { StatusBar } from "expo-status-bar";
import Modal from "./src/screens/Modal";
import OthersKitapScreen from "./src/bbooks/OthersKitapScreen";

const loginFlowStack = createNativeStackNavigator();
const BookListStack = createNativeStackNavigator();
const OtherListStack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BooksListStackNavigator() {
  return (
    <BookListStack.Navigator>
      <BookListStack.Screen
        options={{ headerShown: false }}
        name="BookListe"
        component={BooksListScreen}
      />
      <BookListStack.Screen
        options={({ route }) => ({ title: route.params.name })}
        name="Kitap"
        component={KitapScreen}
      />
    
    </BookListStack.Navigator>
  );
}
function OtherListStacktNavigator() {
  return (
    <OtherListStack.Navigator>
      <OtherListStack.Screen
        options={{ headerShown: false }}
        name="Userse"
        component={UsersScreen}
      />
      <OtherListStack.Screen
        options={({ route }) => ({ title: route.params.name })}
        name="OthersBooks"
        component={OthersBooksScreen}
      />  
       <OtherListStack.Screen
      options={({ route }) => ({ title: route.params.name })}
      name="OthersKitap"
      component={OthersKitapScreen}
    />
      
    </OtherListStack.Navigator>
  );
}

function MainFlow() {
  return (
    <Tab.Navigator
      initialRouteName="BookList"
      activeColor="#3e2465"
      inactiveColor="#694fad"
      barStyle={{ backgroundColor: "#FAFAFA" }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="BookList"
        component={BooksListStackNavigator}
        options={{
          tabBarLabel: "Books",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bookshelf" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={OtherListStacktNavigator}
        options={{
          tabBarLabel: "Users",
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function SignFlow() {
  return (
    <loginFlowStack.Navigator
      initialRouteName="Lottie"
      screenOptions={{ headerShown: false }}
    >
      <loginFlowStack.Screen name="SignUp" component={SignupScreen} />
      <loginFlowStack.Screen name="SignIn" component={SigninScreen} />
      <loginFlowStack.Screen name="Lottie" component={LottieScreen} />
    </loginFlowStack.Navigator>
  );
}

export default function App() {
  const [isUser, setIsUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
      } else {
        setIsUser(false);
      }
    });
  }, []);
  console.log(isUser);

  if (isUser == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="MainFlow"
      >
        {isUser ? (
          <Stack.Screen name="MainFlow" component={MainFlow} />
        ) : (
          <Stack.Screen name="SignFlow" component={SignFlow} />
        )}
      </Stack.Navigator>
    
    </NavigationContainer>
  );
}
