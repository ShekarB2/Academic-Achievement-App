import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/header';
import {useSelector, useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';

async function getDepartments() {
  try {
    const departmentsSnapshot = await firestore()
      .collection('Departments')
      .get();

    const departments = departmentsSnapshot.docs.map(doc => ({
      label: doc.data().name,
      value: doc.data().name,
      id: doc.data().id,
    }));

    return {departments};
  } catch (error) {
    console.error('Error fetching departments and classes:', error);
  }
}

const SubUsers = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Coordinator', value: 'Coordinator'},
    {label: 'Faculty', value: 'Faculty'},
  ]);
  const [openDept, setOpenDept] = useState(false);
  const [valueDept, setValueDept] = useState(null);
  const [itemsDept, setItemsDept] = useState([]);
  const [openCourse, setOpenCourse] = useState(false);
  const [valueCourse, setValueCourse] = useState(null);
  const [itemsCourse, setItemsCourse] = useState([]);

  const getClasses = async departmentId => {
    if (!departmentId) {
      Alert.alert('Department is required');
    }
    setItemsCourse([]);
    const classesSnapshot = await firestore()
      .collection('courses')
      .where('dept_id', '==', departmentId)
      .get();
    const classes = classesSnapshot.docs.map(doc => ({
      label: doc.data().course_name,
      value: doc.data().course_name,
    }));
    setItemsCourse(classes);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDepartments();
      setItemsDept(data.departments);
    };
    fetchData();
  }, []);

  async function createSubUser(username, emailId, role, department, course) {
    if (!username || !emailId || !role || !department || !course) {
      Alert.alert('Every field is required');
    }
    try {
      setLoading(true);
      const defaultPassword = 'Password123!';
      const createUserResult = await auth().createUserWithEmailAndPassword(
        emailId,
        defaultPassword,
      );
      const uid = createUserResult.user.uid;

      const userRef = firestore().collection('users').doc(uid);
      await userRef.set({
        firstName: username,
        userRole: role,
        dept: department,
        course: course,
      });
      setLoading(false);
      Alert.alert('SubUser created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      setLoading(false);
      Alert.alert(`Error creating user:, ${error}`);
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Add Sub Users"
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
        <View style={{height: '86%'}}>
          <TextInput
            style={styles.input}
            onChangeText={val => setEmail(val)}
            value={email}
            placeholder="Email"
            placeholderTextColor={'#000'}
          />
          <TextInput
            style={styles.input}
            onChangeText={val => setName(val)}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor={'#000'}
          />
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={'Select User Role'}
            zIndex={3000}
            zIndexInverse={1000}
          />
          <View style={{marginBottom: 12}}></View>
          <DropDownPicker
            open={openDept}
            value={valueDept}
            items={itemsDept}
            setOpen={setOpenDept}
            setValue={setValueDept}
            setItems={setItemsDept}
            placeholder={'Select Department'}
            zIndex={2000}
            zIndexInverse={2000}
            searchable={true}
            searchPlaceholder="Search Departments...."
            onSelectItem={item => {
              console.log('item', item);
              getClasses(item.id);
            }}
          />
          <View style={{marginBottom: 12}}></View>
          <DropDownPicker
            open={openCourse}
            value={valueCourse}
            items={itemsCourse}
            setOpen={setOpenCourse}
            setValue={setValueCourse}
            setItems={setItemsCourse}
            placeholder={'Select Course'}
            searchable={true}
            searchPlaceholder={`Search Courses from ${valueDept}....`}
            zIndex={1000}
            zIndexInverse={3000}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () =>
              await createSubUser(name, email, value, valueDept, valueCourse)
            }>
            <Text style={styles.buttonText}>Create User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    padding: 10,
    color: '#000',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
    color: '#fff',
    lineHeight: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#003B70',
    opacity: 0.9,
    paddingVertical: 6,
    marginTop: 20,
    width: '94%',
    alignSelf: 'center',
    borderRadius: 8,
  },
});

export default SubUsers;
