import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationModalOptions } from './confirmation-modal.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    standalone: true,
    imports: [TranslateModule, MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationModalOptions) {}
}
