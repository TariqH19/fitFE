import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Exercise from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/exercises/Index";
import Health from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/health/Index";
import Home from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/home/Index";
import Login from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/login/Index";
import Profile from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/profile/Index";
import Progress from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/progress/Index";
import Split from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/splits/Index";
import Train from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/trains/Index";
import Workout from "./(exercises,health,home,login,profile,progress,splits,trains,workouts)/workouts/Index";
import { SessionProvider } from "../contexts/AuthContext";
import { PaperProvider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";

export default function Nav() {
  // const { session }: any = useSession();
  const hiddenScreens = {
    Exercise,
    Workout,
    Split,
    Train,
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
              if (route.name === "(home)") {
                iconName = "home";
              } else if (route.name === "(progress)") {
                iconName = "trending-up";
              } else if (route.name === "(health)") {
                iconName = "favorite";
              } else if (route.name === "(profile)") {
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
            tabBarLabel: ({ focused, color }) => {
              const label = route.name.replace(/\(([^)]+)\)/, "$1"); // Remove parentheses but keep the content inside
              return <Text style={{ color, fontSize: 12 }}>{label}</Text>;
            },
          })}>
          <Tab.Screen
            name="(home)"
            component={Home}
            options={{ headerTitle: "Home" }}
          />
          <Tab.Screen
            name="(progress)"
            component={Progress}
            options={{
              headerTitle: "Progress",
            }}
          />
          <Tab.Screen
            name="(health)"
            component={Health}
            options={{
              headerTitle: "Health",
            }}
          />
          <Tab.Screen
            name="(profile)"
            component={Profile}
            options={{
              headerTitle: "Profile",
            }}
          />

          <Tab.Screen
            name="(login)"
            component={Login}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: "none" },
              headerShown: false,
            }}
          />

          {Object.entries(hiddenScreens).map(([screenName, component]) => (
            <Tab.Screen
              key={screenName}
              name={`(${screenName.toLowerCase()}s)`}
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
