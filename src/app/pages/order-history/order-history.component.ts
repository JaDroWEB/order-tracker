import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, EMPTY, filter, first, map, Observable, switchMap, tap } from 'rxjs';
import { OrdersModule } from '../../stores/orders/orders.module';
import { OrderHistoryFacade } from '../../stores/orders/orders.facade';
import {
    OrderHistory,
    OrderHistoryProductLine,
    OrderHistoryStatus
} from '../../stores/orders/models/order-history.model';
import { FiltersStore } from '../../stores/filters/filters.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../standalones/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalOptions, ModalResult } from '../../standalones/confirmation-modal/confirmation-modal.model';
import {
    EditOrderHistoryComponent,
    OrderHistoryModalData
} from '../../standalones/edit-order-history/edit-order-history.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    standalone: true,
    imports: [
        MatCardModule,
        MatCheckboxModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
        DatePipe,
        AsyncPipe,
        ReactiveFormsModule,
        OrdersModule,
        TranslateModule
    ],
    providers: [FiltersStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
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
    public readonly orderHistoryLoadState$ = this.orderHistoryFacade.orderHistory.loadState$;
    public readonly orderHistoryStatusValues = Object.values(OrderHistoryStatus);
    public readonly orderHistoryProductLineValues = Object.values(OrderHistoryProductLine);

    private readonly statusGroup = new FormGroup(
        this.orderHistoryStatusValues.reduce(
            (acc, status) => {
                acc[status] = new FormControl<boolean>(false, { nonNullable: true });
                return acc;
            },
            {} as Record<OrderHistoryStatus, FormControl<boolean>>
        )
    );

    public formGroup = new FormGroup({
        status: this.statusGroup,
        productLine: new FormControl<OrderHistoryProductLine | 'all'>('all', { nonNullable: true }),
        from: new FormControl<Date | null>(null),
        to: new FormControl<Date | null>(null),
        orderNumber: new FormControl<number | null>(null)
    });

    constructor(
        private readonly orderHistoryFacade: OrderHistoryFacade,
        private readonly filters: FiltersStore,
        private readonly matDialog: MatDialog
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

        const statusChanges$ = this.formGroup.controls.status.valueChanges.pipe(
            debounceTime(400),
            tap((status) => {
                this.filters.setStatusFilter(
                    Object.entries(status)
                        .filter(([, value]) => value)
                        .map(([key]) => key as OrderHistoryStatus)
                );
            })
        );

        const productLineChanges$ = this.formGroup.controls.productLine.valueChanges.pipe(
            debounceTime(400),
            tap((productLine) => this.filters.setProductLineFilter(productLine === 'all' ? null : [productLine]))
        );

        const fromChanges$ = this.formGroup.controls.from.valueChanges.pipe(
            debounceTime(400),
            tap((from) => this.filters.setFromFilter(from))
        );

        const toChanges$ = this.formGroup.controls.to.valueChanges.pipe(
            debounceTime(400),
            tap((to) => this.filters.setToFilter(to))
        );

        const orderNumberChanges$ = this.formGroup.controls.orderNumber.valueChanges.pipe(
            debounceTime(400),
            tap((orderNumber) => this.filters.setOrderNumberFilter(orderNumber ? orderNumber : null))
        );

        combineLatest([statusChanges$, productLineChanges$, fromChanges$, toChanges$, orderNumberChanges$])
            .pipe(takeUntilDestroyed())
            .subscribe();
    }

    public ngOnInit(): void {
        this.orderHistoryFacade.loadOrderHistoryList();
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
                disableClose: true,
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
