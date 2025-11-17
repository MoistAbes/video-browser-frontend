import { ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { VideoCardInfoPanelComponent } from '../../components/video-card-component/video-card-info-panel-component/video-card-info-panel-component';
import { Subscription } from 'rxjs';
import { StreamKeyService } from './stream-key-service';
import { GenreModel } from '../../models/show/genre-model';
import { NavigationStart, Router } from '@angular/router';
import { UtilService } from './util-service';

@Injectable({
  providedIn: 'root',
})
export class HoverPreviewService implements OnDestroy {
  private overlayRef?: OverlayRef;
  private currentRef?: ComponentRef<VideoCardInfoPanelComponent>;
  private positionSub?: Subscription;
  private closeTimerId: ReturnType<typeof setTimeout> | null = null;

  private routerSub?: Subscription;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private streamKeyService: StreamKeyService,
    private router: Router,
    private utilService: UtilService
  ) {
    // automatycznie zamykaj panel przy każdej zmianie trasy
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.close(); // zamyka panel overlay
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  updateAnchor(
    newAnchor: HTMLElement,
    data: {
      title: string;
      description: string;
      genres: GenreModel[];
      seasonsAmount: number;
      moviesAmount: number;
      videoLength: number;
      videoSrc: string;
    }
  ) {
    this.cancelClose(); // nie zamykaj, bo przechodzimy do nowej karty
    this.open(newAnchor, data); // otwórz nowy panel
  }

  async open(
    anchor: HTMLElement,
    data: {
      title: string;
      description: string;
      genres: GenreModel[];
      seasonsAmount: number;
      moviesAmount: number;
      videoLength: number;
      videoSrc: string;
    }
  ) {
    // metoda open() zaczyna się od ustalenia pozycji panelu względem elementu kotwicy (anchor),
    // czyli karty, nad którą znajduje się myszka.

    // Pierwsza pozycja: panel pojawia się po prawej stronie karty (originX: 'end', overlayX: 'start').
    // Druga pozycja: fallback — panel pojawia się po lewej stronie, jeśli nie zmieści się po prawej.
    // offsetX: dodaje przesunięcie, żeby panel nie był przyklejony do karty.

    const positions: ConnectedPosition[] = [
      // 1) PRAWA (preferowana)
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 0,
      },
      // 2) LEWA (fallback)
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: 0,
      },
    ];

    // Jeśli overlayRef jeszcze nie istnieje, tworzysz go z odpowiednią strategią pozycjonowania.
    // withPush(false): oznacza, że panel nie będzie przesuwany, tylko się flipnie na drugą stronę, jeśli nie zmieści się po prawej.
    // scrollStrategy.reposition(): panel będzie się przesuwał razem z kartą przy scrollowaniu.

    if (!this.overlayRef) {
      const strategy = this.overlay
        .position()
        .flexibleConnectedTo(anchor)
        .withPositions(positions)
        .withFlexibleDimensions(false) // nie ściskaj panelu
        .withViewportMargin(8)
        .withPush(false); // jeśli nie mieści się po prawej -> flip na lewo

      this.overlayRef = this.overlay.create({
        positionStrategy: strategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        hasBackdrop: false,
        panelClass: ['preview-overlay-panel'],
      });
    } else {
      // Jeśli overlayRef już istnieje, aktualizujesz jego pozycję względem nowej karty (anchor).
      // Dzięki temu panel nie jest tworzony od nowa — tylko przesuwany i aktualizowany.

      const strategy = this.overlayRef.getConfig()
        .positionStrategy as FlexibleConnectedPositionStrategy;
      strategy.setOrigin(anchor);
      strategy.withPositions(positions); // na wszelki wypadek, gdybyś zmieniał strategie dynamicznie
      this.overlayRef.updatePosition();
    }

    // Jeśli jakiś komponent jest już podpięty do overlayRef, odłączasz go — żeby animacja wejścia nowego panelu działała poprawnie.

    // Odłącz poprzedni panel (żeby animacja wejścia działała)
    if (this.overlayRef!.hasAttached()) {
      this.detachWithCleanup();
    }

    // Tworzysz nowy ComponentPortal dla VideoCardInfoPanelComponent.
    // Podpinasz go do overlayRef, zapisujesz referencję do currentRef.

    const portal = new ComponentPortal(VideoCardInfoPanelComponent, null, this.injector);
    const componentRef = this.overlayRef!.attach(portal);
    this.currentRef = componentRef;

    // Przekazujesz dane z karty do panelu — tytuł, opis, źródło wideo.
    componentRef.instance.title = data.title;
    componentRef.instance.formattedShowInfo = this.formatPreviewInfo(
      data.seasonsAmount,
      data.moviesAmount,
      data.videoLength
    );
    componentRef.instance.genres = data.genres;
    componentRef.instance.description = data.description;

    // pobieramy aktualny klucz
    const key = await this.streamKeyService.getValidKey();

    // budujemy URL z authKey
    const urlWithKey = this.streamKeyService.rebuildUrlWithKey(data.videoSrc);

    // ustawiamy w komponencie preview
    componentRef.instance.videoSrc = urlWithKey;

    // Panel może sam kontrolować swój cykl życia — np. jeśli użytkownik najedzie na panel, to nie zamykaj go (cancelClose()).
    // Jeśli opuści panel, to zamknij go po 220 ms (scheduleClose()).
    componentRef.instance.mouseEntered.subscribe(() => this.cancelClose());
    componentRef.instance.mouseLeft.subscribe(() => this.scheduleClose(220));
    componentRef.instance.closeRequested.subscribe(() => this.close());

    // Subskrybuje zmiany pozycji panelu (np. gdy nie zmieści się po prawej i flipnie się na lewo).
    // mapPosition() tłumaczy ConnectedPosition na stringa ('left' lub 'right'), który możesz użyć np. do ustawienia klasy CSS w komponencie.
    const strategy = this.overlayRef!.getConfig()
      .positionStrategy as FlexibleConnectedPositionStrategy;
    this.positionSub?.unsubscribe();
    this.positionSub = strategy.positionChanges.subscribe(({ connectionPair }) => {
      const pos = this.mapPosition(connectionPair);
      if (this.currentRef) this.currentRef.instance.position = pos;
    });

    // queueMicrotask() opóźnia wykonanie kodu do momentu, aż DOM się zaktualizuje — dzięki temu masz pewność, że element panelu już istnieje w DOM.
    // Dodajesz klasę show, która uruchamia animację CSS (np. opacity, transform).
    // Uruchamiasz podgląd wideo (playPreview()), który odpala video.play() na muted — zgodnie z polityką autoplay.
    queueMicrotask(() => {
      const panelEl = this.getPanelHTMLElement();
      panelEl?.classList.add('show');
      componentRef.instance.playPreview();
    });
  }

  // Najpierw czyści poprzedni timer zamykający, jeśli taki istnieje.
  // Dzięki temu nie masz wielu setTimeout() naraz, które mogłyby się nawzajem nadpisywać lub powodować błędne zamknięcia.
  // this.closeTimerId = setTimeout(..., delay):
  //
  // Ustawia nowy timer, który po delay milisekundach wywoła metodę close().
  // Domyślnie delay = 220, co daje użytkownikowi chwilę na ewentualne cofnięcie się na panel (np. z powrotem z karty).
  scheduleClose(delay = 220) {
    this.cancelClose();
    this.closeTimerId = setTimeout(() => this.close(), delay);
  }

  cancelClose() {
    if (this.closeTimerId) {
      clearTimeout(this.closeTimerId);
      this.closeTimerId = null;
    }
  }

  //this.cancelClose()
  // Na wszelki wypadek anulujesz timer zamykający (closeTimerId), jeśli jeszcze działa.
  // Zapobiega to sytuacji, gdzie close() byłby wywołany dwa razy.
  //Jeśli nie masz overlayRef, albo nie ma żadnego komponentu podpiętego — nie ma co zamykać, więc wychodzisz z metody.
  //Usuwasz klasę show, dodajesz klasę hide — uruchamiasz animację CSS zamykania.
  // Dzięki temu panel nie znika natychmiast, tylko np. płynnie zanika (opacity, transform, itp.).
  //Wywołujesz metodę pauseAndUnload() z komponentu panelu:
  // pause() zatrzymuje odtwarzanie.
  // removeAttribute('src') i czyszczenie dzieci <source> zwalnia zasoby.
  // To bardzo dobra praktyka — zapobiega zużyciu pamięci przy szybkim hoverowaniu po wielu kartach.
  //Po 200 ms (czyli tyle, ile trwa animacja hide), odłączasz komponent z overlayRef.
  // Dzięki temu animacja ma czas się zakończyć, zanim DOM zostanie wyczyszczony.
  close() {
    this.cancelClose();
    if (!this.overlayRef?.hasAttached()) return;

    const panelEl = this.getPanelHTMLElement();
    panelEl?.classList.remove('show');
    panelEl?.classList.add('hide');

    this.currentRef?.instance.pauseAndUnload?.();

    setTimeout(() => this.detachWithCleanup(), 200); // 200ms = czas animacji hide
  }

  //Odłącza komponent z overlayRef.
  // Czyści referencje (currentRef, positionSub).
  // Zapobiega wyciekowi pamięci i błędom przy kolejnym otwarciu panelu.
  private detachWithCleanup() {
    this.positionSub?.unsubscribe();
    this.positionSub = undefined;
    if (this.overlayRef?.hasAttached()) this.overlayRef.detach();
    this.currentRef = undefined;
  }

  private getPanelHTMLElement(): HTMLElement | null {
    return this.overlayRef?.overlayElement.querySelector('.info-panel-fixed') ?? null;
  }

  private mapPosition(pair: ConnectedPosition): 'right' | 'left' {
    if (pair.originX === 'end' && pair.overlayX === 'start') return 'right';
    if (pair.originX === 'start' && pair.overlayX === 'end') return 'left';
    return 'right';
  }

  private formatPreviewInfo(
    seasonsAmount: number,
    moviesAmount: number,
    videoLength: number
  ): string {
    // przypadek: są i sezony i filmy
    if (seasonsAmount > 0 && moviesAmount > 0) {
      return `Seasons ${seasonsAmount} Movies ${moviesAmount}`;
    }

    // tylko sezony
    if (seasonsAmount > 0) {
      return `Seasons ${seasonsAmount}`;
    }

    // brak sezonów, wiele filmów
    if (moviesAmount > 1) {
      return `Movies ${moviesAmount}`;
    }

    // brak sezonów, dokładnie jeden film lub brak filmów
    return this.utilService.formatVideoDuration(videoLength);
  }
}
