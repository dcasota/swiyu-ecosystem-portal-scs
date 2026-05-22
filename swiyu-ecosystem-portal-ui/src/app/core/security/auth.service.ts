import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, from, Observable, tap} from 'rxjs';

const POST_LOGIN_RETURN_SESSION_KEY = 'swiyu_post_login_return_url';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly oauthService = inject(OAuthService);
  private readonly router = inject(Router);
  private readonly useDiscoveryDocument = true;
  public readonly loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.oauthService.events.subscribe(() => {
      const loggedInOld = this.loggedIn$.getValue();
      const loggedIn = this.oauthService.hasValidAccessToken();
      if (loggedIn !== loggedInOld) {
        this.loggedIn$.next(loggedIn);
      }
    });
  }

  configureFlow(authConfig: AuthConfig, tokenRefreshEnabled: boolean) {
    return this.configureOidc(authConfig, tokenRefreshEnabled)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initLoginFlow();
          return;
        }

        const sessionUrl = this.takePostLoginReturnUrl();
        if (sessionUrl && this.isSafeReturnUrl(sessionUrl)) {
          void this.router.navigateByUrl(sessionUrl);
        }
      });
  }

  startLoginFlowWithReturnUrl(returnUrl: string): void {
    this.storePostLoginReturnUrl(returnUrl);
    this.oauthService.initLoginFlow();
  }

  refreshToken(): Observable<object> {
    return from(this.oauthService.silentRefresh());
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  private configureOidc(authConfig: AuthConfig | undefined, tokenRefreshEnabled: boolean): Observable<boolean> {
    if (!authConfig) {
      throw new Error(
        'Failed to configure authentication due to missing authConfig. Did the backend return a valid config?'
      );
    }
    this.oauthService.configure(authConfig);
    const configurationResult: Observable<boolean> = this.useDiscoveryDocument
      ? from(this.oauthService.loadDiscoveryDocumentAndTryLogin())
      : from(this.oauthService.tryLogin());

    return configurationResult.pipe(tap(() => this.setupAutomaticSilentRefreshIfConfigured(tokenRefreshEnabled)));
  }

  private storePostLoginReturnUrl(returnUrl: string) {
    sessionStorage.setItem(POST_LOGIN_RETURN_SESSION_KEY, returnUrl);
  }

  private takePostLoginReturnUrl(): string | null {
    const url = sessionStorage.getItem(POST_LOGIN_RETURN_SESSION_KEY);
    if (url !== null) {
      sessionStorage.removeItem(POST_LOGIN_RETURN_SESSION_KEY);
    }
    return url;
  }

  /**
   * Guards against open redirects (CWE-601). Only same-origin, absolute-path URLs are allowed as
   * post-login return targets. Protocol-relative ("//host"), backslash tricks and any URL carrying
   * a scheme or host are rejected so a stored value can never navigate the user off-origin.
   */
  private isSafeReturnUrl(url: string): boolean {
    if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
      return false;
    }
    try {
      return new URL(url, window.location.origin).origin === window.location.origin;
    } catch {
      return false;
    }
  }

  private setupAutomaticSilentRefreshIfConfigured(tokenRefreshEnabled: boolean): void {
    if (tokenRefreshEnabled) {
      this.oauthService.setupAutomaticSilentRefresh();
    }
  }
}
