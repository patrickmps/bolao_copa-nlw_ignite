import { NavigationContainer } from '@react-navigation/native'
import { Box } from 'native-base';
import { useAuth } from '../hooks/useAuth'
import { Signin } from '../screens/Signin';
import { AppRoutes } from './app.routes'

export function Routes() {
  const { user } = useAuth();

  return (
    <Box flex={1} bgColor='gray.900'>
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <Signin />}
      </NavigationContainer>
    </Box>
  )
}