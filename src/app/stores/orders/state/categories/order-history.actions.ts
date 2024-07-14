import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { OrderHistory, OrderHistoryList } from '../../models/order-history.model';

export const orderHistoryActions = createActionGroup({
    source: 'Order History',
    events: {
        'Load Order History List': emptyProps(),
        'Load Order History List Success': props<{ orderHistoryList: OrderHistoryList }>(),
        'Load Order History List Error': props<{ error: unknown }>(),
        'Load Order History List Init': emptyProps(),
        'Add Order History Item': props<{ orderHistoryItem: Omit<OrderHistory, 'id'> }>(),
        'Add Order History Item Success': props<{ orderHistoryItem: OrderHistory }>(),
        'Add Order History Item Error': props<{ error: unknown }>(),
        'Add Order History Item Init': emptyProps(),
        'Edit Order History Item': props<{
            orderId: OrderHistory['id'];
            orderHistoryItem: Partial<Omit<OrderHistory, 'id'>>;
        }>(),
        'Edit Order History Item Success': props<{ orderHistoryItem: OrderHistory }>(),
        'Edit Order History Item Error': props<{ error: unknown }>(),
        'Edit Order History Item Init': emptyProps(),
        'Delete Order History Item': props<{ orderId: OrderHistory['id'] }>(),
        'Delete Order History Item Success': props<{ orderHistoryItem: OrderHistory }>(),
        'Delete Order History Item Error': props<{ error: unknown }>(),
        'Delete Order History Item Init': emptyProps()
    }
});
