import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    imports: [RouterLink, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}
