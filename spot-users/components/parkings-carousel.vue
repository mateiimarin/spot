<template>
    <div>
        <div class="card-wrapper py-6">
            <div v-for="(parking, index) in nearestParkings" class="card w-[calc(100%_-_32px)] mx-4 rounded-lg border-2 shadow-lg shadow-gray-100 p-3" :id="index">
                <div class="flex items-center">
                    <h3 class="text-xl font-bold">{{ parkings[parking.parkingIndex].name }}</h3>
                    <div class="ml-auto h-8 w-8 rounded-full flex justify-center items-center text-white" :class="`bg-[${getColorCode(parkings[parking.parkingIndex].available_spots, parkings[parking.parkingIndex].occupied_spots)}]`">{{ parkings[parking.parkingIndex].available_spots - parkings[parking.parkingIndex].occupied_spots }}</div>
                </div>
                <div class="flex items-center justify-center my-5">
                    <InfoCard icon="fi-rr-car-side">
                        <template v-slot:content>{{ parking.driving.duration.text }}</template>
                        <template v-slot:label>DRIVE</template>
                    </InfoCard>
                    
                    <InfoCard icon="fi-rr-running">
                        <template v-slot:content>{{ parking.walking.duration.text }}</template>
                        <template v-slot:label>WALK</template>
                    </InfoCard>
                    
                    <InfoCard icon="fi-rr-usd-circle">
                        <template v-slot:content>0.04RON</template>
                        <template v-slot:label>PRICE/MIN</template>
                    </InfoCard>
                </div>
                <div class="flex gap-2.5 font-main">
                    <div class="w-1/2 h-10 flex justify-center items-center bg-[#13b240] rounded-full text-gray-50 tracking-wide" @click="park">Park</div>
                    <div class="w-1/2 h-10 flex justify-center items-center bg-gray-100 rounded-full">Reserve</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {Timestamp, doc, updateDoc } from "firebase/firestore";


const props = defineProps({
    nearestParkings: Array, 
})

const user = useCurrentUser();
const emit = defineEmits(['parkingChange']);

const parkings = useParkings();
const currentCard = useCurrentParkingInPreview();

const getColorCode = (available_spots, occupied_spots) => {
    const percentage = (occupied_spots / available_spots)*100;
    console.log(`percentage: ${percentage}`)
    return "#dd1a1a";
}

const park = async () => {
    const { $db } = useNuxtApp();
    await updateDoc(doc($db, "cars", user.value.data.cars[0]), {
        start_park: Timestamp.now(),
        parking: parkings.value[currentCard.value].name,
    });
    navigateTo('parking-session');
}

onMounted(() => {
    let options = {
        root: document.querySelector('.card_wrapper'),
        rootMargin: '0px',
        threshold: 1.0 
    }

    let callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
                let cardIndex = parseInt(entry.target.id);
                currentCard.value = props.nearestParkings[cardIndex].parkingIndex;
            }
        });
    };
        let observer = new IntersectionObserver(callback, options);
        document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
})
</script>

<style scoped>
.card {
    flex: 0 0 auto;
    scroll-snap-align: center;
    scroll-snap-stop: always;
}

.card-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    user-select: none;
}
</style>