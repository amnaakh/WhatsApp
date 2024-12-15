import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar"; // Ajout du StatusBar
import { fonts, colors } from "../../Styles/styles"; // Utilisation des styles partagés
import firebase from "../../Config";

const database = firebase.database();
const ref_Groups = database.ref("Groups");

export default function Group(props) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentid = props.route.params.currentid;

  // Fetch groups from Firebase
  useEffect(() => {
    ref_Groups.on("value", (snapshot) => {
      const groupList = [];
      snapshot.forEach((group) => {
        groupList.push(group.val());
      });
      setGroups(groupList);
      setLoading(false);
    });

    return () => ref_Groups.off();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/hey.jpg")} // Image de fond
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={[fonts.title, styles.title]}>Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupCard}
            onPress={() =>
              props.navigation.navigate("GroupChat", {
                currentid: currentid,
               
                groupId: item.id,
                groupname: item.name,

              })
            }
          >
            <View style={styles.cardContent}>
              <Image
                source={
                  item.groupImage
                    ? { uri: item.groupImage }
                    : require("../../assets/background.png")
                }
                style={styles.groupIcon}
              />
              <View style={styles.textContent}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContent: {
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
    marginTop: 5,
  },
});
