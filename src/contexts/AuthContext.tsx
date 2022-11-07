import { createContext, ReactNode, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

import { api } from '../services/api'


WebBrowser.maybeCompleteAuthSession()


interface UserProps {
    name: string,
    avatarUrl: string
}

export interface AuthContextDataProps {
    user: UserProps,
    isUserLoading: boolean,
    signIn: () => Promise<void>
    
}

interface AuthProviderProps {
    children: ReactNode
}

//AuthContext serve para armazenar o nosso contexto 
export const AuthContext = createContext({} as AuthContextDataProps);

//função para prover o contexto   Permite que compartilhe o contexto em toda a nossa aplicação
 
export function AuthContextProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [isUserLoading, setIsUserLoading] = useState(false)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true}),
        scopes: ['profile', 'email']
    })

    console.log(AuthSession.makeRedirectUri({ useProxy: true}))

    async function signIn() {

        try{
            setIsUserLoading(true)
            await promptAsync();
        }catch(error){
            console.log(error)
            throw error
        }finally{
            setIsUserLoading(false)
        }
       
    }
    
    async function signInWithGoogle(access_token:string) {

        try {

            setIsUserLoading(true)

            const tokenresponse = await api.post('/users', { access_token })
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenresponse.data.token}`

            const userInfoResponse = await api.get('/me')
            setUser(userInfoResponse.data.user)

        } catch (error) {

            console.log(error)
            throw error
        }finally{

            setIsUserLoading(false)

        }
       
    }

    useEffect( () => {
        if(response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken)
        }

    },[response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>

            {children}
        </AuthContext.Provider> 
    )

}