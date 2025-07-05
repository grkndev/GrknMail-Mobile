import DrawerContentView from '@/components/DrawerContentView';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <Drawer
        screenOptions={{
          headerShown: false,

        }}
        drawerContent={(props) => <DrawerContentView {...props} />}
      >

        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'overview',

          }}
        />
        <Drawer.Screen
          name="trash" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Trash',
            title: 'Trash',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>

  );
}
