import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from './services/language.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, MatToolbarModule, MatMenuModule, MatButtonModule, TranslateModule],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    private readonly languages = signal<string[]>(this.languageService.getLanguages());
    public readonly langs = computed(() => this.languages().filter((lang) => lang !== this.currentLang()));
    public readonly currentLang = signal<string>(this.languageService.getCurrentLanguage());
    public readonly currentLangUpper = computed(() => this.currentLang().toUpperCase());

    constructor(private readonly languageService: LanguageService) {}

    public setLanguage(lang: string): void {
        this.currentLang.set(lang);
        this.languageService.setLanguage(lang);
    }
}
