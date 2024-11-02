import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Header from '../components/header';
import {useDispatch} from 'react-redux';
import {setCred} from '../store/slices/homeSlice';
import firestore from '@react-native-firebase/firestore';
import LearnItem from '../components/learn';
import {PieChart} from 'react-native-chart-kit';

function countFrequency(arr) {
  return arr.reduce((acc, curr) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    return acc;
  }, {});
}

const Learning = ({navigation, route}) => {
  const {learn, name} = route.params;
  const [value, setValue] = useState([]);
  const [chart, setChart] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (learn) {
      const assignmentsCollectionRef =
        firestore().collection('learning_outcome');

      assignmentsCollectionRef
        .where('assignment_id', '==', learn)
        .get()
        .then(querySnapshot => {
          const learnList = [];
          querySnapshot.forEach(documentSnapshot => {
            learnList.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setValue(learnList);
        })
        .catch(error => {
          console.log('Error getting documents: ', error);
        });
    }
  }, [learn]);

  useEffect(() => {
    if (value.length) {
      let hash = countFrequency(value);
      let list = [];
      const profMap = {
        'Emerging Proficient': 'green',
        'Highly Proficient': 'orange',
        Proficient: 'yellow',
        'Not Proficient': 'red',
      };
      const randomColor = [
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
      ];
      Object.entries(hash).forEach(([key, val]) => {
        list.push({
          name: key,
          population: val,
          color: profMap[key]
            ? profMap[key]
            : randomColor[Math.floor(Math.random() * randomColor.length)],
          legendFontColor: '#7F7F7F',
          legendFontSize: 15,
        });
      });
      setChart(list);
    }
  }, [value]);

  const renderLearnList = ({item, index, sperator}) => {
    return <LearnItem learn={item} index={index} />;
  };
  console.log(countFrequency(value));
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  const data = [
    {
      name: 'Seoul',
      population: 21500000,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Toronto',
      population: 2800000,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Beijing',
      population: 527612,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'New York',
      population: 8538000,
      color: '#000',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Moscow',
      population: 11920000,
      color: 'rgb(0, 0, 255)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];
  console.log(chart);
  const total = useMemo(() => {
    return chart.reduce((acc, obj) => acc + obj.population, 0);
  }, [chart]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        name="Learning Outcomes"
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
          You can see list of learning outcomes in {name} course below.
        </Text>
        {chart.length ? (
          <View>
            <PieChart
              data={chart}
              width={650}
              height={220}
              chartConfig={chartConfig}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'0'}
              center={[0, 0]}
            />
            <View style={{marginBottom: 16}}>
              {chart.map(item => (
                <>
                  <View
                    key={item.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        backgroundColor: item.color,
                        marginRight: 10,
                        marginBottom: 4,
                        borderRadius: 15,
                      }}></View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Nunito-Bold',
                        lineHeight: 20,
                        color: item.legendFontColor,
                        marginBottom: 4,
                        textAlign: 'center',
                      }}>
                      {((item.population / total) * 100).toFixed(0)}
                      {'%'} {item.name.split('--')[0]}
                    </Text>
                  </View>
                </>
              ))}
            </View>
          </View>
        ) : null}
        {value.length ? (
          <View style={{height: 400}}>
            <FlatList
              data={value}
              keyExtractor={assignment => assignment.id}
              renderItem={renderLearnList}
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

export default Learning;
