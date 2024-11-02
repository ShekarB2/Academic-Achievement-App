import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, FlatList, StyleSheet} from 'react-native';
import Header from '../components/header';
import {useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import AssignmentItem from '../components/assignment';
import firestore from '@react-native-firebase/firestore';

const Assignment = ({navigation, route}) => {
  const {Assign, name} = route.params;
  const [value, setValue] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (Assign) {
      const assignmentsCollectionRef = firestore().collection('assignments');

      assignmentsCollectionRef
        .where('course_id', '==', Assign)
        .get()
        .then(querySnapshot => {
          const assignmentsList = [];
          querySnapshot.forEach(documentSnapshot => {
            assignmentsList.push({
              ...documentSnapshot.data(),
            });
          });
          setValue(assignmentsList);
        })
        .catch(error => {
          console.log('Error getting documents: ', error);
        });
    }
  }, [Assign]);
  const renderAssignList = ({item, index, sperator}) => {
    return (
      <AssignmentItem Assignment={item} navigation={navigation} index={index} />
    );
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Assignments"
        login={() => {
          dispatch(setCred({username: '', password: ''}));
          navigation.popToTop();
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
          This is {name}. You can see a list of students who submitted the
          Assignment.
        </Text>
        {value.length ? (
          <View style={{height: 550}}>
            <FlatList
              data={value}
              keyExtractor={assignment => assignment.id}
              renderItem={renderAssignList}
            />
          </View>
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

export default Assignment;
