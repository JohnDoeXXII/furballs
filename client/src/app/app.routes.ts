import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

export const routes: Routes = [
	{ path: '', redirectTo: 'intake', pathMatch: 'full' },
	{
		path: 'intake',
		loadComponent: () => import('./intake/intake.component').then(m => m.IntakeComponent)
	},
	{
		path: 'inventory',
		loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)
	}
];
