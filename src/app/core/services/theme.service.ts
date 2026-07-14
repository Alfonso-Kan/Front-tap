import { Injectable, effect, signal } from '@angular/core';

const THEME_KEY = 'tap_demo_theme';

export type Tema = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly tema = signal<Tema>(this.leerInicial());

  constructor() {
    effect(() => {
      const tema = this.tema();
      document.documentElement.classList.toggle('dark-theme', tema === 'dark');
      localStorage.setItem(THEME_KEY, tema);
    });
  }

  alternar(): void {
    this.tema.set(this.tema() === 'dark' ? 'light' : 'dark');
  }

  private leerInicial(): Tema {
    const guardado = localStorage.getItem(THEME_KEY);

    if (guardado === 'dark' || guardado === 'light') {
      return guardado;
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
