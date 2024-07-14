import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderHistoryStatus, OrderHistoryProductLine } from '../../../stores/orders/models/order-history.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, tap, combineLatest } from 'rxjs';
import { FiltersStore } from '../../../stores/filters/filters.store';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent {
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

    constructor(private readonly filters: FiltersStore) {
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
}
