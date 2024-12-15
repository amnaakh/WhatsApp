import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { fonts, colors } from "../../Styles/styles";
import firebase from "../../Config";

const database = firebase.database();
const ref_tableProfils = database.ref("TableProfils");

export default function ListProfil({ route, navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState({});  // Track online status of users
  const { currentId } = route.params;

  // Listen to the current user's online status and set it to Firebase
  useEffect(() => {
    const userRef = firebase.database().ref(`onlineStatus/${currentId}`);
    userRef.set(true);  // Set user as online in Firebase

    // Clean up when the user logs out or component unmounts
    return () => {
      userRef.set(false); // Set user as offline when leaving the component
    };
  }, [currentId]);

  // Fetch profiles and set online status for each user
  useEffect(() => {
    const listener = ref_tableProfils.on("value", (snapshot) => {
      const fetchedProfiles = [];
      snapshot.forEach((childSnapshot) => {
        const profile = childSnapshot.val();
        if (profile.id === currentId) {
          setCurrentUser(profile); 
        } else {
          fetchedProfiles.push(profile);  // Add other profiles
        }
      });
      setProfiles(fetchedProfiles);  // Update profiles list
    });

    // Monitor online status updates
    const onlineStatusRef = database.ref("onlineStatus");
    onlineStatusRef.on("value", (snapshot) => {
      const onlineData = snapshot.val() || {};
      setConnectedUsers(onlineData);  // Update online status
    });

    // Clean up Firebase listeners when component unmounts
    return () => {
      ref_tableProfils.off("value", listener);
      onlineStatusRef.off("value");
    };
  }, [currentId]);

  // Render each profile
  const renderProfileItem = ({ item }) => (
    <View style={styles.profileCard}>
      <Image
        source={
          item.uriImage
            ? { uri: item.uriImage }
            : require("../../assets/profil.png")
        }
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.profilePseudo}>
          {item.pseudo || "Pseudo indisponible"}
        </Text>
        <Text style={styles.profileName}>{item.nom || "Nom indisponible"}</Text>

        {/* Display online/offline status */}
        <Text style={styles.statusText}>
          {connectedUsers[item.id] ? "(Online)" : "(Offline)"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          navigation.navigate("Chat", {
            currentUser,
            secondUser: item,
          })
        }
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/hey.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={[fonts.title, styles.title]}>List profils</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={renderProfileItem}
        style={styles.list}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 60,
    marginBottom: 20,
  },
  list: {
    width: "90%",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profilePseudo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 14,
    color: "#cdcdcd",
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",  // Green color for "Online"
  },
  chatButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});



