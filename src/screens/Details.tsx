import { VStack, useToast, HStack } from "native-base";

import { Header } from "../components/Header";

import { useRoute } from '@react-navigation/native'

import { useEffect, useState } from 'react'
import { Loading } from "../components/Loading";
import { PoolCardPros } from '../components/PoolCard'

import { api } from '../services/api'
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Option } from '../components/Option'

import { Share } from 'react-native'

import { Guesses } from '../components/Guesses'

interface RouteParams {
    id: string
}

export function Details(){

    //Acessar qual o id do bolão e recuperar a informação
    const route = useRoute()

    //Definir tipagem
    const { id } = route.params as RouteParams

    const [ isLoading, setIsLoading ] = useState(true)

    const toast = useToast()

    const [ poolDetails, setPoolDetails ] = useState<PoolCardPros>({} as PoolCardPros)

    const [ optionSelected, setOptionSelected ] = useState<'guesses' | 'Ranking'>('guesses')

    async function fetchPoolsDetails () {

        try {
            
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)

            // console.log(response.data.pool.participants)
            setPoolDetails(response.data.pool)

        } catch (error) {

            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
            
        } finally {
            setIsLoading(false)
        }
        
    }

    async function handleCodeShare() {
        await Share.share({
           message: poolDetails.code
       })
    }

    useEffect(()=> {
        fetchPoolsDetails()
    },[id])

    if(isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header 
                title={poolDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare} 
            />
            {
                poolDetails._count?.participants > 0 
                ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option 
                            title="Seus palpites" 
                            isSelected={optionSelected === 'guesses'} 
                            onPress={() => setOptionSelected('guesses')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'Ranking'}
                            onPress={() => setOptionSelected("Ranking")}
                        />
                    </HStack>

                    <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                </VStack> 
                : 
                <EmptyMyPoolList code={poolDetails.code} />
            }

        </VStack>
    )
}