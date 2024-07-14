import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    OrderHistory,
    OrderHistoryProductLine,
    OrderHistoryStatus
} from '../../stores/orders/models/order-history.model';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { OrderHistoryFacade } from '../../stores/orders/orders.facade';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { filter, first, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export type OrderHistoryModalData = AddOrderHistoryData | EditOrderHistoryData;

interface AddOrderHistoryData {
    isAdd: true;
}

interface EditOrderHistoryData {
    isAdd: false;
    orderHistory: OrderHistory;
}

@Component({
    selector: 'app-edit-order-history',
    templateUrl: './edit-order-history.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatRadioModule,
        MatIcon,
        TranslateModule,
        ReactiveFormsModule,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditOrderHistoryComponent implements OnInit {
    public readonly orderHistoryStatusValues = Object.values(OrderHistoryStatus);
    public readonly orderHistoryProductLineValues = Object.values(OrderHistoryProductLine);
    public readonly isLoadingState$: Observable<boolean>;

    public formGroup = new FormGroup({
        status: new FormControl<OrderHistoryStatus | null>(null, { validators: [Validators.required] }),
        productLine: new FormControl<OrderHistoryProductLine | null>(null, { validators: [Validators.required] }),
        dateRequested: new FormControl<Date | null>(null, { validators: [Validators.required] }),
        product: new FormControl<string | null>(null, { validators: [Validators.required] }),
        quantity: new FormControl<number | null>(null, { validators: [Validators.required] }),
        orderNumber: new FormControl<number | null>(null, { validators: [Validators.required] })
    });

    constructor(
        private readonly orderHistoryFacade: OrderHistoryFacade,
        private readonly modalRef: MatDialogRef<EditOrderHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: OrderHistoryModalData
    ) {
        const orderHistory = this.orderHistoryFacade.orderHistory;
        const requestState$ = this.data.isAdd ? orderHistory.addState$ : orderHistory.editState$;
        this.isLoadingState$ = requestState$.pipe(map((state) => state === 'loading'));

        requestState$
            .pipe(
                filter((state) => state === 'loaded'),
                first()
            )
            .subscribe(() => this.modalRef.close('confirm'));
    }

    public ngOnInit(): void {
        if (!this.data.isAdd) {
            this.formGroup.patchValue({
                ...this.data.orderHistory
            });
        }
    }

    public editOrder(): void {
        if (!this.data.isAdd) {
            if (this.formGroup.invalid) {
                this.formGroup.markAllAsTouched();
                return;
            }

            const orderHistoryItem = this.formGroup.value as Omit<OrderHistory, 'id'>;
            this.orderHistoryFacade.editOrderHistoryItem(this.data.orderHistory.id, orderHistoryItem);
        } else {
            if (this.formGroup.invalid) {
                this.formGroup.markAllAsTouched();
                return;
            }

            const orderHistoryItem = this.formGroup.value as Omit<OrderHistory, 'id'>;
            this.orderHistoryFacade.addOrderHistoryItem(orderHistoryItem);
        }
    }
}
