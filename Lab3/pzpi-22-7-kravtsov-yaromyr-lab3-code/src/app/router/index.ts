import React from 'react';
import LoginPage from '../../pages/LoginPage/LoginPage';
import AdminPage from '../../pages/AdminPage/AdminPage';
import BuildingsPage from '../../pages/BuildingsPage/BuildingsPage';
import ZonesPage from '../../pages/ZonesPage/ZonesPage';
import DoorsPage from '../../pages/DoorsPage/DoorsPage';
import BuildinPage from '../../pages/BuildinPage/BuildinPage';
import BuildingModule from '../../pages/BuildinPage/BuildinPage';
import ZonePage from '../../pages/ZonePage/ZonePage';
import DoorPage from '../../pages/DoorPage/DoorPage';
import UsersPage from '../../pages/UsersPage/UsersPage';
import UserPage from '../../pages/UserPage/UserPage';


export interface IRoute {
  path: string;
  element: React.ComponentType;

}
export enum RouteNames {
  LOGIN = "/login",
  MAIN = "/",
  DOORS = '/doors',
  BUILDINGS = '/buildings',
  ZONES = 'zones',
  BUILDING = "/building",
  ZONE = "/zone",
  DOOR = '/door',
  USERS = '/users',
  USER = '/user',


}

export const adminRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: AdminPage },
  { path: RouteNames.BUILDINGS, element: BuildingsPage },
  { path: RouteNames.ZONES, element: ZonesPage },
  { path: RouteNames.DOORS, element: DoorsPage },
  { path: RouteNames.BUILDING, element: BuildingModule },
  { path: RouteNames.BUILDING + '/:id', element: BuildingModule },
  { path: RouteNames.ZONE, element: ZonePage },
  { path: RouteNames.ZONE + '/:id', element: ZonePage },

  { path: RouteNames.DOOR + '/:id', element: DoorPage },
  { path: RouteNames.DOOR, element: DoorPage },
  { path: RouteNames.USERS, element: UsersPage },
  

  { path: RouteNames.USER + '/:id', element: UserPage },
  { path: RouteNames.USER, element: UserPage },







]

export const userRoutes: IRoute[] = [
  { path: RouteNames.MAIN, element: AdminPage },
]

export const publicRoutes: IRoute[] = [
  { path: RouteNames.LOGIN, element: LoginPage },

]