import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../Config";
import AuthContainer from "./AuthContainer";
import { fonts, layout, colors } from "../Styles/styles";

const auth = firebase.auth();

export default function Authentification({ navigation }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const refInput2 = useRef();

  useEffect(() => {
    // Charger les données stockées lors du montage du composant
    const loadCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem("email");
      const savedPwd = await AsyncStorage.getItem("pwd");
      const savedRememberMe = await AsyncStorage.getItem("rememberMe");

      if (savedRememberMe === "true") {
        setEmail(savedEmail || "");
        setPwd(savedPwd || "");
        setRememberMe(true);
      }
    };
    loadCredentials();
  }, []);

  const handleSignIn = () => {
    if (email !== "" && pwd !== "") {
      auth
        .signInWithEmailAndPassword(email, pwd)
        .then(() => {
          const currentId = auth.currentUser?.uid;
          if (currentId) {
            if (rememberMe) {
              // Sauvegarder les informations d'authentification si "Se souvenir de moi" est activé
              AsyncStorage.setItem("email", email);
              AsyncStorage.setItem("pwd", pwd);
              AsyncStorage.setItem("rememberMe", "true");
            } else {
              // Supprimer les informations si "Se souvenir de moi" est désactivé
              AsyncStorage.removeItem("email");
              AsyncStorage.removeItem("pwd");
              AsyncStorage.setItem("rememberMe", "false");
            }
            navigation.replace("Home", { currentId });
          } else {
            console.error("L'ID utilisateur est introuvable !");
            alert("Erreur : L'identifiant de l'utilisateur est introuvable.");
          }
        })
        .catch((error) => alert(error.message));
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  return (
    <AuthContainer>
      <Text style={[fonts.title, { marginTop: 15, marginBottom: 20, fontSize: 27 }]}>
        Authentification
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[fonts.input, { marginBottom: 10, borderRadius: 10 }]}
        placeholder="Email"
        placeholderTextColor={colors.placeholderColor}
        keyboardType="email-address"
        onSubmitEditing={() => refInput2.current.focus()}
        blurOnSubmit={false}
      />

      <TextInput
        ref={refInput2}
        value={pwd}
        onChangeText={setPwd}
        style={[fonts.input, { marginBottom: 20, borderRadius: 10 }]}
        placeholder="Mot de passe"
        placeholderTextColor={colors.placeholderColor}
        keyboardType="default"
        secureTextEntry
      />

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
          trackColor={{ false: "#767577", true: colors.buttonColor }}
          thumbColor={rememberMe ? colors.buttonColor : "#f4f3f4"}
        />
        <Text style={{ marginLeft: 10, color: colors.textColor }}>
          Se souvenir de moi
        </Text>
      </View>

      <TouchableOpacity
        style={[layout.button, { backgroundColor: colors.buttonColor, width: "70%" }]}
        onPress={handleSignIn}
      >
        <Text style={fonts.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: colors.textColor }}>Pas encore de compte ?</Text>
        <TouchableOpacity
          style={{ marginTop: 5 }}
          onPress={() => navigation.navigate("NewUser")}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: colors.textColor,
              textDecorationLine: "underline",
            }}
          >
            S'inscrire
          </Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
}
