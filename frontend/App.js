import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Reanimated from 'react-native-reanimated';

import { 
  Login, 
  Signup, 
  Welcome, 
  GeneralAdminPage, 
  Events, 
  AdministratorDetailPage, 
  ImagePage, 
  LoginAdmin,
  AdministratorCameraPage,
  EmailPage,
  PasswordPage,
  NamePage,
  EventDetailed,
  Reservation,
  Notification,
  Account,
  ChangeEmail,
  ChangePassword,
  ChangeFirstName,
  ChangeLastName,
  DeleteAccount, 
  Menu,
  UserCalendar,
  UserMap,
  UserEvents,
  EventReview,
  ContactApp,
  AdminEvents,
  AdminEventDetailed,
  AddNotification,
  DeleteEvent,
  AdminAccount,
  AdminChangeEmail,
  AdminChangeFirstName,
  AdminChangeLastName,
  AdminChangePassword,
  AdminDeleteAccount,
  AdminMenu,
  AdminAllEvents,
  AdminLocations,
  AddLocation,
  SelectLocation,
  LocationDetailed,
  DeleteLocation,
  AddEvent,
  AddEventPhoto,
  AdminReviews,
  AdminReservations,
  SelectAdminLocation,
  LocationCalendar,
  EventLocation,
  ForgotPassword,
  ResetPassword,
  ForgotPasswordAdmin,
  ResetPasswordAdmin
} from "./screens";

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="GeneralAdminPage"
          component={GeneralAdminPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Events"
          component={Events}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdministratorDetailPage"
          component={AdministratorDetailPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ImagePage"
          component={ImagePage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="LoginAdmin"
          component={LoginAdmin}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdministratorCameraPage"
          component={AdministratorCameraPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EmailPage"
          component={EmailPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="PasswordPage"
          component={PasswordPage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="NamePage"
          component={NamePage}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EventDetailed"
          component={EventDetailed}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Reservation"
          component={Reservation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ChangeFirstName"
          component={ChangeFirstName}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ChangeLastName"
          component={ChangeLastName}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="UserCalendar"
          component={UserCalendar}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="UserMap"
          component={UserMap}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="UserEvents"
          component={UserEvents}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EventReview"
          component={EventReview}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ContactApp"
          component={ContactApp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminEvents"
          component={AdminEvents}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminEventDetailed"
          component={AdminEventDetailed}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AddNotification"
          component={AddNotification}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="DeleteEvent"
          component={DeleteEvent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminAccount"
          component={AdminAccount}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminChangeEmail"
          component={AdminChangeEmail}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminChangeFirstName"
          component={AdminChangeFirstName}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminChangeLastName"
          component={AdminChangeLastName}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminChangePassword"
          component={AdminChangePassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminDeleteAccount"
          component={AdminDeleteAccount}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminMenu"
          component={AdminMenu}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminAllEvents"
          component={AdminAllEvents}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminLocations"
          component={AdminLocations}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AddLocation"
          component={AddLocation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SelectLocation"
          component={SelectLocation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="LocationDetailed"
          component={LocationDetailed}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="DeleteLocation"
          component={DeleteLocation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEvent}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AddEventPhoto"
          component={AddEventPhoto}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminReviews"
          component={AdminReviews}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AdminReservations"
          component={AdminReservations}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="SelectAdminLocation"
          component={SelectAdminLocation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="LocationCalendar"
          component={LocationCalendar}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="EventLocation"
          component={EventLocation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ForgotPasswordAdmin"
          component={ForgotPasswordAdmin}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ResetPasswordAdmin"
          component={ResetPasswordAdmin}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}