import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { OrderHistoryFacade } from '../../stores/orders/orders.facade';
import { FiltersStore } from '../../stores/filters/filters.store';
import { MatDialog } from '@angular/material/dialog';
import { ModalResult } from '../../standalones/confirmation-modal/confirmation-modal.model';
import {
    EditOrderHistoryComponent,
    OrderHistoryModalData
} from '../../standalones/edit-order-history/edit-order-history.component';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    providers: [FiltersStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
    public readonly orderHistoryLoadState$ = this.orderHistoryFacade.orderHistory.loadState$;

    constructor(
        private readonly orderHistoryFacade: OrderHistoryFacade,
        private readonly matDialog: MatDialog
    ) {}

    public ngOnInit(): void {
        this.orderHistoryFacade.loadOrderHistoryList();
    }

    public addNewOrder(): void {
        const modalRef = this.matDialog.open<EditOrderHistoryComponent, OrderHistoryModalData, ModalResult>(
            EditOrderHistoryComponent,
            {
                maxWidth: '400px',
                width: '100%',
                data: {
                    isAdd: true
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
