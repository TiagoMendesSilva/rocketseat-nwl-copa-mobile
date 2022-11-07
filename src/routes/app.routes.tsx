import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { useTheme } from 'native-base'

import { New } from '../screens/New'
import { Pools } from '../screens/Pools'
import { Find } from '../screens/Find'
import { Details } from '../screens/Details'

import { Platform } from 'react-native'


const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes(){

    const { colors, sizes } = useTheme()

    const size = sizes[6]

    return (
        <Navigator screenOptions={{
            headerShown:false,
            tabBarLabelPosition:'beside-icon', //Para o texto ficar do lado do ícone 
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]

            },
            tabBarItemStyle: { //Estilizar cada item dentro do menu
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0 //distanciamento do topo baseado no ambiente
            }
        }}>
            <Screen 
                name='new'
                component={New}
                options= {{
                    tabBarIcon: ({color}) => <PlusCircle  color={color} size={size} />, //Para o ícone acompanhar a mesma cor da propriedade tabActiveTintColor
                    tabBarLabel: 'Novo Bolão' //Podemos definir qual o texto que aparece ao lado do ícone
                }}
            />

            <Screen 
                name='pools'
                component={Pools}
                options={{
                    tabBarIcon: ({color}) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: 'Meus Bolões' 
                }}
            />

            <Screen 
                name='find'
                component={Find}
                options={{
                   tabBarButton: () => null
                }}
            />

            <Screen 
                name='details'
                component={Details}
                options={{
                   tabBarButton: () => null
                }}
            />  

        </Navigator>
    )
    
}