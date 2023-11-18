<template>
    <div class=" fixed bottom-0 z-[999] w-full transition-all" :class="extended ? 'h-[55vh]' : 'h-[25vh]'">
        <div class="px-4 pt-4">        
            <div class="transition-all font-main flex  items-center mb-2" v-show="!extended">
                <span class="text-[22px] font-bold">Hello, {{ user.data.name }}</span>
                <div class="ml-auto mt-1"><i class="fi fi-rr-settings-sliders"></i></div>
            </div>
            <div class="relative">
                <input type="text" @keyup="$emit('extend')" class="py-3 pr-4 pl-12 bg-gray-100 w-full rounded-lg outline-none font-main" placeholder="Where to?" ref="searchInput"/>
                <div class="absolute top-[1PX] h-12 w-12 flex items-center justify-center text-gray-700"><i class="fi fi-br-search"></i></div>
            </div>
        </div>

        <div v-if="parkingView">
            <ParkingsCarousel :nearest-parkings="nearestParkings" />
        </div>
        <div class="px-4 font-main flex mt-4">
            <div class="flex items-center"><span class="font-semibold mr-2">{{ user.data.cars[0] }}</span> <div class="h-4 w-4 text-sm bg-main rounded-full flex items-center justify-center text-white"><i class="fi fi-rr-angle-small-up mt-[3px]"></i></div></div>
            <div class="flex items-center ml-auto"><img src="visa.png" class="h-4 mr-1"/>9648</div>
        </div>

    </div>
</template>

<script setup>
const props = defineProps({
    extended: Boolean,
})

const parkingView = ref(false);
const searchInput = ref();
const parkings = useParkings();
const user = useCurrentUser();
console.log(user.value)

const nearestParkings = ref([]);

const parkingsToCoordArray = () => {
    var result = [];
    for(let [index, parking] of parkings.value.entries()) {
        if(parking.occupied_spots < parking.available_spots) {
            result.push({
                lat: parseFloat(parking.lat),
                lng: parseFloat(parking.lng),
            })
            nearestParkings.value.push({
                parkingIndex: index,
                driving: {
                    distance: null, 
                    duration: null,
                },
                walking: {
                    distance: null, 
                    duration: null,
                }

            })
        }
    }

    return result;
}

const setNearestParkings = async (destination) => {
    const { $routes } = useNuxtApp();
    const { DistanceMatrixService } = await $routes;

    const parkingsSort = (a, b) => {
        return a.walking.duration.value - b.walking.duration.value;
    }

    var service = new DistanceMatrixService();

    const callback = (response, status) => {
        if (status == 'OK') {
            for (var index = 0; index < nearestParkings.value.length; index++) {
                    nearestParkings.value[index].walking.distance = response.rows[index].elements[0].distance;
                    nearestParkings.value[index].walking.duration = response.rows[index].elements[0].duration; 
                }
            }

            nearestParkings.value.sort(parkingsSort);
            nearestParkings.value.splice(5);

            const updateArray = (response, status) => {
                if (status == 'OK') {
                    for (var index = 0; index < 5; index++) {
                        nearestParkings.value[index].driving.distance = response.rows[0].elements[index].distance;
                        nearestParkings.value[index].driving.duration = response.rows[0].elements[index].duration; 
                    }
                    parkingView.value = true;
                }
            }

            console.log(nearestParkings.value)
            service.getDistanceMatrix({
                origins: [{ lat: 45.7885471, lng: 24.1433768 }],
                destinations: nearestParkings.value.map(parking => ({ 
                    lat: parseFloat(parkings.value[parking.parkingIndex].lat), 
                    lng: parseFloat(parkings.value[parking.parkingIndex].lng) 
                })),
                travelMode: 'DRIVING',
            }, updateArray)
        }        


    service.getDistanceMatrix({
        origins: parkingsToCoordArray(),
        destinations: [ destination ],
        travelMode: 'WALKING',
    }, callback)

}

onMounted( async () => {
    const { $places } = useNuxtApp();
    const { Autocomplete } = await $places;
    const center = ref({ lat: 45.7885471, lng: 24.1433768 });

    const defaultBounds = {
        north: center.value.lat + 0.1,
        south: center.value.lat - 0.1,
        east: center.value.lng + 0.1,
        west: center.value.lng - 0.1,
    };

    const autocomplete = new Autocomplete(searchInput.value, {
        bounds: defaultBounds,
        componentRestrictions: { country: "ro" },
        fields: ["name", "geometry"],
        strictBounds: true, 
    })

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        if (place.geometry.viewport) {
            nearestParkings.value = [];
            setNearestParkings(place.geometry.location);
        }
            
    })

})
</script>

<style>
.pac-container {
    z-index: 10000 !important;
    width: auto !important;
    left: 16px !important;
    right: 16px !important;
    box-shadow: none !important;
    border-top: none !important;
    font-family: 'Figtree', sans-serif;
    font-size: 18px !important;

}
.pac-item {
    border: none !important;
    padding: 6px !important;

}

.pac-item-query {
    font-size: 16px;
    
}
.pac-icon {
    background-image: url('marker.svg') !important;
    background-repeat: no-repeat !important;
    background-size: 16px !important;
    background-position: 0px 1px !important;
}

.pac-container:empty{
    display: none !important;
}
</style>