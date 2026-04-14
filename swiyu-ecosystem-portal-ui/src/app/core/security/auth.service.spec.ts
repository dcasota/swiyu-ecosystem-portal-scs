import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {NEVER} from 'rxjs';
import {AuthService} from './auth.service';

describe('AuthService', () => {
  let oauthServiceMock: {
    events: typeof NEVER;
    configure: jest.Mock;
    loadDiscoveryDocumentAndTryLogin: jest.Mock;
    setupAutomaticSilentRefresh: jest.Mock;
    initLoginFlow: jest.Mock;
    hasValidAccessToken: jest.Mock;
  };
  let routerNavigateByUrlMock: jest.Mock;

  beforeEach(() => {
    sessionStorage.clear();
    oauthServiceMock = {
      events: NEVER,
      configure: jest.fn(),
      loadDiscoveryDocumentAndTryLogin: jest.fn().mockResolvedValue(true),
      setupAutomaticSilentRefresh: jest.fn(),
      initLoginFlow: jest.fn(),
      hasValidAccessToken: jest.fn()
    };
    routerNavigateByUrlMock = jest.fn().mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: OAuthService, useValue: oauthServiceMock},
        {provide: Router, useValue: {navigateByUrl: routerNavigateByUrlMock}}
      ]
    });
  });

  it('startLoginFlowWithReturnUrl stores session url and starts login without extra state', () => {
    const auth = TestBed.inject(AuthService);
    auth.startLoginFlowWithReturnUrl('/ui/next');
    expect(oauthServiceMock.initLoginFlow).toHaveBeenCalled();
    expect(sessionStorage.getItem('swiyu_post_login_return_url')).toBe('/ui/next');
  });

  it('configureFlow navigates when logged in with stored post-login url', fakeAsync(() => {
    oauthServiceMock.hasValidAccessToken.mockReturnValue(true);
    sessionStorage.setItem('swiyu_post_login_return_url', '/ui/onboarding/base/register/x/payment');

    TestBed.inject(AuthService).configureFlow({issuer: 'https://idp'} as never, false);
    tick();

    expect(routerNavigateByUrlMock).toHaveBeenCalledWith('/ui/onboarding/base/register/x/payment');
    expect(sessionStorage.getItem('swiyu_post_login_return_url')).toBeNull();
    expect(oauthServiceMock.initLoginFlow).not.toHaveBeenCalled();
  }));

  it('configureFlow opens login when there is no token', fakeAsync(() => {
    oauthServiceMock.hasValidAccessToken.mockReturnValue(false);

    TestBed.inject(AuthService).configureFlow({issuer: 'https://idp'} as never, false);
    tick();

    expect(oauthServiceMock.initLoginFlow).toHaveBeenCalled();
    expect(routerNavigateByUrlMock).not.toHaveBeenCalled();
  }));
});
