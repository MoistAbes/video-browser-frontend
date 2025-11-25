import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endpoints } from '../../endpoints/endpoints';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamKeyService {
  private key: string | null = null;
  private keyTimestamp: number | null = null;

  // TTL klucza w ms – np. 1 godzina
  private readonly KEY_TTL = 24 * 60 * 60 * 1000; // 24 godziny

  constructor(private http: HttpClient) {
    this.key = sessionStorage.getItem('streamAuthKey');
    const ts = sessionStorage.getItem('streamAuthKeyTimestamp');
    this.keyTimestamp = ts ? Number(ts) : null;
  }

  /**
   * Zwraca ważny klucz. Jeśli forceRefresh = true lub klucz przeterminowany → generuje nowy.
   */
  async getValidKey(forceRefresh = false): Promise<string> {
    if (
      !forceRefresh &&
      this.key &&
      this.keyTimestamp &&
      Date.now() - this.keyTimestamp < this.KEY_TTL
    ) {
      return this.key;
    }
    return this.generateKey();
  }

  /**
   * Generuje nowy klucz i zapisuje go w sessionStorage.
   */
  private async generateKey(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ key: string }>(Endpoints.stream.authorize)
    );

    if (!response?.key) {
      throw new Error('Nie udało się wygenerować stream key');
    }

    this.key = response.key;
    this.keyTimestamp = Date.now();
    sessionStorage.setItem('streamAuthKey', this.key);
    sessionStorage.setItem('streamAuthKeyTimestamp', this.keyTimestamp.toString());

    return this.key;
  }

  /**
   * Odświeża klucz niezależnie od TTL.
   */
  refreshKey(): Observable<string> {
    return this.http.get<{ key: string }>(Endpoints.stream.authorize).pipe(
      map((resp) => {
        if (!resp?.key) throw new Error('Nie udało się odświeżyć stream key');
        this.key = resp.key;
        this.keyTimestamp = Date.now();
        sessionStorage.setItem('streamAuthKey', this.key);
        sessionStorage.setItem('streamAuthKeyTimestamp', this.keyTimestamp.toString());
        return this.key;
      })
    );
  }

  /**
   * Odbudowuje URL z aktualnym kluczem.
   */
  rebuildUrlWithKey(url: string): string {
    const key = this.key ?? sessionStorage.getItem('streamAuthKey');
    const u = new URL(url, window.location.origin);
    u.searchParams.set('authKey', key!);
    return u.toString();
  }

  /**
 * Czyści przechowywane wartości klucza stream.
 */
clearValues(): void {
  this.key = null;
  this.keyTimestamp = null;
  sessionStorage.removeItem('streamAuthKey');
  sessionStorage.removeItem('streamAuthKeyTimestamp');
}
}
