import Login from "./user/login/login";
import Welcome from "./welcome";
import Signup from "./user/register/signup";
import GeneralAdminPage from "./general_admin/general_admin_page";
import Events from "./user/main_page/events/events";
import AdministratorDetailPage from "./general_admin/administrator_details_page";
import ImagePage from "./general_admin/image_page";
import LoginAdmin from "./administrator/login/login_administrator_page";
import AdministratorCameraPage from "./administrator/register/administrator_camera_page";
import EmailPage from "./administrator/register/administrator_email_page";
import PasswordPage from "./administrator/register/administrator_password_page";
import NamePage from "./administrator/register/administrator_name_page"
import EventDetailed from "./user/main_page/events/event_detailed";
import Reservation from "./user/main_page/events/reservation/reservation";
import Notification from "./user/main_page/events/notification/notification";
import Account from "./user/main_page/account/account"
import ChangeEmail from "./user/main_page/account/change_items/change_email";
import ChangePassword from "./user/main_page/account/change_items/change_password";
import ChangeFirstName from "./user/main_page/account/change_items/change_first_name";
import ChangeLastName from "./user/main_page/account/change_items/change_last_name";
import DeleteAccount from "./user/main_page/account/change_items/delete_account";
import Menu from "./user/main_page/menu/menu"
import UserCalendar from "./user/main_page/menu/calendar/user_calendar";
import UserMap from './user/main_page/menu/map/user_map';
import UserEvents from './user/main_page/menu/user_events/user_events';
import EventReview from './user/main_page/menu/user_events/review/event_review';
import ContactApp from './user/main_page/menu/contact_app/contact_app';
import AdminEvents from './administrator/main_page/events/admin_events';
import AdminEventDetailed from './administrator/main_page/events/admin_event_detailed';
import AddNotification from './administrator/main_page/events/notification/add_notification';
import DeleteEvent from './administrator/main_page/events/delete_event/delete_event';
import AdminAccount from './administrator/main_page/account/admin_account';
import AdminChangeEmail from "./administrator/main_page/account/change_items/admin_change_email";
import AdminChangeFirstName from "./administrator/main_page/account/change_items/admin_change_first_name";
import AdminChangeLastName from "./administrator/main_page/account/change_items/admin_change_last_name";
import AdminChangePassword from "./administrator/main_page/account/change_items/admin_change_password";
import AdminDeleteAccount from "./administrator/main_page/account/change_items/admin_delete_account";
import AdminMenu from "./administrator/main_page/menu/admin_menu";
import AdminAllEvents from "./administrator/main_page/menu/admin_events/admin_all_events";
import AdminLocations from "./administrator/main_page/menu/admin_locations/admin_locations";
import AddLocation from "./administrator/main_page/menu/admin_locations/add_location/add_location";
import SelectLocation from "./administrator/main_page/menu/admin_locations/add_location/select_location";
import LocationDetailed from "./administrator/main_page/menu/admin_locations/location_detailed";
import DeleteLocation from "./administrator/main_page/menu/admin_locations/delete_location/delete_location";
import AddEvent from "./administrator/main_page/menu/admin_events/add_event/add_event";
import AddEventPhoto from "./administrator/main_page/menu/admin_events/add_event/add_event_photo";
import AdminReviews from "./administrator/main_page/menu/admin_events/admin_reviews/admin_reviews";
import AdminReservations from "./administrator/main_page/events/reservations/admin_reservations";
import SelectAdminLocation from "./administrator/main_page/menu/admin_calendars/select_location_calendar";
import LocationCalendar from "./administrator/main_page/menu/admin_calendars/location_calendar/location_calendar";
import EventLocation from "./user/main_page/events/event_location/event_location";
import ForgotPassword from "./user/login/forgot_password";
import ResetPassword from "./user/login/reset_password";
import ForgotPasswordAdmin from "./administrator/login/forgot_password_admin";
import ResetPasswordAdmin from "./administrator/login/reset_password_admin";
export {
    Login,
    Welcome,
    Signup,
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
}