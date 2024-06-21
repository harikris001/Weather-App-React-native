import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, } from "react-native";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, MapPinIcon, ArrowDownCircleIcon, CalendarDaysIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { debounce } from "lodash";
import { getLocationsSeach, getForecastData } from "../api/weather";
import { weatherIcons } from '../constants/icons'
import * as Progress from 'react-native-progress';
import { storeData, retrieveData } from '../storage/storage';
const Home = () => {

  const [searchToggle, setSearchToggle] = useState(false);
  const [locations, setlocations] = useState([]);
  const [waether, setWeather] = useState({});
  const [loading, setLoading] = useState(true)

  const handleLocation = (loc) => {
    setlocations([]);
    setSearchToggle(false);
    setLoading(true);
    getForecastData({ city: loc.name, days: '7' }).then(
      (data) => {
        setWeather(data);
        setLoading(false);
        storeData('city', loc.name)
      }
    )
  }
  const handleSearch = debounce((text) => {
    if (text.length > 2) {
      getLocationsSeach({ city: text }).then(
        (data) => setlocations(data)
      )
    }

  }, 2000);

  useEffect(() => {
    fetchFirstData();
  }, []
  )
  const fetchFirstData = async () => {
    let savedCity = await retrieveData('city')
    let city = 'New Delhi';
    if (savedCity) {
      city = savedCity;
    }
    await getForecastData({ city: city, days: '7' }).then(
      (data) => {
        setWeather(data)
        setLoading(false)
      }
    )
  }



  return (
    <View className="flex-1 relative">
      <StatusBar hidden={true} />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute w-full h-full"
      />
      {loading ? (
        <View className='flex-1 flex-row justify-center items-center'>
          <Progress.CircleSnail thickness={10} size={140} color='#fff'></Progress.CircleSnail>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">

          {/* Search Bar setup */}

          <View className=" z-10 h-[7%] m-4">
            <View
              className="flex-row justify-end items-center rounded-full"
              backgroundColor={searchToggle ? "rgba(255,255,255,0.3)" : "transparent"}
            >
              {searchToggle ? (
                <TextInput
                  onChangeText={handleSearch}
                  className="text-white pl-6 flex-1 text-base h-10"
                  placeholder="Search City"
                  placeholderTextColor={"lightgray"}
                />

              ) : null
              }

              <TouchableOpacity
                onPress={() => setSearchToggle(!searchToggle)}
                style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                className="p-3 m-1 rounded-full"
              >
                <MagnifyingGlassIcon size={25} color={"white"} />
              </TouchableOpacity>
            </View>
            {/* Search List */}
            <View className="absolute w-full bg-gray-300 top-14 mt-1 rounded-2xl">
              {searchToggle && locations.map((location, index) => {
                let showBorder = locations.length != index + 1
                let borderClass = showBorder ? "border-b-gray-400 border-b-2" : ""
                return (
                  <TouchableOpacity key={index} className={`flex-row items-center p-3 px-4 border-0" ${borderClass}`} onPress={() => handleLocation(location)}>
                    <MapPinIcon size={20} color={"gray"} />
                    <Text>{location?.name}, {location.country}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* Weather data Dispalying */}

          <View className="flex flex-1 justify-around mx-4 items-center">
            <Text className="text-white text-2xl font-bold">{waether?.location?.name},
              <Text className="text-slate-400 text-lg">{" " + waether?.location?.country}</Text>
            </Text>

            <View className="flex-row justify-center">
              <Image source={weatherIcons[waether?.current?.condition?.text]} className="h-56 w-56" />
            </View>

            <View className="space-y-2 flex items-center">
              <Text className="text-white text-5xl font-bold">{waether?.current?.temp_c}°C
                <Text className='text-gray-400 semibold' style={{ fontSize: 18 }}> {waether?.current?.feelslike_c}</Text>
              </Text>
              <Text className="text-white text-xl font-bold tracking-widest">{waether?.current?.condition?.text}</Text>
            </View>

            {/* Other Info */}
            <View className="flex flex-row justify-around w-full mx-4">
              <View className="items-center space-x-2">
                <Image source={require("../assets/icons/wind.png")} className="h-5 w-5" />
                <Text className="text-white text-base">{waether?.current?.wind_kph} Km</Text>
              </View>

              <View className="items-center space-x-2">
                <Image source={require("../assets/icons/drop.png")} className="h-5 w-5" />
                <Text className="text-white text-base">{waether?.current?.humidity}% </Text>
              </View>

              <View className="items-center space-x-2">
                <ArrowDownCircleIcon color={"white"} className="h-5 w-5" />
                <Text className="text-white text-base">{waether?.current?.pressure_mb} Pa</Text>
              </View>
            </View>



            {/* Future forecast */}
            <View className="w-full gap-2">
              <View className="flex flex-row items-center">
                <CalendarDaysIcon color={"white"} className="h-1 w-1" />
                <Text className="text-xs text-slate-400 ml-2">Daily Forecast Forecast</Text>
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{ paddingHorizontal: 8 }} bounces={true} >
                {waether?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date)
                  let dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                  return (
                    <View key={index} className="flex justify-between items-center rounded-2xl py-3 w-24 mx-1" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                      <Image className="h-8 w-8" source={weatherIcons[item?.day?.condition?.text]} />
                      <Text className="text-white text-sm font-light">{dayName.split(',')[0]}</Text>
                      <Text className="text-white font-bold">{item?.day?.avgtemp_c}°C</Text>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}

    </View>
  );
};

export default Home;
