<template>
    <div>
        <div ref="map" :class="minimized ? 'h-[45vh]' : 'h-[75vh]'"></div>
    </div>
</template>

<script setup>
import { onSnapshot, collection } from 'firebase/firestore';

onMounted(async () => {
    await initMap();
})

const props = defineProps({
    minimized: Boolean,
})

const map = ref();
const markers = useParkings();

var mapObject, directionsRenderer, directionsService;
const addMarker = async (options) => {
    
    const { $maps } = useNuxtApp();
    const { AdvancedMarkerElement } = await $maps;

    const marker = new AdvancedMarkerElement({
        map: mapObject,
        position: options.position,
        title: options.title,
    });
}

const buildMarker = (markerElement, parking) => {
    console.log(markerElement)
    markerElement.innerHTML = `<div>${parking.available_spots - parking.occupied_spots}</div>`;
    const percentage = (parking.occupied_spots / parking.available_spots)*100;
    if (percentage <= 60) {
        markerElement.style.backgroundColor = "#13b240";
    } else if (percentage <= 80) {
        markerElement.style.backgroundColor = "#e29014";
    } else if (percentage < 100) {
        markerElement.style.backgroundColor = "#e01a1a";
    } else if (percentage == 100)  markerElement.style.backgroundColor = "#595959";
}

const updateMarkers = () => {
    for(let index = 0; index<markers.value.length; index++) {
        const marker = document.getElementById(`parking_${index}`)
        console.log(marker);
        buildMarker(marker, markers.value[index])
    }
}

const watchMap = () => {
    const { $db } = useNuxtApp();
    if($db) {
        onSnapshot(collection($db, "parkings"), (snapshot) => {
            const parkings = useParkings();
            parkings.value = [];
            snapshot.forEach((parking) => {
                parkings.value.push(parking.data());
            })
            updateMarkers();
        })     
    }
}

const initMap = async () => {
    const center =  { lat: 45.7885471, lng: 24.1433768};

    const { $maps, $routes  } = useNuxtApp();
    const { Map, AdvancedMarkerElement } = await $maps;
    const { DirectionsService, DirectionsRenderer } = await $routes;

    directionsService = new DirectionsService();
    directionsRenderer = new DirectionsRenderer();

    mapObject = new Map(map.value, {
        center: center,
        zoom: 15,
        disableDefaultUI: true,
        mapId: "4e32da87fc11282a",
    })

    directionsRenderer.setMap(mapObject);
    
 
        for(let i=0; i<markers.value.length; i++) {
            const parkingMarker = document.createElement("div");
            parkingMarker.className = "parkingMarker";
            parkingMarker.id = `parking_${i}`;
            buildMarker(parkingMarker, markers.value[i]);
            const marker = new AdvancedMarkerElement({
                map: mapObject,
                position: { lat: parseFloat(markers.value[i].lat), lng: parseFloat(markers.value[i].lng) },
                content: parkingMarker,
            });
            if(i == markers.value.length-1) watchMap();
        }
}  

const getDirections = async (newParkingCoordinates) => {
    directionsService.route({
      origin: { lat: 45.7885471, lng: 24.1433768},
      destination: newParkingCoordinates,
      travelMode: 'DRIVING',
    }, (result, status) => {
        if(status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    })
}

const currentParkingInPreview = useCurrentParkingInPreview();
watch(currentParkingInPreview, (newParkingIndex, oldParkingIndex) => {
    let newParking = markers.value[newParkingIndex];
    console.log({ lat: parseFloat(newParking.lat), lng: parseFloat(newParking.lng)})
    getDirections({ lat: parseFloat(newParking.lat), lng: parseFloat(newParking.lng)});
})  


defineExpose({
    addMarker,
})


</script>

<style>
.parkingMarker {
    height: 27px;
    width: 27px;
    border-radius: 20px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f7f7f7;
    font-weight: 600;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
}
</style>