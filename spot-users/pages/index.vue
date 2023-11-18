<template>
    <div>
        <gmap ref="map" @click="isCardExtended = false" :minimized="isCardExtended"/>
        <controlCard @extend="isCardExtended = true" :extended="isCardExtended"/>
    </div>
</template>

<script setup>
const map = ref();
const isCardExtended = ref(false);
const success = (position) => {
    console.log(position.coords)
    map.value.addMarker({
        position: { lat: position.coords.latitude, lng: position.coords.longitude},
        title: "user_lox",
    })
}

const error = (err) => {
    alert(`ERROR(${err.code}): ${err.message}`);
}

onMounted(() => {
    var watcher = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    })
})

</script>

<style scoped>

</style>