import { createFeature, createReducer, on } from '@ngrx/store';
import { OrderHistoryState } from '../../models/order-history.model';
import { orderHistoryActions } from './order-history.actions';

export const initialState: OrderHistoryState = {
    loadState: 'beforeLoad',
    addState: 'beforeLoad',
    deleteState: 'beforeLoad',
    editState: 'beforeLoad',
    orderHistoryList: []
};

export const orderHistoryFeature = createFeature({
    name: 'OrderHistory',
    reducer: createReducer(
        initialState,
        // Load order history list
        on(
            orderHistoryActions.loadOrderHistoryList,
            (state): OrderHistoryState => ({
                ...state,
                loadState: 'loading'
            })
        ),
        on(
            orderHistoryActions.loadOrderHistoryListSuccess,
            (state, { orderHistoryList }): OrderHistoryState => ({
                ...state,
                loadState: 'loaded',
                orderHistoryList
            })
        ),
        on(
            orderHistoryActions.loadOrderHistoryListError,
            (state): OrderHistoryState => ({
                ...state,
                loadState: 'error'
            })
        ),
        on(
            orderHistoryActions.loadOrderHistoryListInit,
            (state): OrderHistoryState => ({
                ...state,
                loadState: initialState.loadState
            })
        ),

        // Add order history item
        on(
            orderHistoryActions.addOrderHistoryItem,
            (state): OrderHistoryState => ({
                ...state,
                addState: 'loading'
            })
        ),
        on(
            orderHistoryActions.addOrderHistoryItemSuccess,
            (state, { orderHistoryItem }): OrderHistoryState => ({
                ...state,
                addState: 'loaded',
                orderHistoryList: [...state.orderHistoryList, orderHistoryItem]
            })
        ),
        on(
            orderHistoryActions.addOrderHistoryItemError,
            (state): OrderHistoryState => ({
                ...state,
                addState: 'error'
            })
        ),
        on(
            orderHistoryActions.addOrderHistoryItemInit,
            (state): OrderHistoryState => ({
                ...state,
                addState: initialState.addState
            })
        ),

        // Edit order history item
        on(
            orderHistoryActions.editOrderHistoryItem,
            (state): OrderHistoryState => ({
                ...state,
                editState: 'loading'
            })
        ),
        on(
            orderHistoryActions.editOrderHistoryItemSuccess,
            (state, { orderHistoryItem }): OrderHistoryState => ({
                ...state,
                editState: 'loaded',
                orderHistoryList: state.orderHistoryList.map((item) =>
                    item.id === orderHistoryItem.id ? orderHistoryItem : item
                )
            })
        ),
        on(
            orderHistoryActions.editOrderHistoryItemError,
            (state): OrderHistoryState => ({
                ...state,
                editState: 'error'
            })
        ),
        on(
            orderHistoryActions.editOrderHistoryItemInit,
            (state): OrderHistoryState => ({
                ...state,
                editState: initialState.editState
            })
        ),

        // Delete order history item
        on(
            orderHistoryActions.deleteOrderHistoryItem,
            (state): OrderHistoryState => ({
                ...state,
                deleteState: 'loading'
            })
        ),
        on(
            orderHistoryActions.deleteOrderHistoryItemSuccess,
            (state, { orderHistoryItem }): OrderHistoryState => ({
                ...state,
                deleteState: 'loaded',
                orderHistoryList: state.orderHistoryList.filter((item) => item.id !== orderHistoryItem.id)
            })
        ),
        on(
            orderHistoryActions.deleteOrderHistoryItemError,
            (state): OrderHistoryState => ({
                ...state,
                deleteState: 'error'
            })
        ),
        on(
            orderHistoryActions.deleteOrderHistoryItemInit,
            (state): OrderHistoryState => ({
                ...state,
                deleteState: initialState.deleteState
            })
        )
    )
});
