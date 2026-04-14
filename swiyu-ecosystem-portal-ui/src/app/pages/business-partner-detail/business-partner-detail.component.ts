import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  ViewChild
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ObButtonModule} from '@oblique/oblique';
import {catchError, concatMap, forkJoin, map, merge, of, startWith, switchMap, tap, throwError} from 'rxjs';
import {
  BusinessPartner,
  BusinessPartnerApi,
  BusinessPartnerTrustStatus,
  IdentifierApi,
  IdentifierResponse,
  ProofOfPossession,
  TrustOnboardingApi,
  TrustOnboardingSubmission
} from '../../api/generated';
import {AppRoutes} from '../../app.routes';
import {AppConfigService} from '../../core/appconfig/app-config.service';
import {getLastValidTrustStepRoute} from '../../core/util/last-valid-trust-step-route';
import {BusinessPartnerTrustChipComponent} from '../../shared/business-partner-trust-chip/business-partner-trust-chip.component';
import {IdentifierBaseOnboardingStatusComponent} from '../../shared/identifier-base-onboarding-status/identifier-base-onboarding-status.component';
import {StatefulAlertComponent} from '../../shared/stateful-alert/stateful-alert.component';

@Component({
  selector: 'app-business-partner-detail',
  templateUrl: './business-partner-detail.component.html',
  styleUrl: './business-partner-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
    ObButtonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    RouterModule,
    BusinessPartnerTrustChipComponent,
    StatefulAlertComponent,
    IdentifierBaseOnboardingStatusComponent
  ]
})
export class BusinessPartnerDetailComponent {
  businessPartnerId = input.required<string>();
  readonly appConfigService = inject(AppConfigService);
  readonly router = inject(Router);
  @ViewChild(StatefulAlertComponent)
  alertNoDIDs!: StatefulAlertComponent;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<IdentifierResponse>([]);
  businessPartner = signal<BusinessPartner | undefined>(undefined);
  trustOnboardingSubmission = signal<TrustOnboardingSubmission | undefined>(undefined);
  alertNoDIDsVisible = signal<boolean>(false);
  alertProofContinueVisible = computed(
    () =>
      // if TrustOnboardingSubmission is Unsubmitted
      this.trustOnboardingSubmission()?.status === TrustOnboardingSubmission.StatusEnum.Unsubmitted &&
      // and only contains Valid proofs
      this.trustOnboardingSubmission()?.proofOfPossessionList.filter(
        tos => tos.status !== ProofOfPossession.StatusEnum.Valid
      ).length === 0
  );
  alertTrustOnboardingSuccessfulVisible = computed(
    () =>
      // if TrustOnboardingSubmission is Unsubmitted
      this.trustOnboardingSubmission()?.status === TrustOnboardingSubmission.StatusEnum.Succeeded
  );
  alertTrustOnboardingInformationRequestedVisible = computed(
    () =>
      // if TrustOnboardingSubmission is Unsubmitted
      this.trustOnboardingSubmission()?.status === TrustOnboardingSubmission.StatusEnum.InformationRequested
  );
  trustOnboardingStepActionRoute = computed(() => {
    const submission = this.trustOnboardingSubmission();
    if (!submission) {
      return AppRoutes.trustOnboardingIntroduction(this.businessPartnerId());
    }
    return getLastValidTrustStepRoute(submission);
  });
  onboardingProcessStarted = computed<boolean>(() => this.trustOnboardingSubmission() !== undefined);

  protected readonly AppRoutes = AppRoutes;
  protected readonly BusinessPartnerTrustStatus = BusinessPartnerTrustStatus;
  private readonly businessPartnerApi = inject(BusinessPartnerApi);
  private readonly trustOnboardingApi = inject(TrustOnboardingApi);
  private readonly identifierApi = inject(IdentifierApi);

  constructor() {
    effect(onCleanup => {
      const sub = forkJoin([
        this.businessPartnerApi.getBusinessPartner({
          businessPartnerId: this.businessPartnerId()
        }),
        this.trustOnboardingApi
          .getLatestTrustOnboardingSubmission({
            latestTrustOnboardingSubmissionRequest: {
              businessPartnerId: this.businessPartnerId()
            }
          })
          .pipe(
            catchError(err => {
              if (err.status == 404) {
                return of(undefined);
              }
              return throwError(() => err);
            })
          )
      ])
        .pipe(
          tap(([businessPartner, latestTrustOnboardingSubmission]) => {
            this.businessPartner.set(businessPartner);
            this.trustOnboardingSubmission.set(latestTrustOnboardingSubmission);
          }),
          concatMap(() => this.reloadDataOnTableChanges())
        )
        .subscribe();

      onCleanup(() => sub.unsubscribe());
    });
    afterNextRender(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private reloadDataOnTableChanges() {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return merge(this.paginator.page, this.sort.sortChange).pipe(
      startWith({}),
      switchMap(() => {
        return this.identifierApi
          .getAllIdentifiersOfPartner({
            page: this.paginator?.pageIndex ?? 0,
            size: this.paginator?.pageSize ?? 10,
            sort: [`${this.sort?.active},${this.sort?.direction}`],
            partnerId: this.businessPartnerId()
          })
          .pipe(
            map(result => {
              this.dataSource.data = result.content || [];
              this.alertNoDIDsVisible.set(this.dataSource.data.length === 0);
              if (result.page && this.paginator) {
                this.paginator.length = result.page.totalElements ?? this.dataSource.data.length;
                this.paginator.pageIndex = result.page.number ?? 0;
                this.paginator.pageSize = result.page.size ?? this.dataSource.data.length;
              }
            })
          );
      })
    );
  }
}
