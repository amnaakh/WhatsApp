import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { fonts, layout, colors } from "../Styles/styles";
import firebase from "../Config";

const database = firebase.database();
const ref_lesdiscussions = database.ref("lesdiscussions");
const ref_currentistyping = database.ref("isTyping");

export default function Chat(props) {
  const currentUser = props.route.params.currentUser;
  const secondUser = props.route.params.secondUser;

  const iddisc =
    currentUser.id > secondUser.id
      ? currentUser.id + secondUser.id
      : secondUser.id + currentUser.id;
  const ref_unediscussion = ref_lesdiscussions.child(iddisc);

  const [Msg, setMsg] = useState("");
  const [data, setdata] = useState([]);
  const [secondUserTyping, setSecondUserTyping] = useState(false);

  const ref_currentUserTyping = ref_currentistyping.child(currentUser.id + "_isTyping");
  const ref_secondUserTyping = ref_currentistyping.child(secondUser.id + "_isTyping");

  // Récupérer les messages
  useEffect(() => {
    ref_unediscussion.on("value", (snapshot) => {
      let d = [];
      snapshot.forEach((unmessage) => {
        d.push(unmessage.val());
      });
      setdata(d);
    });

    return () => {
      ref_unediscussion.off();
    };
  }, []);

  // Surveiller l'état `isTyping` de l'autre utilisateur
  useEffect(() => {
    ref_secondUserTyping.on("value", (snapshot) => {
      setSecondUserTyping(snapshot.val() || false);
    });

    return () => {
      ref_secondUserTyping.off();
    };
  }, []);

  const handleSend = () => {
    if (Msg.trim() === "") return;

    const key = ref_unediscussion.push().key;
    const ref_unmsg = ref_unediscussion.child(key);
    ref_unmsg.set({
      body: Msg,
      time: new Date().toLocaleString(),
      sender: currentUser.id,
      receiver: secondUser.id,
      seen: false, 
    });

    
    setMsg("");
    ref_currentUserTyping.set(false);
  };

  const handleTyping = (text) => {
    setMsg(text);

    if (text.trim() !== "") {
      ref_currentUserTyping.set(true);
    } else {
      ref_currentUserTyping.set(false);
    }
  };




  /// location 
  const sendLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à la localisation pour envoyer votre position."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      // Construire un lien Google Maps valide
      const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const locationMessage = {
        body: locationURL,
        time: new Date().toLocaleString(),
        sender: currentUser.id,
        receiver: secondUser.id,
        seen: false,
      };

      const key = ref_unediscussion.push().key;
      const ref_unmsg = ref_unediscussion.child(key);
      await ref_unmsg.set(locationMessage);

      Alert.alert("Succès", "La localisation a été envoyée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la localisation :", error);
      Alert.alert(
        "Erreur",
        "Impossible d'envoyer la localisation. Veuillez réessayer."
      );
    }
  };


// Seen 
  const markMessagesAsSeen = () => {
    ref_unediscussion.once("value", (snapshot) => {
      snapshot.forEach((msgSnapshot) => {
        const msgKey = msgSnapshot.key;
        const message = msgSnapshot.val();
        if (message.receiver === currentUser.id && !message.seen) {
          // Mark message as seen
          ref_unediscussion.child(msgKey).update({ seen: true });
        }
      });
    });
  };

  useEffect(() => {
    if (currentUser.id === secondUser.id) return; // Don't mark as seen if the same user

    // Mark messages as seen when the second user opens the chat
    markMessagesAsSeen();
  }, [currentUser.id]);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.container}
      >
        <Text style={styles.headerText}>
          Chat {currentUser.nom} {currentUser.pseudo}
        </Text>

        <FlatList
          style={styles.messagesContainer}
          data={data}
          renderItem={({ item, index }) => {
            const isCurrentUser = item.sender === currentUser.id;
            const color = isCurrentUser ? "#FFF" : "#444";
            const textColor = isCurrentUser ? colors.buttonColor : "#fff";
            const seenStatus = item.seen ? "Seen" : "Not seen"; // Display the seen status

            const profileImage = isCurrentUser
              ? currentUser.uriImage
              : secondUser.uriImage;

            const showProfileImage =
              index === 0 || item.sender !== data[index - 1].sender;

            return (
              <View
                style={[
                  styles.messageContainer,
                  {
                    flexDirection: isCurrentUser ? "row-reverse" : "row",
                  },
                ]}
              >
                {showProfileImage && profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileImage} />
                )}
                <View style={[styles.message, { backgroundColor: color }]}>
                  <View style={styles.messageContent}>
                    {item.body.includes("https://www.google.com/maps") ? (
                      <TouchableHighlight
                        underlayColor="#555"
                        onPress={() => Linking.openURL(item.body)}
                      >
                        <Text style={[styles.messageText, { color: textColor }]}>
                          {item.body}
                        </Text>
                      </TouchableHighlight>
                    ) : (
                      <Text style={[styles.messageText, { color: textColor }]}>
                        {item.body}
                      </Text>
                    )}
                    <Text style={styles.messageTime}>
                      {item.time} - {seenStatus}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {secondUserTyping && (
          <Text style={{ color: "#fff", marginBottom: 5 }}>
            {secondUser.nom} is typing...
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={handleTyping}
            value={Msg}
            placeholderTextColor="#ccc"
            placeholder="Write a message"
            style={styles.textinput}
            onFocus={() => ref_currentUserTyping.set(true)}
            onBlur={() => ref_currentUserTyping.set(false)}
          />
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#555"
            style={styles.sendButton}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="#555"
            style={styles.sendButton}
            onPress={sendLocation}
          >
            <Image
              source={require("../assets/output-onlinepngtools.png")}
              style={styles.locationIcon}
            />
          </TouchableHighlight>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  headerText: {
    marginTop: 50,
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  messagesContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "95%",
    borderRadius: 10,
    marginVertical: 20,
    padding: 5,
    paddingTop: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 100,
    margin: 5,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
    minWidth: "20%",
    marginVertical: 5,
  },
  messageContent: {
    flexDirection: "column",
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: "#aaa",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  textinput: {
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    width: "80%",
    height: 40,
    paddingLeft: 15,
  },
  sendButton: {
    backgroundColor: colors.buttonColor,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
