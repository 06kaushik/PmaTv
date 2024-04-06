import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {COLORS} from '../../components/GlobalStyle';
import RNFS from 'react-native-fs';
import {BarChart, PieChart} from 'react-native-gifted-charts';

const StorageScreen1 = ({navigation}) => {
  const [freestorage, setFreeStorage] = useState('');
  const [totalstorage, setTotalStorage] = useState('');
  const pieChart = [
    {
      value: 20,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
      focused: true,
    },
    {value: 7, color: '#93FCF8', gradientCenterColor: '#3BE9DE'},
  ];
  console.log('PIE DATA', pieChart);

  useEffect(() => {
    RNFS.getFSInfo()
      .then(info => {
        console.log('Device storage info:', info);
        setFreeStorage(info?.freeSpace);
        setTotalStorage(info?.totalSpace);
      })
      .catch(error => {
        console.log('Error getting device storage info:', error);
      });
  }, []);

  //////// TOTAL STORAGE //////////
  function totalStoragee() {
    const gb = totalstorage / 1073741824;
    return gb.toFixed(2);
  }

  const bytes = totalstorage;
  const gb = totalStoragee(bytes);
  console.log(`${bytes} bytes is equal to????? ${gb} GB`);

  ///// USED STORAGE //////////
  function FreeStoragee() {
    const gb = freestorage / 1073741824;
    return gb.toFixed(2);
  }

  const bytess = freestorage;
  const gbb = FreeStoragee(bytes);
  console.log(`${bytes} bytes is equal to????? ${gbb} GB`);

  const renderDot = color => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            bottom: 230,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginRight: 20,
              margin: 5,
            }}>
            {renderDot('#5FCA5D')}
            <Text style={{color: 'black', bottom: 5}}>
              Total Storage: {totalstorage}
            </Text>
          </View>
          <View style={{flexDirection: 'row', margin: 5}}>
            {renderDot('red')}
            <Text style={{color: 'black', bottom: 5}}>
              Free Storage: {freestorage}
            </Text>
          </View>
        </View>
      </>
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    navigation.navigate('Settings1');
    return true; // Return true to prevent the default back button action
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.background}}>
      <View
        style={{
          marginTop: 40,
          marginLeft: 16,
          marginRight: 16,
          alignSelf: 'center',
        }}>
        <Text
          style={{color: 'white', fontWeight: 'bold', fontSize: 24, right: 60}}>
          Storage
        </Text>
      </View>
      <View style={{alignSelf: 'center', marginTop: 20}}>
        <PieChart
          data={pieChart}
          donut
          showGradient
          sectionAutoFocus
          radius={50}
          innerRadius={30}
          // centerLabelComponent={() => {
          //     return (
          //         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          //             <Text
          //                 style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>

          //             </Text>
          //             <Text style={{ fontSize: 14, color: 'black' }}>Total Order</Text>
          //         </View>
          //     );
          // }}
        />
      </View>
      {/* {renderLegendComponent()} */}
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 10,
        }}>
        {gb}/{gbb} GB
      </Text>

      <View
        style={{
          borderWidth: 1,
          height: 107,
          width: 406,
          alignSelf: 'center',
          marginTop: 20,
          borderRadius: 5,
          backgroundColor: 'rgba(214, 194, 255, 0.1)',
          borderColor: 'rgba(214, 194, 255, 0.1)',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 16,
            marginTop: 10,
          }}>
          Total Internal Storage {gb} GB
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 16,
            marginTop: 20,
          }}>
          Free Internal Storage {gbb} GB
        </Text>
      </View>

      <View
        style={{
          borderWidth: 1,
          height: 57,
          width: 386,
          alignSelf: 'center',
          marginTop: 20,
          borderRadius: 5,
          backgroundColor: 'rgba(214, 194, 255, 0.1)',
          borderColor: 'rgba(214, 194, 255, 0.1)',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginLeft: 16,
            marginTop: 10,
            textAlign: 'center',
          }}>
          Downloaded content will be automatically deleted before downloading
          new schedule.
        </Text>
      </View>
    </View>
  );
};

export default StorageScreen1;