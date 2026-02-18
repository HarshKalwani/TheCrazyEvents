import { NavigatorScreenParams } from "@react-navigation/native"


export enum RootRoutes {
    AuthStack = "AuthStack",
    MainTabs = "MainTabs",
}

export enum AuthRoutes {
    Login = "Login",
    SignUp = "SignUp",
    ForgotPassword = "ForgotPassword"
};

export enum MainRoutes {
    Home = "Home",
    Explore = "Explore",
    Notification = "Notification",
    Messages = "Messages",
    EventDetails = "EventDetails",
    GroupDetails = "GroupDetails",
    Calender = "Calender",
    Profile = "Profile",
    Group = "Group",
}

export type RootStackParamList = {
    [RootRoutes.AuthStack]: NavigatorScreenParams<AuthStackParamList>;
    [RootRoutes.MainTabs]: NavigatorScreenParams<MainTabsParamList>;
}

export type AuthStackParamList = {
    [AuthRoutes.SignUp]: undefined;
    [AuthRoutes.Login]: undefined;
    [AuthRoutes.ForgotPassword]: undefined;
}

export type MainTabsParamList = {
    [MainRoutes.Home]: undefined;
    [MainRoutes.Explore]: undefined;
    [MainRoutes.Notification]: undefined;
    [MainRoutes.Messages]: undefined;
}

export type MainStackParamList = {
    [MainRoutes.EventDetails]: { eventId: string };
    [MainRoutes.GroupDetails]: { groupId: string };
    [MainRoutes.Profile]: undefined;
    [MainRoutes.Group]: undefined;
    [MainRoutes.Calender]: undefined;
}