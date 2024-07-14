import { z } from 'zod';
import { LoadState } from './load-state';
import { orderHistoryDtoSchema, orderHistoryListDtoSchema } from '../dto/order-history.dto';

export interface OrderHistoryState {
    loadState: LoadState;
    addState: LoadState;
    deleteState: LoadState;
    editState: LoadState;
    orderHistoryList: OrderHistoryList;
}

export enum OrderHistoryStatus {
    IN_PROGRESS = 'in_progress',
    PENDING = 'pending',
    COMPLETED = 'completed'
}

export enum OrderHistoryProductLine {
    READY_MIX = 'ready_mix',
    AGGREGATES = 'aggregates',
    CEMENT = 'cement'
}

export type OrderHistory = z.infer<typeof orderHistoryDtoSchema>;
export type OrderHistoryList = z.infer<typeof orderHistoryListDtoSchema>;
