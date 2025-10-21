import { Route, Routes } from '@angular/router';

export const inventoryRoute: Route = 
	{
		path: 'inventory',
		loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)
	};

export const routes: Routes = [
	{ path: '', redirectTo: 'intake', pathMatch: 'full' },
	{
		path: 'intake',
		loadComponent: () => import('./animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	},
	inventoryRoute,
	{
		path: 'animal/:animalId',
		loadComponent: () => import('./animal-details/animal-details.component').then(m => m.AnimalDetailsComponent)
	}
];
