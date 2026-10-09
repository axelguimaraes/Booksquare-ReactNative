import {
    createUserWithEmailAndPassword,
    onAuthStateChanged as onFirebaseAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updateProfile,
} from "firebase/auth"
import { getFirebaseAuth } from "../../config/firebase"
import { AuthUser, User } from "../../Models/User"
import { addUser } from "../UsersService"

export const loginWithEmailAndPassword = async (email, password): Promise<AuthUser | undefined> => {
    console.log('Logging with email and password')
    try {
        const response = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
        return response.user
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

export const loginAnonymously = async (): Promise<AuthUser | undefined> => {
    console.log('Logging anonymously')
    try {
        const response = await signInAnonymously(getFirebaseAuth())
        return response.user
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const registerWithEmailAndPassword = async (email, password, displayName): Promise<AuthUser | undefined> => {
    console.log('Registering with email and password')
    try {
        const userCredential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
        const user = userCredential.user
        await updateProfile(user, { displayName: displayName })

        const newUser: User = {
            userId: user.uid,
            displayName: displayName,
            email: email
        }

        await addUser(newUser)

        return user
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar registar: ' + error.message)
    }
}

export const getCurrentUser = (): AuthUser | null => getFirebaseAuth().currentUser

export const onAuthStateChanged = (callback: (user: AuthUser | null) => void): (() => void) =>
    onFirebaseAuthStateChanged(getFirebaseAuth(), callback)

export const logout = async (): Promise<void> => {
    await signOut(getFirebaseAuth())
}

export const updateCurrentUserProfile = async (profile: { displayName?: string, photoURL?: string }): Promise<void> => {
    await updateProfile(getFirebaseAuth().currentUser, profile)
}

export const updateCurrentUserEmail = async (email: string): Promise<void> => {
    await updateEmail(getFirebaseAuth().currentUser, email)
}
