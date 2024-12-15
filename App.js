import Authentification from "./Screens/Authentification";
import Chat from "./Screens/Chat";
import Home from "./Screens/Home";
import NewUser from "./Screens/NewUser";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./Styles/styles"; // Importer les couleurs
import MyProfil from "./Screens/Home/MyProfil";
import Group from "./Screens/Home/Group";
import ListGroup from "./Screens/Home/listGroup";
import NewGroup from "./Screens/NewGroup";
import GroupChat from "./Screens/GroupChat";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, 
        }}
      >
        
        <Stack.Screen
          name="Authentification"
          component={Authentification}
        />
        <Stack.Screen
          name="NewUser"
          component={NewUser}
          options={{
            headerShown: true, 
            headerStyle: {
              backgroundColor: colors.buttonColor, 
            },
            headerTintColor: "white",
            title: "Retour à authentification", 
          }}
        />
         <Stack.Screen
          name="NewGroup"
          component={NewGroup}
        />
        <Stack.Screen
          name="Home"
          component={Home}
        />
         <Stack.Screen
          name="Group"
          component={Group}
        />
         <Stack.Screen
          name="GroupChat"
          component={GroupChat}
        />

<Stack.Screen
          name="ListGroup"
          component={ListGroup}
        />
         

        <Stack.Screen
          name="Chat"
          component={Chat}
        />
         <Stack.Screen
          name="MyProfil"
          component={MyProfil}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}