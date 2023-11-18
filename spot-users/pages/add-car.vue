<template>
    <div class="flex items-center h-screen px-4">
        <div>
            <div class="flex justify-center"><img src="car_iso.jpeg" class="w-32 h-32 rounded-full mb-3"/></div>
            <h1 class="text-3xl font-bold mb-5 font-main text-center">Add a Car</h1>
            <form  @submit.prevent="create">
                <input type="text" placeholder="Registration Plate" v-model="car.registration" class="focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition mb-2.5 px-3 py-2 w-full border-2 rounded border-gray-200" required/>
                <input type="text" placeholder="Car Brand" v-model="car.brand" class="focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition mb-2.5 px-3 py-2 w-full border-2 rounded border-gray-200" required/>
                <p v-if="errorMessage" class="text-center text-red-500 font-bold mb-3.5">{{ errorMessage }}</p>
                <input type="submit" class="w-full bg-[#1B2565] rounded p-3 text-white text-sm tracking-wider font-semibold mb-5 cursor-pointer" />
            </form>
        </div>
    </div>
</template>

<script setup>

import {doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
const car = ref({ registration: "", brand: "" });
const errorMessage = ref();

const isCarRegistrationAvailable = async (registration) => {

    const { $db } = useNuxtApp();
    const car = await getDoc(doc($db, "cars", registration));

    if(car.exists()) return false;
    return true;
}

const create = async () => {
    const { $db } = useNuxtApp();
    car.value.registration = car.value.registration.replace(/\s+/g, '');
    const isAvailable = await isCarRegistrationAvailable(car.value.registration);

    if(isAvailable) {
        await setDoc(doc($db, "cars", car.value.registration), {
            brand: car.value.brand, 
            start_park: null,
            parking: null,
        })

        const user = useCurrentUser();
        await updateDoc(doc($db, "users", user.value.uid), {
            cars: arrayUnion(car.value.registration), 
        })

        user.value.data.cars.push(car.value.registration);

        navigateTo('/')
    }
    else errorMessage.value = "This car is already registered";
}
</script>

<style lang="scss" scoped>

</style>