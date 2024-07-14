import { orderHistoryFeature } from './order-history.reducer';

const {
    selectOrderHistoryList,
    selectOrderHistoryState,
    selectLoadState,
    selectAddState,
    selectDeleteState,
    selectEditState
} = orderHistoryFeature;

export const orderHistoryQuery = {
    selectOrderHistoryList,
    selectOrderHistoryState,
    selectLoadState,
    selectAddState,
    selectDeleteState,
    selectEditState
};
