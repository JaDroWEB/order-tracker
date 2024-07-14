import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderService } from '../../services/order-history.service';
import { orderHistoryActions } from './order-history.actions';

@Injectable()
export class OrderHistoryEffects {
    public readonly loadOrderHistoryList$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(orderHistoryActions.loadOrderHistoryList),
            exhaustMap(() =>
                this.orderService.getOrderHistoryList().pipe(
                    map((orderHistoryList) => orderHistoryActions.loadOrderHistoryListSuccess({ orderHistoryList })),
                    catchError((error: unknown) => {
                        this.logError(error, 'ORDER.LOAD.FAIL');
                        return of(orderHistoryActions.loadOrderHistoryListError({ error }));
                    })
                )
            )
        );
    });

    public readonly addOrderHistoryItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(orderHistoryActions.addOrderHistoryItem),
            exhaustMap((action) =>
                this.orderService.addOrderHistoryItem(action.orderHistoryItem).pipe(
                    tap(() => this.orderService.openSnackbar('ORDER.ADD.SUCCESS')),
                    map((orderHistoryItem) => orderHistoryActions.addOrderHistoryItemSuccess({ orderHistoryItem })),
                    catchError((error: unknown) => {
                        this.logError(error, 'ORDER.ADD.FAIL');
                        return of(orderHistoryActions.addOrderHistoryItemError({ error }));
                    })
                )
            )
        );
    });

    public readonly editOrderHistoryItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(orderHistoryActions.editOrderHistoryItem),
            exhaustMap((action) =>
                this.orderService.editOrderHistoryItem(action.orderId, action.orderHistoryItem).pipe(
                    tap(() => this.orderService.openSnackbar('ORDER.EDIT.SUCCESS')),
                    map((orderHistoryItem) => orderHistoryActions.editOrderHistoryItemSuccess({ orderHistoryItem })),
                    catchError((error: unknown) => {
                        this.logError(error, 'ORDER.EDIT.FAIL');
                        return of(orderHistoryActions.editOrderHistoryItemError({ error }));
                    })
                )
            )
        );
    });

    public readonly deleteOrderHistoryItem$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(orderHistoryActions.deleteOrderHistoryItem),
            exhaustMap((action) =>
                this.orderService.deleteOrderHistoryItem(action.orderId).pipe(
                    tap(() => this.orderService.openSnackbar('ORDER.DELETE.SUCCESS')),
                    map((orderHistoryItem) => orderHistoryActions.deleteOrderHistoryItemSuccess({ orderHistoryItem })),
                    catchError((error: unknown) => {
                        this.logError(error, 'ORDER.DELETE.FAIL');
                        return of(orderHistoryActions.deleteOrderHistoryItemError({ error }));
                    })
                )
            )
        );
    });

    constructor(
        private readonly actions$: Actions,
        private readonly orderService: OrderService
    ) {}

    private logError(error: unknown, messageKey: string): void {
        this.orderService.openSnackbar(messageKey, false);
        console.error(error);
    }
}
