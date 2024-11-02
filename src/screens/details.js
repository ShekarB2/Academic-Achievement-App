import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import CourseItem from '../components/details';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Details = ({navigation, route}) => {
  // Nav props
  const {Department, name} = route.params;
  const [value, setValue] = useState([]);
  const dispatch = useDispatch();
  const homeData = useSelector(state => state.home);
  const hash = {
    'School of Computer science and Information systems':
      'The School of Computer Science and Information Systems is dedicated to the development of future leaders in the computing industry. Our highly-qualified faculty provide a distinctive educational experience through hands-on, profession-based learning opportunities.',
    'Department of fine and performing arts':
      'This department typically offers a range of programs and courses aimed at cultivating creativity, artistic expression, and critical thinking in students interested in these disciplines.',
    'School of Health science and wellness':
      'Our mission is to facilitate the development of key knowledge, skills and attitudes for students seeking careers in health and wellness-related fields.',
    'School of communication and mass media':
      'In the School of Communication and Mass Media, students get the opportunity to have hands-on, real-world experiences during their first year. They can be involved in the two radio stations, a television station, converged print and online newspaper, yearbook, online arts and entertainment magazine or video and audio recording studios.',
    'Bachelor of Fine Arts':
      'Bachelor of Fine Arts (BFA) is a standard undergraduate degree for students for pursuing a professional education in the visual, fine or performing arts.',
    'Bachelor of Engineering':
      "Bachelor of Engineering degree program is accredited by one of the Engineering Council's professional engineering institutions as suitable for registration as an incorporated engineer or chartered engineer with further study to masters level.",
    'Bachelor of Architecture Degree':
      'A Bachelor of Architecture (B.Arch) degree is an undergraduate academic program that focuses on the study of architecture, design, and related fields.',
    'Bachelor of Philosophy':
      'B.Phil. degree program is dedicated to the study of philosophy, which is the examination of fundamental questions about existence, knowledge, ethics, logic, and the nature of reality.',
    'Bachelor of Design':
      'Bachelor of Design (B.Des) is an undergraduate degree program that focuses on various aspects of design, including graphic design, industrial design, fashion design, interior design, and more. This program is designed to provide students with the skills and knowledge necessary to pursue careers in the creative and design industries.',
  };

  const courseHash = {
    'School of Computer science and Information systems': [
      {
        id: 1,
        name: 'Object Oriented Programming',
        est_time: '29 hrs',
        student_count: 97,
      },
      {id: 2, name: 'Web Applications', est_time: '78 hrs', student_count: 175},
      {id: 3, name: 'Advance Database', est_time: '34 hrs', student_count: 55},
      {
        id: 4,
        name: 'Patterns and Frameworks',
        est_time: '70 hrs',
        student_count: 35,
      },
    ],
    'Department of fine and performing arts': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'School of Health science and wellness': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'School of communication and mass media': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'Bachelor of Fine Arts': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'Bachelor of Engineering': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'Bachelor of Architecture Degree': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'Bachelor of Philosophy': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
    'Bachelor of Design': [
      {id: 1, name: 'course1', est_time: '20 hrs', student_count: 15},
      {id: 2, name: 'course2', est_time: '12 hrs', student_count: 50},
      {id: 3, name: 'course3', est_time: '3 hrs', student_count: 510},
    ],
  };

  useEffect(() => {
    if (Department) {
      const coursesCollectionRef = firestore().collection('courses');
      let coursesQuery = coursesCollectionRef.where(
        'dept_id',
        '==',
        Department,
      );

      if (homeData.userRole === 'Faculty' && homeData.course) {
        // Filter the courses where the course field matches homedata.course
        coursesQuery = coursesQuery.where('course_name', '==', homeData.course);
      }
      coursesQuery
        .get()
        .then(querySnapshot => {
          const courses = [];
          querySnapshot.forEach(documentSnapshot => {
            courses.push({
              ...documentSnapshot.data(),
            });
          });
          setValue(courses);
        })
        .catch(error => {
          console.log('Error getting documents: ', error);
        });
    }
  }, [Department]);

  const renderCourseList = ({item, index, sperator}) => {
    return <CourseItem course={item} navigation={navigation} index={index} />;
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Description"
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
        {value.length ? (
          <>
            <Text
              style={{
                color: '#333',
                fontFamily: 'Nunito-Regular',
                fontSize: 14,
                lineHeight: 20,
                marginTop: 16,
                marginBottom: 16,
              }}>
              {value.course_name}
            </Text>
            <View style={{height: 550}}>
              <FlatList
                data={value}
                keyExtractor={course => course.id}
                renderItem={renderCourseList}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.loadingText}>Loading...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 32,
    fontFamily: 'Nunito-Regular',
    color: '#003B70',
    lineHeight: 40,
    textAlign: 'center',
  },
});

export default Details;
