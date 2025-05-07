import { effect, Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  primary: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  private readonly themes: Theme[] = [
    { id: 'tokyonight', primary: '#bb9af7', displayName: 'Tokyo Night' },
  ]

  currentTheme = signal<Theme>(this.themes[0]);

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find((theme) => theme.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }

  updateThemeClass = effect(() => {
    const theme = this.currentTheme();
    document.body.classList.remove(...this.themes.map((t) => `${t.id}-theme`));
    document.body.classList.add(`$(theme.id)-theme`);
  });

  constructor() { } 

}
