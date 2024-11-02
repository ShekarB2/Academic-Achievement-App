import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';

const CourseDetails = ({navigation, route}) => {
  const {Course, name} = route.params;
  const dispatch = useDispatch();
  const hash = {
    'Object Oriented Programming':
      'Object-Oriented Programming (OOP) is a programming paradigm that organizes and structures code around the concept of objects.It is a way of designing and modeling software that reflects real-world entities and their interactions. In OOP, software is broken down into objects, each of which is an instance of a class. ',
    'Web Applications':
      'Web applications are software programs or services that run on web servers and are accessible through web browsers over the internet. They are designed to perform specific functions or provide services to users, often with a focus on interactivity and user engagement.',
    'Advance Database':
      'An advanced database, often referred to as a sophisticated or complex database, is designed to handle large volumes of data, support complex data structures, and provide advanced features for data storage, retrieval, and management. These databases are typically used in enterprise-level applications, scientific research, and various data-intensive domains.',
    'Patterns and Frameworks':
      'patterns and frameworks are essential concepts that help developers design and build software in a more organized, efficient, and maintainable manner. ',
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Course Description"
        login={() => {
          auth()
            .signOut()
            .then(() => {
              console.log('User signed out!');
              dispatch(setCred({username: '', password: '', loggedIn: false}));
              navigation.popToTop();
            });
        }}
      />
      <View style={{padding: 24}}>
        <Text
          style={{
            color: '#00420C',
            fontFamily: 'Nunito-Regular',
            fontSize: 20,
            lineHeight: 26,
            fontWeight: 700,
          }}>
          {name}
        </Text>
        <Text
          style={{
            color: '#333',
            fontFamily: 'Nunito-Regular',
            fontSize: 14,
            lineHeight: 20,
            marginTop: 16,
            marginBottom: 16,
          }}>
          {Course}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CourseDetails;
