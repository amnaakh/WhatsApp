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
import NewGroup from "../NewGroup";

const database = firebase.database();
const ref_tableGroups = database.ref("TableGroups");

export default function ListGroup({ route, navigation }) {
  const [groups, setGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { currentId } = route.params;
  console.log(currentId); // Check the currentUser data before passing it

  useEffect(() => {
    const listener = ref_tableGroups.on("value", (snapshot) => {
      const fetchedGroups = [];
      snapshot.forEach((childSnapshot) => {
        const group = childSnapshot.val();
        fetchedGroups.push(group);
      });
      setGroups(fetchedGroups);
    });

    return () => {
      ref_tableGroups.off("value", listener);
    };
  }, []);

  const renderGroupItem = ({ item }) => (
    <View style={styles.groupCard}>
      <Image
        source={
          item.groupImage
            ? { uri: item.groupImage }
            : require("../../assets/amna.jpeg") 
        }
        style={styles.groupImage}
      />
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name || "Group Name"}</Text>
        <Text style={styles.groupDescription}>
          {item.description || "No description available"}
        </Text>
      </View>
      console.log("item id "+item.id);
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {
          navigation.navigate("Group", {
            currentUser,
            group: item,
            GroupId: item.id, // Corrected here
          });
        }}
      >
        <Text style={styles.chatButtonText}>Join Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={[fonts.title, styles.title]}>List of Groups</Text>
      
      <TouchableOpacity
        style={styles.newGroupButton}
        onPress={() => navigation.navigate("NewGroup", { currentId })}
      >
        <Text style={styles.newGroupButtonText}>Create New Group</Text>
      </TouchableOpacity>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
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
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
    justifyContent: "center",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  groupDescription: {
    fontSize: 14,
    color: "#cdcdcd",
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
  newGroupButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  newGroupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});