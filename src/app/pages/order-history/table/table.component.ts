import { ChangeDetectionStrategy, Component } from '@angular/core';
import { switchMap, filter, EMPTY, first, Observable, combineLatest, map } from 'rxjs';
import { ConfirmationModalComponent } from '../../../standalones/confirmation-modal/confirmation-modal.component';
import {
    ConfirmationModalOptions,
    ModalResult
} from '../../../standalones/confirmation-modal/confirmation-modal.model';
import {
    EditOrderHistoryComponent,
    OrderHistoryModalData
} from '../../../standalones/edit-order-history/edit-order-history.component';
import { OrderHistory } from '../../../stores/orders/models/order-history.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderHistoryFacade } from '../../../stores/orders/orders.facade';
import { FiltersStore } from '../../../stores/filters/filters.store';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
    public readonly tableColumns = [
        'status',
        'orderNumber',
        'productLine',
        'product',
        'quantity',
        'dateRequested',
        'actions'
    ];
    public readonly orderHistory$: Observable<OrderHistory[]>;

    constructor(
        private readonly matDialog: MatDialog,
        private readonly orderHistoryFacade: OrderHistoryFacade,
        private readonly filters: FiltersStore
    ) {
        this.orderHistory$ = combineLatest([this.orderHistoryFacade.orderHistory.list$, this.filters.allFilters$]).pipe(
            map(([orderHistory, filters]) => {
                return orderHistory.filter((order) => {
                    return (
                        (filters.status === null || filters.status.includes(order.status)) &&
                        (filters.productLine === null || filters.productLine.includes(order.productLine)) &&
                        (filters.from === null || filters.from <= order.dateRequested) &&
                        (filters.to === null || filters.to >= order.dateRequested) &&
                        (filters.orderNumber === null ||
                            order.orderNumber.toString().includes(filters.orderNumber.toString()))
                    );
                });
            })
        );
    }

    public deleteItem(order: OrderHistory): void {
        const dialogData: ConfirmationModalOptions = {
            titleKey: 'ORDER.DELETE.TITLE',
            titleParams: { orderNumber: order.orderNumber },
            contentKey: 'DELETE.QUESTION',
            buttons: [
                {
                    labelKey: 'DELETE.LABEL',
                    result: 'confirm',
                    color: 'primary'
                },
                {
                    labelKey: 'CANCEL.LABEL',
                    result: 'cancel'
                }
            ]
        };

        const dialogRef = this.matDialog.open<ConfirmationModalComponent, ConfirmationModalOptions, ModalResult>(
            ConfirmationModalComponent,
            {
                maxWidth: '400px',
                width: '100%',
                data: dialogData
            }
        );

        dialogRef
            .afterClosed()
            .pipe(
                switchMap((result) => {
                    if (result === 'confirm') {
                        this.orderHistoryFacade.deleteOrderHistoryItem(order.id);
                        return this.orderHistoryFacade.orderHistory.deleteState$.pipe(
                            filter((state) => state === 'loaded')
                        );
                    }
                    return EMPTY;
                }),
                first()
            )
            .subscribe(() => this.orderHistoryFacade.initDeleteOrderHistoryItem());
    }

    public editItem(orderHistory: OrderHistory): void {
        const modalRef = this.matDialog.open<EditOrderHistoryComponent, OrderHistoryModalData, ModalResult>(
            EditOrderHistoryComponent,
            {
                maxWidth: '400px',
                width: '100%',
                data: {
                    isAdd: false,
                    orderHistory
                }
            }
        );

        modalRef
            .afterClosed()
            .pipe(first())
            .subscribe((result) => {
                if (result === 'confirm') {
                    this.orderHistoryFacade.initEditOrderHistoryItem();
                }
            });
    }
}
