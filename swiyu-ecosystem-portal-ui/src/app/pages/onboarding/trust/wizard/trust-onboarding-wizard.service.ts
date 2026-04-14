import {inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ObNotificationService} from '@oblique/oblique';
import {
  BusinessPartner,
  BusinessPartnerApi,
  TrustOnboardingApi,
  TrustOnboardingSubmission,
  TrustOnboardingSubmissionRequest
} from '../../../../api/generated';
import {AppRoutes} from '../../../../app.routes';
import {AppConfigService} from '../../../../core/appconfig/app-config.service';
import {AbstractOnboardingStepComponent} from '../steps/abstract-onboarding-step-component';

export const TRUST_STEP_SEGMENTS = ['profile', 'dids', 'formal-proof', 'technical-proof', 'approval'];
export const TRUST_STEP_MAP = Object.fromEntries(TRUST_STEP_SEGMENTS.map((s, i) => [s, i]));

@Injectable()
export class TrustOnboardingWizardService {
  private readonly trustOnboardingApi = inject(TrustOnboardingApi);
  private readonly businessPartnerApi = inject(BusinessPartnerApi);
  private readonly obNotificationService = inject(ObNotificationService);
  private readonly router = inject(Router);
  readonly appConfigService = inject(AppConfigService);

  partnerId: string | null = null;
  submissionId: string | null = null;
  isIntentionalNavigation = false;

  readonly submission = signal<TrustOnboardingSubmission | undefined>(undefined);
  readonly businessPartnerName = signal<string>('');
  submissionRequest: TrustOnboardingSubmissionRequest = {};
  initialSubmissionRequest: TrustOnboardingSubmissionRequest = {};

  private activeStep: AbstractOnboardingStepComponent | null = null;
  currentStepIndex = 0;

  init(partnerId: string, submissionId: string): void {
    this.partnerId = partnerId;
    this.submissionId = submissionId;

    this.businessPartnerApi.getBusinessPartner({businessPartnerId: partnerId}).subscribe({
      next: (result: BusinessPartner) => {
        this.businessPartnerName.set(result.name);
      }
    });

    this.trustOnboardingApi.getTrustOnboardingSubmission({id: submissionId}).subscribe({
      next: (result: TrustOnboardingSubmission) => {
        this.submission.set(result);
        this.submissionRequest = this.mapToSubmissionRequest(result);
        this.initialSubmissionRequest = {...this.submissionRequest};
      }
    });
  }

  setActiveStep(step: AbstractOnboardingStepComponent | null): void {
    this.activeStep = step;
  }

  saveAndNext(): void {
    this.validateStepIsValid().then(isValid => {
      if (isValid && this.submissionRequest && this.submissionId) {
        this.trustOnboardingApi
          .updateTrustOnboardingSubmission({
            id: this.submissionId,
            trustOnboardingSubmissionRequest: this.submissionRequest
          })
          .subscribe({
            next: (submission: TrustOnboardingSubmission) => {
              this.submission.set(submission);
              this.initialSubmissionRequest = {...this.submissionRequest};
              this.navigateToNextStep();
            },
            error: err => {
              this.obNotificationService.error(err.message);
            }
          });
      }
    });
  }

  submit(): void {
    this.validateStepIsValid().then(isValid => {
      if (isValid) {
        this.initialSubmissionRequest = {...this.submissionRequest};
        this.navigateToNextStep();
      }
    });
  }

  onSaveAndContinueLater(): void {
    this.validateStepIsValid().then(isValid => {
      if (!isValid || !this.submissionId || !this.submissionRequest) {
        return;
      }
      this.trustOnboardingApi
        .updateTrustOnboardingSubmission({
          id: this.submissionId,
          trustOnboardingSubmissionRequest: this.submissionRequest
        })
        .subscribe({
          next: (result: TrustOnboardingSubmission) => {
            this.submission.set(result);
            this.isIntentionalNavigation = true;
            this.router.navigate(AppRoutes.businessPartnerOverviewV2());
          }
        });
    });
  }

  navigateToPreviousStep(): void {
    if (!this.partnerId || !this.submissionId) {
      return;
    }
    if (this.currentStepIndex > 0) {
      const prevSegment = TRUST_STEP_SEGMENTS[this.currentStepIndex - 1];
      this.router.navigate([...AppRoutes.trustOnboardingWizard(this.partnerId, this.submissionId), prevSegment]);
    }
  }

  updateOrganisationData(value: Partial<TrustOnboardingSubmissionRequest>): void {
    this.submissionRequest = {...this.submissionRequest, ...value, entityEmail: value.contactPerson?.email};
  }

  updateDidSelection(value: string[]): void {
    this.submissionRequest = {...this.submissionRequest, dids: value};
  }

  private navigateToNextStep(): void {
    if (!this.partnerId || !this.submissionId) {
      return;
    }
    if (this.currentStepIndex < TRUST_STEP_SEGMENTS.length - 1) {
      const nextSegment = TRUST_STEP_SEGMENTS[this.currentStepIndex + 1];
      this.router.navigate([...AppRoutes.trustOnboardingWizard(this.partnerId, this.submissionId), nextSegment]);
    }
  }

  private async validateStepIsValid(): Promise<boolean> {
    if (!this.activeStep) {
      return false;
    }
    return this.activeStep.validate();
  }

  private mapToSubmissionRequest(result: TrustOnboardingSubmission): TrustOnboardingSubmissionRequest {
    return {
      partnerId: result.partnerId,
      entityName: result.entityName,
      entityAddress: result.entityAddress,
      entityEmail: result.entityEmail,
      contactPerson: result.contactPerson,
      registryIds: result.registryIds,
      correspondingLanguage: result.correspondingLanguage,
      dids: result.proofOfPossessionList.map(pop => pop.did ?? '') || []
    };
  }
}
