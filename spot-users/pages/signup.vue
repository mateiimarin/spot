<template>
    <div class="h-screen flex items-center justify-center px-4">
            <div>
                <ClientOnly>
                    <div class="flex justify-center"><img src="logo-spot.png" class="h-36"/></div>
                    <h1 class="text-3xl font-bold mb-5 font-main text-center">Welcome to Spot</h1>
                    <hr class="mb-2"/>
                    <form  @submit.prevent="signup">
                        <input type="text" placeholder="Your Name" v-model="credentials.name" class="focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition mb-2.5 px-3 py-2 w-full border-2 rounded border-gray-200" required/>
                        <input type="text" placeholder="Your Email" v-model="credentials.email" class="focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition mb-2.5 px-3 py-2 w-full border-2 rounded border-gray-200" required/>
                        <input type="password" placeholder="Your Password" v-model="credentials.password" class="focus:outline-none focus:border-blue-400 bg-gray-50 focus:bg-white transition mb-6 px-3 py-2 w-full border-2 rounded border-gray-200" required/>
                        
                        <input type="submit" class="w-full bg-[#1B2565] rounded p-3 text-white text-sm tracking-wider font-semibold mb-5 cursor-pointer" />
                    </form>
                    <p v-if="errorMessage" class="text-center text-red-500 font-bold mb-3.5">{{ errorMessage }}</p>
                    <p class="text-center"><span class="text-gray-500">Already have an account?</span> <NuxtLink to="/login" class="font-bold">Login</NuxtLink></p>
                </ClientOnly>
            </div>             
    </div>
</template>

<script setup>
import { createUserWithEmailAndPassword } from "firebase/auth"
import {setDoc, doc} from "firebase/firestore"
    
const credentials = ref({ name: "", email: "", password: ""});
const errorMessage = ref();

const signup = () => {

    const { $db, $auth} = useNuxtApp();

    if(credentials.value.name != "") {
        createUserWithEmailAndPassword($auth, credentials.value.email, credentials.value.password)
        .then( async (data) => {
            await setDoc(doc($db, "users", data.user.uid), {
                name: credentials.value.name,
                email: credentials.value.email,
                cars: [],
            });

            await initUser();
            navigateTo('add-car');

        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    errorMessage.value = "Invalid Email"
                    break;
                case "auth/email-already-in-use":
                    errorMessage.value = "Email already registered"
                    break;
                case "auth/weak-password":
                    errorMessage.value = "Password should be at least 6 characters long"
                    break;
                default:
                    errorMessage.value = "Invalid Email or Password"
                    break;
            }
        })
    } else errorMessage.value = "Name field can't be blank";        
};
</script>

<style lang="scss" scoped>

</style>