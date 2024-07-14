import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { orderHistoryQuery } from './state/categories/order-history.selectors';
import { orderHistoryActions } from './state/categories/order-history.actions';
import { OrderHistory } from './models/order-history.model';

@Injectable({
    providedIn: 'root'
})
export class OrderHistoryFacade {
    public readonly orderHistory = {
        loadState$: this.store.select(orderHistoryQuery.selectLoadState),
        addState$: this.store.select(orderHistoryQuery.selectAddState),
        deleteState$: this.store.select(orderHistoryQuery.selectDeleteState),
        editState$: this.store.select(orderHistoryQuery.selectEditState),
        listState$: this.store.select(orderHistoryQuery.selectOrderHistoryState),
        list$: this.store.select(orderHistoryQuery.selectOrderHistoryList)
    };

    constructor(private readonly store: Store) {}

    // Load methods
    public loadOrderHistoryList(): void {
        this.store.dispatch(orderHistoryActions.loadOrderHistoryList());
    }

    public initLoadOrderHistoryList(): void {
        this.store.dispatch(orderHistoryActions.loadOrderHistoryListInit());
    }

    // Edit methods
    public editOrderHistoryItem(
        orderId: OrderHistory['id'],
        orderHistoryItem: Partial<Omit<OrderHistory, 'id'>>
    ): void {
        this.store.dispatch(orderHistoryActions.editOrderHistoryItem({ orderId, orderHistoryItem }));
    }

    public initEditOrderHistoryItem(): void {
        this.store.dispatch(orderHistoryActions.editOrderHistoryItemInit());
    }

    // Delete methods
    public deleteOrderHistoryItem(orderId: OrderHistory['id']): void {
        this.store.dispatch(orderHistoryActions.deleteOrderHistoryItem({ orderId }));
    }

    public initDeleteOrderHistoryItem(): void {
        this.store.dispatch(orderHistoryActions.deleteOrderHistoryItemInit());
    }

    // Add methods
    public addOrderHistoryItem(orderHistoryItem: Omit<OrderHistory, 'id'>): void {
        this.store.dispatch(orderHistoryActions.addOrderHistoryItem({ orderHistoryItem }));
    }

    public initAddOrderHistoryItem(): void {
        this.store.dispatch(orderHistoryActions.addOrderHistoryItemInit());
    }
}
