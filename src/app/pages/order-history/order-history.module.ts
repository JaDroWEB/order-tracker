import { NgModule } from '@angular/core';
import { OrderHistoryComponent } from './order-history.component';
import { DatePipe, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersModule } from '../../stores/orders/orders.module';
import { RouterModule } from '@angular/router';
import { FiltersComponent } from './filters/filters.component';
import { TableComponent } from './table/table.component';

@NgModule({
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
        TranslateModule,
        RouterModule.forChild([{ path: '', component: OrderHistoryComponent }])
    ],
    declarations: [OrderHistoryComponent, FiltersComponent, TableComponent]
})
export class OrderHistoryModule {}
