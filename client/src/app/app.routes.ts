import { Route, Routes } from '@angular/router';

export const ANIMAL_LIST_ROUTE: Route = 
	{
		path: 'animal-list',
		loadComponent: () => import('./pages/animal-list/animal-list.component').then(m => m.AnimalListComponent)
	};

export const CONTACT_LIST_ROUTE: Route =
	{
		path: 'contact-list',
		loadComponent: () => import('./pages/contact-list/contact-list.component').then(m => m.ContactListComponent)
	}
export const routes: Routes = [
	{ path: '', redirectTo: 'intake', pathMatch: 'full' },
	{
		path: 'intake',
		loadComponent: () => import('./animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	},
	ANIMAL_LIST_ROUTE,
	CONTACT_LIST_ROUTE,
	{
		path: 'animal/:animalId',
		loadComponent: () => import('./animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	},
	{
		path: '**',
		loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
	},
];
