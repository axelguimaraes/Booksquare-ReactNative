import { GoogleAuthProvider, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { FIREBASE_AUTH } from "../config/firebase"

const auth = FIREBASE_AUTH
const provider = new GoogleAuthProvider()

export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        return response
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginWithGoogle = async () => {
    try {
        // TODO: Login with google
        alert('Funcionalidade de momento não suportada.')
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginAnonymously = async () => {
    try {
        const response = await signInAnonymously(auth)
        return response
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const registerWithEmailAndPassword = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await updateProfile(user, {displayName: displayName})
        return user
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar registar: ' + error.message)
    }
}