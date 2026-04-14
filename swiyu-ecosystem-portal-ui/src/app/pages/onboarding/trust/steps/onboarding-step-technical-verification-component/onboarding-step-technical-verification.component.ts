import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ObAlertComponent, ObButtonDirective} from '@oblique/oblique';
import {firstValueFrom} from 'rxjs';
import {TrustOnboardingApi} from '../../../../../api/generated';
import {AppConfigService} from '../../../../../core/appconfig/app-config.service';
import {TrustOnboardingWizardService} from '../../wizard/trust-onboarding-wizard.service';
import {AbstractOnboardingStepComponent} from '../abstract-onboarding-step-component';
import {ExplainerStep, explainerStepsDev, explainerStepsSelf, ProofProcessType} from './explainer-steps.types';

@Component({
  selector: 'app-onboarding-step-technical-verification',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatRadioButton,
    MatRadioGroup,
    MatIcon,
    ObAlertComponent,
    FormsModule,
    MatIconButton,
    ObButtonDirective,
    MatButton,
    MatChip
  ],
  templateUrl: 'onboarding-step-technical-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: AbstractOnboardingStepComponent, useExisting: OnboardingStepTechnicalVerificationComponent}],
  styleUrls: ['../onboarding-steps.scss', './onboarding-step-technical-verification.component.scss']
})
export class OnboardingStepTechnicalVerificationComponent extends AbstractOnboardingStepComponent {
  private readonly translateService = inject(TranslateService);
  protected readonly appConfig = inject(AppConfigService);
  private readonly trustOnboardingApi = inject(TrustOnboardingApi);
  protected readonly wizardService = inject(TrustOnboardingWizardService);

  selectedProofProcessType = signal<ProofProcessType | null>(null);

  showError = signal<boolean>(false);

  public explainerStepsDev = explainerStepsDev;

  public explainerStepsSelf = explainerStepsSelf;

  constructor() {
    super();
    this.translateSetup();
  }

  // we skip frontend validation and instead take the result of submit
  override async validate(): Promise<boolean> {
    const submission = this.wizardService.submission();
    const id = submission?.id;
    const version = submission?.version;
    if (id && version) {
      try {
        await firstValueFrom(
          this.trustOnboardingApi.submitTrustOnboardingSubmission({
            id: id,
            trustOnboardingSubmitRequest: {
              version: version
            }
          })
        );
        return true;
      } catch {
        this.showError.set(true);
        return false;
      }
    } else {
      this.showError.set(true);
      return false;
    }
  }

  get activeSteps(): ExplainerStep[] {
    if (this.selectedProofProcessType() === ProofProcessType.dev) {
      return this.explainerStepsDev;
    }
    if (this.selectedProofProcessType() === ProofProcessType.self) {
      return this.explainerStepsSelf;
    }
    return [];
  }

  protected numberOfMissingVerifications = computed(() => {
    return (
      this.wizardService.submission()?.proofOfPossessionList?.filter(pop => pop.status === 'NOT_SUPPLIED').length ?? 0
    );
  });

  protected numberOfSuccessfulVerifications = computed(() => {
    return this.wizardService.submission()?.proofOfPossessionList?.filter(pop => pop.status === 'VALID').length ?? 0;
  });

  protected daysRemainingForVerification = computed(() => {
    return 42; //  only visual. currently there is no logic implemented regarding expiry of submission
  });

  protected copyPOPUrl() {
    const popUrl = this.appConfig.portalUrl;
    if (popUrl) {
      navigator.clipboard.writeText(popUrl);
    }
  }

  private translateSetup() {
    // Required for translate service auto collection of i18n keys
    this.translateService.get('eportal_onboardingTR_technicalProof_sendInvite_cardTitle');
    this.translateService.get('eportal_onboardingTR_technicalProof_sendInvite_cardText');
    this.translateService.get('eportal_global_link_invitation');
    this.translateService.get('eportal_global_link_TechDocumentation');
    this.translateService.get('eportal_onboardingTR_technicalProof_handover_cardText');
    this.translateService.get('eportal_onboardingTR_technicalProof_handover_cardTitle');
    this.translateService.get('eportal_onboardingTR_technicalProof_complete_cardTitle');
    this.translateService.get('eportal_onboardingTR_technicalProof_complete_cardText');
    this.translateService.get('eportal_onboardingTR_technicalProof_provideData_cardTitle');
    this.translateService.get('eportal_onboardingTR_technicalProof_provideData_cardText');
    this.translateService.get('eportal_onboardingTR_technicalProof_provideData_alert');
    this.translateService.get('eportal_global_link_DIDtoolbox');
    this.translateService.get('eportal_onboardingTR_technicalProof_btnSec_openOverview');
    this.translateService.get('eportal_onboardingTR_technicalProof_submitProof_cardText');
  }

  protected readonly ProofProcessType = ProofProcessType;
}
