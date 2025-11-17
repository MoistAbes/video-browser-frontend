import { Injectable, OnDestroy } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  private lenis?: Lenis;
  isScrolling = false;
  private scrollTimeout?: any;

  init() {
    this.lenis = new Lenis({
      duration: 0.8, // bazowa płynność
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic: szybki start, wolny koniec
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.5, // bazowy skok scrolla
      touchMultiplier: 1.5,
      autoRaf: true,
    });

    // 🔥 WYKRYWANIE SCROLLU – BRAKOWAŁO TEGO
    this.lenis.on('scroll', () => {
      this.isScrolling = true;

      // reset timeout
      clearTimeout(this.scrollTimeout);

      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 150); // 150ms po skończeniu scrolla hover znowu działa
    });

    // dynamiczny multiplier zależny od velocity
    this.lenis.on('scroll', (e: any) => {
      if (!this.lenis) return;

      const speedFactor = Math.min(Math.abs(e.velocity) * 2, 3);
      this.lenis.options.wheelMultiplier = 0.5 * speedFactor;
    });

    // // dynamiczny multiplier zależny od velocity
    // this.lenis.on('scroll', (e: any) => {
    //   if (!this.lenis) return;

    //   // velocity określa jak mocno użytkownik scrolluje
    //   const speedFactor = Math.min(Math.abs(e.velocity) * 2, 3); // max 3x
    //   this.lenis.options.wheelMultiplier = 0.5 * speedFactor;
    // });
  }

  ngOnDestroy() {
    this.lenis?.destroy();
  }
}
