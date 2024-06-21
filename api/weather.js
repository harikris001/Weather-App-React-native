import axios from "axios";
import { WEATHER_API_KEY } from "../constants/constant";


const forecastEndpoint = (params) => `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`

const locationEndpoint = (params) => `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${params.city}`

const apiCall = async(endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    };
    
    try {
        const response = await axios.request(options);
        return response.data
    } catch (error) {
        console.error(error);
        return null
    }

}

export const getForecastData = async(params) => {
    return await apiCall(forecastEndpoint(params))
}

export const getLocationsSeach = async(params) => {
    return await apiCall(locationEndpoint(params))
}