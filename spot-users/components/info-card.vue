<template>
    <div class="w-1/3 flex items-center">
        <div class="flex items-center">
            <div class="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-2"><i :class="`fi ${icon}`"></i></div>
            <div>
                <div class="font-semibold w-full"><slot name="content"></slot></div>
                <div class="text-xs font-main text-gray-500"><slot name="label"></slot></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    icon: String, 
})
</script>

<style lang="scss" scoped>

</style>