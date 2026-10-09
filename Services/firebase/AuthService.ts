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

// Errors are thrown as Firebase AuthErrors; screens turn their codes into messages (Utils/authErrorMessage).

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<AuthUser> => {
    console.log('Logging with email and password')
    const response = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    return response.user
}

export const loginAnonymously = async (): Promise<AuthUser> => {
    console.log('Logging anonymously')
    const response = await signInAnonymously(getFirebaseAuth())
    return response.user
}

export const registerWithEmailAndPassword = async (email: string, password: string, displayName: string): Promise<AuthUser> => {
    console.log('Registering with email and password')
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
