import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { orderHistoryFeature } from './state/categories/order-history.reducer';
import { OrderHistoryEffects } from './state/categories/order-history.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        StoreModule.forFeature(orderHistoryFeature),
        EffectsModule.forFeature([OrderHistoryEffects]),
        MatSnackBarModule,
        TranslateModule
    ]
})
export class OrdersModule {}
