import { z } from 'zod';
import { OrderHistoryProductLine, OrderHistoryStatus } from '../models/order-history.model';

export const orderHistoryDtoSchema = z.object({
    id: z.string(),
    status: z.nativeEnum(OrderHistoryStatus),
    orderNumber: z.number(),
    productLine: z.nativeEnum(OrderHistoryProductLine),
    product: z.string(),
    quantity: z.number(),
    dateRequested: z.coerce.date()
});

export const orderHistoryListDtoSchema = z.array(orderHistoryDtoSchema);
