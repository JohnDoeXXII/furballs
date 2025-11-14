import { Route, Routes } from '@angular/router';

export const ANIMAL_LIST_ROUTE: Route = 
	{
		path: 'animalz',
		loadComponent: () => import('./pages/animal-list/animal-list.component').then(m => m.AnimalListComponent)
	};

export const CONTACT_LIST_ROUTE: Route =
	{
		path: 'contactz',
		loadComponent: () => import('./pages/contact-list/contact-list.component').then(m => m.ContactListComponent)
	};

export const EVENT_LIST_ROUTE: Route =
	{
		path: 'eventz',
		loadComponent: () => import('./pages/event-list/event-list.component').then(m => m.EventListComponent)
	};

export const USER_LIST_ROUTE: Route =
	{
		path: 'userz',
		loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent)
	};

export const routes: Routes = [
	{ path: '', redirectTo: ANIMAL_LIST_ROUTE.path, pathMatch: 'full' },
	{
		path: 'configuration',
		loadComponent: () => import('./admin/configuration/configuration.component').then(m => m.ConfigurationComponent)
	},
	ANIMAL_LIST_ROUTE,
	{
		path: 'animalz/new',
		loadComponent: () => import('./pages/animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	},
	{
		path: 'animalz/:animalId',
		loadComponent: () => import('./pages/animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	},
	CONTACT_LIST_ROUTE,
	{
		path: 'contactz/new',
		loadComponent: () => import('./pages/contact-details/contact-details.component').then(m => m.ContactDetails)
	},
	{
		path: 'contactz/:contactId',
		loadComponent: () => import('./pages/contact-details/contact-details.component').then(m => m.ContactDetails)
	},
	EVENT_LIST_ROUTE,
	{
		path: 'eventz/new',
		loadComponent: () => import('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent)
	},
	{
		path: 'eventz/:eventId',
		loadComponent: () => import('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent)
	},
	USER_LIST_ROUTE,
	{
		path: 'userz/register',
		loadComponent: () => import('./pages/user-registration/user-registration.component').then(m => m.UserRegistrationComponent)
	},
	{
		path: 'userz/new',
		loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent)
	},
	{
		path: 'userz/:userId',
		loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent)
	},
	{
		path: '**',
		loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
	}
];
