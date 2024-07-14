import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    constructor(private readonly translate: TranslateService) {
        this.translate.addLangs(['en', 'sk']);
        this.translate.setDefaultLang('en');

        const langBrowser = this.translate.getBrowserCultureLang()?.slice(0, 2).toLowerCase();
        const langStorage = localStorage.getItem('language');

        if (langStorage && this.translate.langs.includes(langStorage)) {
            this.translate.use(langStorage);
        } else if (langBrowser && this.translate.langs.includes(langBrowser)) {
            this.translate.use(langBrowser);
        } else {
            this.translate.use(this.translate.defaultLang);
        }
    }

    public setLanguage(lang: string): void {
        localStorage.setItem('language', lang);
        this.translate.use(lang);
    }

    public getLanguages(): string[] {
        return this.translate.getLangs();
    }

    public getCurrentLanguage(): string {
        return this.translate.currentLang;
    }
}
