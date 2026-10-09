import uuid from 'react-native-uuid'
import { MockAccount } from '../../DummyData/MockData'
import { AuthUser } from '../../Models/User'
import { addUser } from '../UsersService'
import { mockStore } from './mockStore'

let currentUser: AuthUser | null = null
let restoring: Promise<void> | undefined
const authListeners = new Set<(user: AuthUser | null) => void>()

const authError = (code: string) => new Error(`Mock auth: Error (auth/${code}).`)

const toAuthUser = ({ uid, displayName, email, photoURL, isAnonymous }: MockAccount): AuthUser =>
    ({ uid, displayName, email, photoURL, isAnonymous })

// Restores the persisted session once, like Firebase Auth does with AsyncStorage persistence.
const restoreSession = () => (restoring ??= (async () => {
    const [accounts, session] = await Promise.all([mockStore.read('accounts'), mockStore.read('session')])
    const account = accounts.find((a) => a.uid === session)
    currentUser = account ? toAuthUser(account) : null
})())

// Like Firebase, listeners only hear about actual sign-ins and sign-outs.
const setSession = async (account: MockAccount | null) => {
    await restoreSession()
    if ((currentUser?.uid ?? null) === (account?.uid ?? null)) return
    await mockStore.write('session', () => account?.uid ?? null)
    currentUser = account ? toAuthUser(account) : null
    authListeners.forEach((listener) => listener(currentUser))
}

export const loginWithEmailAndPassword = async (email, password): Promise<AuthUser | undefined> => {
    try {
        const accounts = await mockStore.read('accounts')
        const account = accounts.find((a) => !a.isAnonymous && a.email?.toLowerCase() === email?.trim().toLowerCase())
        if (!account || account.password !== password) {
            throw authError('invalid-credential')
        }
        await setSession(account)
        return currentUser
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const loginWithGoogle = async () => {
    alert('Funcionalidade de momento não suportada.')
}

export const loginAnonymously = async (): Promise<AuthUser | undefined> => {
    try {
        const account: MockAccount = {
            uid: `mock-anonymous-${uuid.v4()}`,
            email: null,
            password: null,
            displayName: null,
            photoURL: null,
            isAnonymous: true,
        }
        await mockStore.write('accounts', (accounts) => [...accounts, account])
        await setSession(account)
        return currentUser
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar entrar: ' + error.message)
    }
}

export const registerWithEmailAndPassword = async (email, password, displayName): Promise<AuthUser | undefined> => {
    try {
        const trimmedEmail = email.trim()
        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
            throw authError('invalid-email')
        }
        if (password.length < 6) {
            throw authError('weak-password')
        }

        const account: MockAccount = {
            uid: `mock-user-${uuid.v4()}`,
            email: trimmedEmail,
            password,
            displayName,
            photoURL: null,
            isAnonymous: false,
        }
        await mockStore.write('accounts', (accounts) => {
            if (accounts.some((a) => a.email?.toLowerCase() === trimmedEmail.toLowerCase())) {
                throw authError('email-already-in-use')
            }
            return [...accounts, account]
        })
        await addUser({ userId: account.uid, displayName, email: trimmedEmail })
        await setSession(account)
        return currentUser
    } catch (error: any) {
        console.log(error)
        alert('Erro ao tentar registar: ' + error.message)
    }
}

export const getCurrentUser = (): AuthUser | null => currentUser

export const onAuthStateChanged = (callback: (user: AuthUser | null) => void): (() => void) => {
    authListeners.add(callback)
    restoreSession().then(() => {
        if (authListeners.has(callback)) callback(currentUser)
    })
    return () => {
        authListeners.delete(callback)
    }
}

export const logout = async (): Promise<void> => {
    await setSession(null)
}

// Firebase updates the signed-in User object in place, so this does too.
const updateCurrentAccount = async (changes: Partial<MockAccount>) => {
    const uid = currentUser.uid
    await mockStore.write('accounts', (accounts) => accounts.map((a) => (a.uid === uid ? { ...a, ...changes } : a)))
    Object.assign(currentUser, changes)
}

export const updateCurrentUserProfile = async (profile: { displayName?: string, photoURL?: string }): Promise<void> => {
    await updateCurrentAccount(profile)
}

export const updateCurrentUserEmail = async (email: string): Promise<void> => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        throw authError('invalid-email')
    }
    await updateCurrentAccount({ email: email.trim() })
}
