//configure routes to the application
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

//screens
import Home from '../screens/home';
import Login from '../screens/login';
import Dashboard from '../screens/dashboard';
import Details from '../screens/details';
import CourseDetails from '../screens/courseDetails';
import Admin from '../screens/admin';
import Assignment from '../screens/assignment';
import Learning from '../screens/learning';
import Forgot from '../screens/forgot';
import SubUsers from '../screens/subusers';
import Change from '../screens/change';

//screenOptions={{headerShown: false}}
const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Login'}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'CourseTune'}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard'}}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{title: 'Department details'}}
        />
        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{title: 'Course details'}}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{title: 'Admin Portal'}}
        />
        <Stack.Screen
          name="Assignment"
          component={Assignment}
          options={{title: 'Assignments'}}
        />
        <Stack.Screen
          name="Learning"
          component={Learning}
          options={{title: 'Learning'}}
        />
        <Stack.Screen
          name="forgot"
          component={Forgot}
          options={{title: 'Forgot Password'}}
        />
        <Stack.Screen
          name="subUsers"
          component={SubUsers}
          options={{title: 'Add Sub Users'}}
        />
        <Stack.Screen
          name="change"
          component={Change}
          options={{title: 'Change Password'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
