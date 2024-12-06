import Authentification from "./Screens/Authentification";
import Chat from "./Screens/Chat";
import Home from "./Screens/Home";
import NewUser from "./Screens/NewUser";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./Styles/styles"; // Importer les couleurs
import MyProfil from "./Screens/Home/MyProfil";

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
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="MyProfil"
          component={MyProfil}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}