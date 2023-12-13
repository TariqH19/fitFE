import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Exercise from "./exercises/Index";
import Health from "./health/Index";
import Home from "./home/Index";
import Login from "./login/Index";
import Profile from "./profile/Index";
import Progress from "./progress/Index";
import Split from "./splits/Index";
import Train from "./trains/Index";
import Workout from "./workouts/Index";
import { useSession } from "../../contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { Redirect } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function Nav() {
  const { session }: any = useSession();
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
            <MaterialIcons name={iconName as any} size={size} color={color} />
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
        options={{
          headerTitle: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="(progress)"
        component={Progress}
        options={{
          headerTitle: "Progress",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="(health)"
        component={Health}
        options={{
          headerTitle: "Health",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="(profile)"
        component={Profile}
        options={{
          headerTitle: "Profile",
          headerTitleAlign: "center",
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
  );
}
