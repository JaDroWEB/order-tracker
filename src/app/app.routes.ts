import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'order-history',
        loadComponent: () =>
            import('./pages/order-history/order-history.component').then((m) => m.OrderHistoryComponent)
    },
    {
        path: '404',
        loadComponent: () =>
            import('./standalones/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent)
    },
    { path: '', redirectTo: 'order-history', pathMatch: 'full' },
    { path: '**', redirectTo: '404' }
];
