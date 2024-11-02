import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Image} from 'react-native';

const Tab = createBottomTabNavigator();
import Departments from './departments';
import School from './schools';
import Profile from './profile';
function Icon({name}) {
  if (name === 'home') {
    return (
      <Image
        style={{width: 25, height: 25}}
        source={require('../assets/images/home.png')}
      />
    );
  } else if (name === 'depatment') {
    return (
      <Image
        style={{width: 25, height: 25}}
        source={require('../assets/images/depatment.png')}
      />
    );
  } else if (name === 'profile') {
    return (
      <Image
        style={{width: 25, height: 25}}
        source={require('../assets/images/profile.png')}
      />
    );
  }
}
function Dashboard({navigation}) {
  return (
    <>
      <Tab.Navigator
        initialRouteName="school"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Departments') {
              iconName = 'depatment';
            } else if (route.name === 'Profile') {
              iconName = 'profile';
            }
            // You can return any component that you like here!
            return <Icon name={iconName} />;
          },
        })}>
        <Tab.Screen
          name="Home"
          component={School}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen name="Departments" component={Departments} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </>
  );
}

export default Dashboard;
