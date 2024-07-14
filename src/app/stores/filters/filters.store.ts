import { Injectable } from '@angular/core';
import { FilterState } from './filter-state.model';
import { ComponentStore } from '@ngrx/component-store';
import { OrderHistoryProductLine, OrderHistoryStatus } from '../orders/models/order-history.model';

const initialState: FilterState = {
    status: null,
    productLine: null,
    from: null,
    to: null,
    orderNumber: null
};

@Injectable({
    providedIn: 'root'
})
export class FiltersStore extends ComponentStore<FilterState> {
    public readonly allFilters$ = this.select((state) => state);
    public readonly status$ = this.select((state) => state.status);
    public readonly productLine$ = this.select((state) => state.productLine);
    public readonly from$ = this.select((state) => state.from);
    public readonly to$ = this.select((state) => state.to);
    public readonly orderNumber$ = this.select((state) => state.orderNumber);

    constructor() {
        super(initialState);
    }

    public readonly clearFilters = this.updater(() => initialState);
    public readonly setFilters = this.updater((state, filters: FilterState) => filters);
    public readonly addStatusFilter = this.updater((state, status: OrderHistoryStatus) => ({
        ...state,
        status: state.status ? [...new Set<OrderHistoryStatus>([...state.status, status])] : [status]
    }));
    public readonly setStatusFilter = this.updater((state, status: FilterState['status']) => ({
        ...state,
        status: status?.length ? status : null
    }));
    public readonly removeStatusFilter = this.updater((state, status: OrderHistoryStatus) => ({
        ...state,
        status: state.status ? state.status.filter((existingStatus) => existingStatus !== status) : null
    }));
    public readonly clearStatusFilter = this.updater((state) => ({
        ...state,
        status: null
    }));
    public readonly addProductLineFilter = this.updater((state, productLine: OrderHistoryProductLine) => ({
        ...state,
        productLine: state.productLine
            ? [...new Set<OrderHistoryProductLine>([...state.productLine, productLine])]
            : [productLine]
    }));
    public readonly setProductLineFilter = this.updater((state, productLine: FilterState['productLine']) => ({
        ...state,
        productLine: productLine?.length ? productLine : null
    }));
    public readonly removeProductLineFilter = this.updater((state, productLine: OrderHistoryProductLine) => ({
        ...state,
        productLine: state.productLine
            ? state.productLine.filter((existingProductLine) => existingProductLine !== productLine)
            : null
    }));
    public readonly clearProductLineFilter = this.updater((state) => ({
        ...state,
        productLine: null
    }));
    public readonly setFromFilter = this.updater((state, from: FilterState['from']) => ({
        ...state,
        from
    }));
    public readonly clearFromFilter = this.updater((state) => ({
        ...state,
        from: null
    }));
    public readonly setToFilter = this.updater((state, to: FilterState['to']) => ({
        ...state,
        to
    }));
    public readonly clearToFilter = this.updater((state) => ({
        ...state,
        to: null
    }));
    public readonly setOrderNumberFilter = this.updater((state, orderNumber: FilterState['orderNumber']) => ({
        ...state,
        orderNumber
    }));
    public readonly clearOrderNumberFilter = this.updater((state) => ({
        ...state,
        orderNumber: null
    }));
}
