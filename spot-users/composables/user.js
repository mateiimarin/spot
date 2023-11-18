import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"

export const useCurrentUser = () => useState('currentUser', () => null)

const getCurrentUser = () => {
    const { $auth } = useNuxtApp();
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            $auth,
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        )
    })
}

export const initUser = async () => {
    const { $db } = useNuxtApp();
    const userRef = await getCurrentUser();
    if(userRef) {
        const user = await getDoc(doc($db, "users", userRef.uid));

        const currentUser = useCurrentUser();
        currentUser.value = new Object({ uid: userRef.uid, data: user.data()});

    }
}