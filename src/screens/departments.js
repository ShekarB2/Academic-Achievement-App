import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../components/header';
import DepartmentCard from '../components/departments';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Departments = ({navigation}) => {
  // const [open, setOpen] = useState(false);
  const homeData = useSelector(state => state.home);
  const [value, setValue] = useState([]);
  // const [items, setItems] = useState([
  //   {label: 'Masters', value: 'Grad'},
  //   {label: 'Bachelors', value: 'UnderGrad'},
  // ]);
  const depHash = {
    Grad: [
      {
        id: 1,
        title: 'School of Computer science and Information systems',
        chapters_count: 3,
        time: '2hrs',
      },
      {
        id: 2,
        title: 'Department of fine and performing arts',
        chapters_count: 5,
        time: '7hrs',
      },
      {
        id: 3,
        title: 'School of Health science and wellness',
        chapters_count: 15,
        time: '17hrs',
      },
      {
        id: 4,
        title: 'School of communication and mass media',
        chapters_count: 9,
        time: '9hrs',
      },
    ],
    UnderGrad: [
      {
        id: 1,
        title: 'Bachelor of Fine Arts',
        chapters_count: 5,
        time: '9hrs',
      },
      {
        id: 2,
        title: 'Bachelor of Engineering',
        chapters_count: 15,
        time: '19hrs',
      },
      {
        id: 3,
        title: 'Bachelor of Architecture Degree',
        chapters_count: 15,
        time: '19hrs',
      },
      {
        id: 4,
        title: 'Bachelor of Philosophy',
        chapters_count: 3,
        time: '4hrs',
      },
      {
        id: 5,
        title: 'Bachelor of Design',
        chapters_count: 3,
        time: '4hrs',
      },
    ],
  };
  console.log(homeData);
  useEffect(() => {
    const departmentCollectionRef = firestore().collection('Departments');
    let departmentQuery = departmentCollectionRef;

    if (homeData.userRole !== 'SuperAdmin' && homeData.dept) {
      // Filter the departments where the department field matches homedata.dept
      departmentQuery = departmentQuery.where('name', '==', homeData.dept);
    }
    departmentQuery
      .get()
      .then(querySnapshot => {
        const departments = [];
        querySnapshot.forEach(documentSnapshot => {
          departments.push({
            ...documentSnapshot.data(),
          });
        });
        setValue(departments);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  }, []);

  const dispatch = useDispatch();
  const departmentRenderItem = ({item, index, sperator}) => {
    return <DepartmentCard dep={item} navigation={navigation} />;
  };
  console.log('value', value);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 2,
      }}>
      <Header
        name="Departments"
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
      <View style={{marginTop: 10, padding: 16}}>
        {/* <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={'Choose a class'}
          style={{
            borderColor: '#00420C',
          }}
          labelStyle={{
            color: '#00420C',
          }}
          textStyle={{
            color: '#00420C',
          }}
        /> */}
        <View style={{marginTop: 24}}>
          {value.length ? (
            <FlatList
              data={value}
              keyExtractor={dep => dep.id}
              renderItem={departmentRenderItem}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                gap: 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
        </View>
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

export default Departments;
