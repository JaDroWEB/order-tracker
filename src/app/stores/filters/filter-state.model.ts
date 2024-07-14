import { OrderHistoryProductLine, OrderHistoryStatus } from '../orders/models/order-history.model';

export interface FilterState {
    status: OrderHistoryStatus[] | null;
    productLine: OrderHistoryProductLine[] | null;
    from: Date | null;
    to: Date | null;
    orderNumber: number | null;
}
