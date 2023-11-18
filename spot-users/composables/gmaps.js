import { collection, getDocs, onSnapshot } from "firebase/firestore"

const getUserPosition = () => {
    return { lat: 45.7885471, lng: 24.1433768};
}

export const useParkings = () => useState('parkings', () => []);

export const getParkings = async () => {
    const { $db } = useNuxtApp();
    if($db) {
        const parkings = useParkings();
        const parkingsSnapshot = await getDocs(collection($db, "parkings"));
        parkingsSnapshot.forEach((parking) => {
            console.log(parking.data())
            parkings.value.push(parking.data());
        })
        console.log(parkings.value)
    }
}



