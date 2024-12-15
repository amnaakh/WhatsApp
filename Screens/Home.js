import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useNavigation } from "@react-navigation/native"; 
import ListProfil from "./Home/ListProfil";
import MyProfil from "./Home/MyProfil";
import GroupChat from "./GroupChat";
import { colors } from "../Styles/styles"; 
import { MaterialCommunityIcons } from "react-native-vector-icons"; 
import { Alert } from "react-native"; 
import ListGroup from "./Home/listGroup";
import NewGroup from "./NewGroup";
import Group from "./Home/Group";
const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentId = props.route.params.currentId;
  const navigation = useNavigation(); 

 
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion", 
      "Êtes-vous sûr de vouloir vous déconnecter ?", 
      [
        {
          text: "Annuler", 
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: () => {
            
            navigation.replace("Authentification");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Tab.Navigator
      barStyle={{
        backgroundColor: colors.buttonColor, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4, 
        elevation: 5,
      }}
    >
      <Tab.Screen
        name="ListProfil"
        component={ListProfil}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "Profils", 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple" 
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={Group}
        initialParams={{ currentId: currentId, }}
        options={{
          tabBarLabel: "Group", 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group" 
              color={color}
              size={26}
            />
          ),
        }}
      />

<Tab.Screen
        name="NewGroup"
        component={NewGroup}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "New Group", 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple-plus" 
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyProfil"
        component={MyProfil}
        initialParams={{ currentId: currentId }}
        options={{
          tabBarLabel: "Mon Profil", 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account" 
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: handleLogout, 
        }}
        options={{
          tabBarLabel: "Déconnexion", 
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="logout"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}