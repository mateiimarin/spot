<template>
    <div class="font-main p-4 ">
        <div class="text-center text-lg font-bold mb-6">Parking Session</div>
        <div class="w-full flex justify-center mb-3"><img src="car_iso.jpeg" class="w-40 h-40 border-4 rounded-full"/></div>
        <div class="text-4xl font-extrabold text-center mb-4">{{  user.data.cars[0] }}</div>
        <div class="border-2 rounded-md p-3 mb-12">
            <div class="flex mb-3">
                <div class="font-semibold">Parked at</div>
                <div class="ml-auto">{{ car.start_park.getHours() }}:{{ car.start_park.getMinutes() }}</div>
            </div>
            <div class="flex">
                <div class="font-semibold">Parking </div>
                <div class="ml-auto">{{ car.parking }}</div>
            </div>
        </div>
        <div class="flex justify-center"><div class="w-1/2 h-10 flex justify-center items-center bg-[#04AA5E] rounded-full text-gray-50 tracking-wide" @click="end">End Park</div></div>
        
    </div>
</template>

<script setup>
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const user = useCurrentUser();
const car = ref();

const { $db } = useNuxtApp();
if($db) {
    const carRef = doc($db, "cars", user.value.data.cars[0]);
    const carSnap = await getDoc(carRef);

    car.value = {
        brand: carSnap.data().brand,
        start_park: carSnap.data().start_park.toDate(),
        parking: carSnap.data().parking,
    };
    console.log(car.value)
}

const end = async () => {
    const { $db } = useNuxtApp();
    await updateDoc(doc($db, "cars", user.value.data.cars[0]), {
        start_park: null,
        parking: null,
    });
    navigateTo('/');
}
</script>

<style lang="scss" scoped>

</style>