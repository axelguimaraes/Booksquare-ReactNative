import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth"
import { FIREBASE_AUTH } from "../config/firebase"

const auth = FIREBASE_AUTH

export const loginWithEmailAndPassword = async (email, password) => {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        return response
    } catch(error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginWithGoogle = async () => {
    try {
        
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

export const registerWithEmailAndPassword = async (email, password) => {
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        return response
    } catch(error: any) {
        console.log(error)
        alert('Erro ao tentar registar: ' + error.message)
    }
}