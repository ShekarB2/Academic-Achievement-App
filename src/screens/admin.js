import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../components/header';
import {useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {readFile} from 'react-native-fs';

const Admin = ({navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const requiredColumns = [
    'account id',
    'account name',
    'course id',
    'course name',
    'course sis id',
    'assessment id',
    'assessment title',
    'learning outcome id',
    'learning outcome name',
    'learning outcome rating',
  ];

  const manipulateData = async data => {
    // Check if all required columns are present
    const allColumnsPresent = requiredColumns.every(column =>
      data[0].includes(column),
    );

    if (allColumnsPresent) {
      // Convert array of arrays to array of objects
      const dataArray = data.map(row => {
        const obj = {};
        requiredColumns.forEach((column, index) => {
          obj[column] = row[data[0].indexOf(column)];
        });
        return obj;
      });

      // Drop rows with NaN values
      const cleanedData = dataArray.filter(item =>
        Object.values(item).every(
          value => value !== null && value !== undefined,
        ),
      );

      // Group by specified columns
      const groupedData = cleanedData.reduce((acc, item) => {
        const key = requiredColumns.map(column => item[column]).join('_');
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
      }, {});

      // Convert grouped data back to an array
      const groupedArray = Object.values(groupedData)
        .flat()
        .map(item => Object.values(item));

      // Print or use groupedArray as needed
      console.log(groupedArray);

      const ws = XLSX.utils.aoa_to_sheet(groupedArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Create a directory for storing temporary files
      const dirPath = RNFS.DownloadDirectoryPath + '/GDPExports';
      await RNFS.mkdir(dirPath);

      // Generate a unique file name
      const fileName = `exported_data_${Date.now()}.xlsx`;
      const filePath = `${dirPath}/${fileName}`;

      // Write the workbook to a file
      const writeFileOptions = {encoding: 'utf8'};
      RNFS.writeFile(
        filePath,
        XLSX.write(wb, {bookType: 'xlsx', type: 'binary'}),
        writeFileOptions,
      )
        .then(() => {
          // Use the filePath to open or share the file
          // console.log(`File saved at: ${filePath}`);
          setLoading(false);
          setSuccess(`File saved at: ${filePath}`);
          // Example: open the file
          // RNFS.open(
          //   filePath,
          //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          // );
        })
        .catch(err => {
          console.log('Error writing file:', err);
          setLoading(false);
          setError(`Error writing file: ${err}`);
        });
    } else {
      console.log('Not all required columns are present in the original data.');
      setLoading(false);
      setError('Not all required columns are present in the original data.');
    }
  };

  const uploadData = async data => {
    // Check if all required columns are present
    let dept = {};
    let course = {};
    let assignment = {};
    let learning = [];
    const allColumnsPresent = requiredColumns.every(
      (column, index) => data[0][index] === column,
    );
    if (allColumnsPresent) {
      data.forEach((item, index) => {
        if (index) {
          dept[item[0]] = dept[item[0]] || {};
          course[item[2]] = course[item[2]] || {};
          assignment[item[5]] = assignment[item[5]] || {};
          dept[item[0]] = {
            id: item[0].toString(),
            name: item[1],
          };
          course[item[2]] = {
            id: item[2].toString(),
            course_name: item[3],
            dept_id: item[0].toString(),
          };
          assignment[item[5]] = {
            id: item[5].toString(),
            course_id: item[2].toString(),
            title: item[6],
          };
          learning.push({
            assignment_id: item[5].toString(),
            outcome_id: item[7].toString(),
            outcome_name: item[8],
            rating: item[9],
          });
        }
      });
      return {
        dept: Object.values(dept),
        course: Object.values(course),
        assignment: Object.values(assignment),
        learning: learning,
      };
    } else {
      console.log(
        `looks like it is not cleaned file. Missing the order of columns. should be in ${requiredColumns.join(
          ', ',
        )}`,
      );
      setLoading(false);
      setError(
        `looks like it is not cleaned file. Missing the order of columns. should be in ${requiredColumns.join(
          ', ',
        )}`,
      );
    }
  };

  const ReadCSV = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res[0].uri);
      console.log(res[0].type != 'text/comma-separated-values');
      if (
        res[0].type != 'text/comma-separated-values' &&
        res[0].type != 'text/csv' &&
        res[0].type !=
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        res[0].type != 'application/vnd.ms-excel'
      ) {
        setError('Unsupported file format. Try using csv!');
        setLoading(false);
        return;
      }
      const fileContent = await readFile(res[0].uri, 'utf8'); // Read the file content
      const workbook = XLSX.read(fileContent, {type: 'binary'});
      const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});
      manipulateData(jsonData);
    } catch (e) {
      setLoading(false);
      if (e.message.includes('User canceled')) {
        Alert.alert(
          'File Selection Cancelled',
          'You cancelled the file selection.',
        );
      } else {
        console.error('Error reading CSV file:', e);
      }
    }
  };

  const uploadDb = async (data, collection) => {
    setSuccess(`Started uploading to ${collection}`);
    const batch = firestore().batch();
    const collectionRef = firestore().collection(collection);
    // const batchDocIds = new Set(data.map(doc => doc.id));
    const mapper = {};
    await collectionRef.get().then(snapshot => {
      // Loop through the existing documents
      snapshot.forEach(doc => {
        // const docId = doc._data.id ? doc._data.id : '';
        mapper[doc._data.id] = doc.id;
        // if (!batchDocIds.has(docId)) {
        //   // If the document ID is not present in the batch, delete it
        //   batch.delete(doc.ref);
        // }
      });
    });

    for (const doc of data) {
      const id = mapper[doc.id] ? mapper[doc.id] : null;
      const docRef = await firestore().collection(collection).doc(id);

      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        batch.update(docRef, doc);
      } else {
        batch.set(docRef, doc);
      }
    }

    console.log('end');

    await batch
      .commit()
      .then(() => {
        console.log('Documents created/updated successfully');
        setSuccess(`finished uploading to ${collection}`);
      })
      .catch(err => {
        console.error('Error creating/updating documents: ', err);
        setSuccess('');
      });
  };

  const uploadLearn = async (data, collection) => {
    setSuccess(`Started uploading to ${collection}`);
    const batch = firestore().batch();
    // const collectionRef = firestore().collection(collection);
    // await collectionRef.get().then(snapshot => {
    //   snapshot.forEach(doc => {
    //     batch.delete(doc.ref);
    //   });
    // });

    for (const doc of data) {
      const docRef = await firestore().collection(collection).doc();
      batch.set(docRef, doc);
    }

    console.log('end');

    await batch
      .commit()
      .then(() => {
        console.log('Documents created/updated successfully');
        setSuccess(`finished uploading to ${collection}`);
      })
      .catch(err => {
        console.error('Error creating/updating documents: ', err);
        setSuccess('');
      });
  };

  const uploadCSV = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res[0].uri);
      console.log(res[0].type != 'text/comma-separated-values');
      if (
        res[0].type != 'text/comma-separated-values' &&
        res[0].type != 'text/csv' &&
        res[0].type !=
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        res[0].type != 'application/vnd.ms-excel'
      ) {
        setError('Unsupported file format. Try using csv!');
        setLoading(false);
        return;
      }
      const fileContent = await readFile(res[0].uri, 'utf8'); // Read the file content
      const workbook = XLSX.read(fileContent, {type: 'binary'});
      const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});
      const {dept, course, assignment, learning} = await uploadData(jsonData);
      // console.log(dept);
      // console.log(course);
      // console.log(assignment);
      // console.log(learning);
      await uploadDb(dept, 'Departments');
      await uploadDb(course, 'courses');
      await uploadDb(assignment, 'assignments');
      await uploadLearn(learning, 'learning_outcome');
      setLoading(false);
      setSuccess('Data Uploaded to db');
    } catch (e) {
      setLoading(false);
      if (e.message.includes('User canceled')) {
        Alert.alert(
          'File Selection Cancelled',
          'You cancelled the file selection.',
        );
      } else {
        console.error('Error reading CSV file:', e);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Admin Portal"
        login={() => {
          dispatch(setCred({username: '', password: ''}));
          navigation.popToTop();
        }}
      />
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
      <TouchableOpacity
        style={loading ? styles.disabled : styles.button}
        onPress={() => ReadCSV()}
        disabled={loading}>
        <Text style={styles.buttonText}>Clean Excel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={loading ? styles.disabled : styles.button}
        onPress={() => uploadCSV()}
        disabled={loading}>
        <Text style={styles.buttonText}>Bulk Upload Excel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={loading ? styles.disabled : styles.button}
        onPress={() => navigation.navigate('subUsers')}
        disabled={loading}>
        <Text style={styles.buttonText}>Add Sub Users</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  disabled: {
    backgroundColor: '#003B70',
    paddingVertical: 12,
    marginTop: 20,
    width: '94%',
    alignSelf: 'center',
    borderRadius: 8,
    opacity: 0.5,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'green',
    lineHeight: 30,
    textAlign: 'center',
    opacity: 0.6,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'red',
    lineHeight: 30,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontFamily: 'Nunito-Regular',
    color: '#003B70',
    lineHeight: 40,
    textAlign: 'center',
  },
});

export default Admin;
