import React, { useState, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import firebase from "../Config";
import AuthContainer from "./AuthContainer";
import { fonts, layout, colors } from "../Styles/styles";
import * as ImagePicker from "expo-image-picker";

const database = firebase.database();

export default function NewGroup({ navigation, route }) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const refInput2 = useRef();
  const { currentId } = route.params;
 const group =route.params.group;
  const handleCreateGroup = () => {
    if (!groupName || !groupDescription) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const refTableGroups = database.ref("Groups");
    const newGroupRef = refTableGroups.push(); // Generate a new unique key for the group

    newGroupRef
      .set({
        id: newGroupRef.key,
        name: groupName,
        description: groupDescription,
        createdBy: currentId,
        groupImage: groupImage || "", // Optional field for group image
        members: { [currentId]: true }, // Add the creator as the first member
      })
      .then(() => {
        alert("Groupe créé avec succès !");
        navigation.navigate("Group", { currentId });
      })
      .catch((error) => alert("Erreur : " + error.message));
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
      setImageError(false);
    }
  };

  const handleImageLoadError = () => {
    setImageError(true);
    setGroupImage(""); // Reset to default if there's an error
  };

  return (
    <AuthContainer>
      <Text style={[fonts.title, { marginTop: 15, marginBottom: 10 }]}>Créer un nouveau groupe</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.imagePickerContainer}>
        {imageLoading && (
          <ActivityIndicator size="large" color={colors.primary} style={styles.activityIndicator} />
        )}
        <Image
          source={
            imageError || !groupImage
              ? require("../assets/amna.jpeg")
              : { uri: groupImage }
          }
          style={styles.groupImage}
          onError={handleImageLoadError}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </TouchableOpacity>

      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        style={[fonts.input, { marginBottom: 10, borderRadius: 10 }]}
        placeholder="Nom du groupe"
        placeholderTextColor={colors.placeholderColor}
        onSubmitEditing={() => refInput2.current.focus()}
        blurOnSubmit={false}
      />

      <TextInput
        ref={refInput2}
        value={groupDescription}
        onChangeText={setGroupDescription}
        style={[fonts.input, { marginBottom: 10, borderRadius: 10 }]}
        placeholder="Description du groupe"
        placeholderTextColor={colors.placeholderColor}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={layout.button} onPress={handleCreateGroup}>
          <Text style={fonts.buttonText}>Créer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[layout.button, { backgroundColor: "#f07578" }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={fonts.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    gap: 15,
  },
});