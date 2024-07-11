import { Routes } from '@angular/router';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';

export const routes: Routes = [
    {
        path: 'order-history',
        component: OrderHistoryComponent
        // loadChildren: () => import('./pages/categories/categories.module').then((m) => m.CategoriesModule)
    },
    {
        path: '404',
        loadComponent: () =>
            import('./standalones/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent)
    },
    { path: '', redirectTo: 'order-history', pathMatch: 'full' },
    { path: '**', redirectTo: '404' }
];
