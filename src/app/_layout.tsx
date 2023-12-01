import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./(tabs)/home";
import WeightTracker from "./(tabs)/progress";
import HealthPage from "./(tabs)/health";
import ProfilePage from "./(tabs)/profile";
import ExercisePage from "./(tabs)/ExercisePage";
import WorkoutPage from "./(tabs)/WorkoutPage";
import SplitsPage from "./(tabs)/SplitsPage";
import TrainPage from "./(tabs)/TrainPage";
import login from "./(tabs)/login";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function Nav() {
  const hiddenScreens = {
    ExercisePage,
    WorkoutPage,
    SplitsPage,
    TrainPage,
    // login,
  };

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  // Generic function to create a hidden stack navigator for a specific screen
  const createHiddenStackNavigator = (screenName: any, component: any) => (
    <Stack.Navigator>
      <Stack.Screen name={screenName} component={component} />
    </Stack.Navigator>
  );

  return (
    <SessionProvider>
      <PaperProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              // Set icon based on the route name
              if (route.name === "(tabs)/home") {
                iconName = "home";
              } else if (route.name === "(tabs)/progress") {
                iconName = "trending-up";
              } else if (route.name === "(tabs)/health") {
                iconName = "favorite";
              } else if (route.name === "(tabs)/profile") {
                iconName = "person";
              }

              // Return the icon component
              return (
                <MaterialIcons
                  name={iconName as any}
                  size={size}
                  color={color}
                />
              );
            },
            tabBarLabel: route.name.replace("(tabs)/", ""), // Use the route name as the label
          })}>
          <Tab.Screen
            name="(tabs)/home"
            component={HomeScreen}
            options={{ headerTitle: "Home" }}
          />
          <Tab.Screen
            name="(tabs)/progress"
            component={WeightTracker}
            options={{
              headerTitle: "Progress",
            }}
          />
          <Tab.Screen
            name="(tabs)/health"
            component={HealthPage}
            options={{
              headerTitle: "Health",
            }}
          />
          <Tab.Screen
            name="(tabs)/profile"
            component={ProfilePage}
            options={{
              headerTitle: "Profile",
            }}
          />

          <Tab.Screen
            name="(tabs)/login"
            component={login}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: "none" },
              headerShown: false,
            }}
          />

          {Object.entries(hiddenScreens).map(([screenName, component]) => (
            <Tab.Screen
              key={screenName}
              name={`(tabs)/${screenName}`}
              options={{
                tabBarButton: () => null,
                tabBarStyle: false,
                headerShown: false,
              }}>
              {() => createHiddenStackNavigator(screenName, component)}
            </Tab.Screen>
          ))}
        </Tab.Navigator>
      </PaperProvider>
    </SessionProvider>
  );
}
