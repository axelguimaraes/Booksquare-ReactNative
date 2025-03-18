import { GoogleAuthProvider, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { FIREBASE_AUTH, FIREBASE_DB } from "../config/firebase"
import { User } from "../Models/User"
import { addDoc, collection } from "firebase/firestore"

const auth = FIREBASE_AUTH
const provider = new GoogleAuthProvider()

export const loginWithEmailAndPassword = async (email, password) => {
    console.log('Logging with email and password')
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginWithGoogle = async () => {
    console.log('Logging with google')
    try {
        // TODO: Login with google
        alert('Funcionalidade de momento não suportada.')
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginAnonymously = async () => {
    console.log('Logging anonymously')
    try {
        const response = await signInAnonymously(auth)
        return response
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const registerWithEmailAndPassword = async (email, password, displayName) => {
    console.log('Registering with email and password')
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await updateProfile(user, { displayName: displayName })

        const newUser: User = {
            userId: user.uid,
            displayName: displayName,
            email: email
        }

        await addDoc(collection(FIREBASE_DB, 'users'), newUser)

        return user
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar registar: ' + error.message)
    }
}