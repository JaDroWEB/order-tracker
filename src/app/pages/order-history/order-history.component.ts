import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent {}
