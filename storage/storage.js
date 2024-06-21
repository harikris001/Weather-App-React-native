const { default: AsyncStorage } = require("@react-native-async-storage/async-storage")

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

export const retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
    } catch (e) {
        console.log(e)
    }
}