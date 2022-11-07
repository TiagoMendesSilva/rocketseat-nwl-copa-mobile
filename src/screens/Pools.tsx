import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons'
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { useCallback, useState } from 'react'

import { api } from '../services/api'

import { PoolCard, PoolCardPros } from '../components/PoolCard'
import { Loading } from '../components/Loading'
import { EmptyPoolList } from '../components/EmptyPoolList'


export function Pools() {

    const [ pools, setPools] = useState<PoolCardPros[]>([])

    const toast  = useToast()

    const [ isLoading, setIsLoading ] = useState(true)

    const navigation = useNavigation()

    async function fetchPools() {
        try {

            setIsLoading(true)

            const response = await api.get('/pools')
            // console.log(response.data.pools)
            setPools(response.data.pools)
            
        } catch (error) {

            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
            
        } finally {

            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools()
    },[]))
   

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus Bolões" /> 
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button 
                title="BUSCAR BOLÃO POR CÓDIGO"
                leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                onPress={() => navigation.navigate('find')}
                />
            </VStack>

        
            {/* keyExtractor  valor único para identificar cada item dentro da listagem para performar bem 
                renderItems Dizemos qual o componente que queremos renderizar
                showsVerticalScrollIndicator={false} retirar a barra de rolagem caso tenha muitos bolões
                data={pools} ====> data={[]} somente para testar o componente quando não tiver a lista de bolões
                ListEmptyComponent -> essa propriedade indica qual componente precisa ser renderizado caso não tenha lista nenhuma
                As chaves são utilizadas para envolver o estado quando tiver em uma condicional
            */}
            

            {
                isLoading ? <Loading /> :
                <FlatList 
                    data={pools}
                    keyExtractor={item => item.id} 
                    renderItem={ ({ item }) => (
                        <PoolCard 
                            data={item}
                            onPress={ () => navigation.navigate('details', {
                                id: item.id
                            })} 
                        />
                    )} 
                    px={5}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ pb:10 }}
                    ListEmptyComponent={() => <EmptyPoolList /> }
                />
            }

           

        </VStack>
    )
}