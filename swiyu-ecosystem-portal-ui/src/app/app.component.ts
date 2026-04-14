import {Component, inject, OnInit} from '@angular/core';
import {MatChip} from '@angular/material/chips';
import {ActivatedRoute, Router} from '@angular/router';
import {UntilDestroy} from '@ngneat/until-destroy';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {
  ObIServiceNavigationLink,
  ObMasterLayoutConfig,
  ObMasterLayoutHeaderService,
  ObMasterLayoutModule
} from '@oblique/oblique';
import {filter, map, mergeMap, of} from 'rxjs';
import {AppConfigService} from './core/appconfig/app-config.service';
import {AuthService} from './core/security/auth.service';
import {UserProfileService} from './core/user/user-profile.service';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [TranslateModule, ObMasterLayoutModule, MatChip]
})
export class AppComponent implements OnInit {
  private readonly config = inject(ObMasterLayoutConfig);
  private readonly headerService = inject(ObMasterLayoutHeaderService);
  private readonly appConfigService = inject(AppConfigService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly authService = inject(AuthService);
  private readonly lang = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    // do not remove this logging until we have the 1st real use case to use
    // the profile in gov unboarding (otherwise UserProfileService gets tree shaken)
    this.userProfileService.userProfile$.subscribe(userProfile => {
      console.log(`current user is governmental: ${userProfile?.isGovernmental}`);
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get productLabel() {
    return this.appConfigService.productLabel ?? '';
  }

  ngOnInit(): void {
    this.config.layout.hasMaxWidth = true;
    this.configureServiceNavigation();
    this.authService.configureFlow(this.appConfigService.authConfig(), this.appConfigService.tokenRefreshEnabled);
    this.config.header.serviceNavigation.infoLinks = [
      {
        url: this.lang.instant('app.serviceNav.help.helpAndAnswers.link'),
        label: this.lang.instant('app.serviceNav.help.helpAndAnswers')
      },
      {
        url: 'https://swiyu-admin-ch.github.io/',
        label: this.lang.instant('app.serviceNav.help.technicalInformation')
      },
      {
        url: this.lang.instant('app.serviceNav.help.legal.link'),
        label: this.lang.instant('app.serviceNav.help.legal')
      },
      {
        url: this.lang.instant('app.serviceNav.help.additionalInformation.link'),
        label: this.lang.instant('app.serviceNav.help.additionalInformation')
      },
      {
        url: 'https://github.com/orgs/swiyu-admin-ch/discussions',
        label: this.lang.instant('app.serviceNav.help.github.discussions')
      },
      {
        url: this.lang.instant('app.serviceNav.help.feedback.link'),
        label: this.lang.instant('app.serviceNav.help.feedback')
      }
    ] as ObIServiceNavigationLink[];

    // Redirect when invalid language query param is present
    this.route.queryParams
      .pipe(
        filter(params => params['lang']),
        map(param => param['lang'] as string),
        mergeMap(params => {
          if (!this.lang.getLangs().includes(params)) {
            // Navigate to the same URL without the invalid language query param
            return this.router.navigate(this.router.url.split('?')[0].split('/'));
          }
          return of();
        })
      )
      .subscribe();
  }

  private configureServiceNavigation(): void {
    const serviceNavigation = this.headerService.serviceNavigationConfiguration;
    serviceNavigation.displayInfo = true;
    serviceNavigation.displayLanguages = true;
    serviceNavigation.displayMessage = true;
    serviceNavigation.displayApplications = true;
    serviceNavigation.displayAuthentication = true;
    serviceNavigation.displayProfile = true;
    serviceNavigation.profileLinks = [];
    serviceNavigation.pamsAppId = this.appConfigService.eportalConfig?.pamsAppId;
    serviceNavigation.returnUrl = window.location.href;
    serviceNavigation.infoContact = {
      email: this.appConfigService.eportalConfig?.infoContactEmail
    };
  }
}
