import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ObAlertComponent, ObButtonDirective, ObSelectableGroupDirective} from '@oblique/oblique';
import {AppRoutes} from '../../../../../app.routes';
import {AppConfigService} from '../../../../../core/appconfig/app-config.service';
import {ClipboardComponent} from '../../../../../shared/clipboard/clipboard.component';
import {ProcessStepComponent} from '../../../../../shared/process/process-step/process-step.component';
import {ProcessComponent} from '../../../../../shared/process/process.component';
import {RadioCardComponent} from '../../../../../shared/radio-card/radio-card.component';
import {AbstractOnboardingStepComponent} from '../../../../onboarding/trust/steps/abstract-onboarding-step-component';
import {PartnerRegistrationWizardService} from '../../wizard/partner-registration-wizard.service';

// Variants of handover displayed to the user
export enum SetupVariant {
  EXPERT = 'expert',
  SELF = 'self'
}

@Component({
  selector: 'app-handover-step',
  imports: [
    TranslatePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    ObAlertComponent,
    ObSelectableGroupDirective,
    ReactiveFormsModule,
    MatIcon,
    ProcessComponent,
    ProcessStepComponent,
    ClipboardComponent,
    MatCardTitle,
    MatButton,
    ObButtonDirective,
    RadioCardComponent,
    RouterLink
  ],
  templateUrl: './partner-registration-handover-step.component.html',
  styleUrls: ['./partner-registration-handover-step.component.scss'],
  providers: [{provide: AbstractOnboardingStepComponent, useExisting: PartnerRegistrationHandoverStepComponent}]
})
export class PartnerRegistrationHandoverStepComponent extends AbstractOnboardingStepComponent {
  protected readonly wizardService = inject(PartnerRegistrationWizardService);
  protected readonly AppRoutes = AppRoutes;
  registrationCompleted = signal<boolean>(false);
  variantStepCompleted = signal<boolean>(false);
  readonly SetupVariant = SetupVariant;
  protected readonly appConfig = inject(AppConfigService);
  private readonly translateService = inject(TranslateService);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly fb = inject(FormBuilder);
  readonly setupForm = this.fb.group({
    setupVariant: this.fb.control<SetupVariant | null>(null, Validators.required)
  });

  constructor() {
    super();
    this.addCustomIcon();
  }

  override validate(): Promise<boolean> {
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
    }

    if (this.setupForm.valid && !this.variantStepCompleted()) {
      this.variantStepCompleted.set(true);
      return Promise.resolve(false);
    }

    if (this.variantStepCompleted()) {
      this.registrationCompleted.set(true);
      return Promise.resolve(false);
    }

    return Promise.resolve(false);
  }

  selectSetupVariant(variant: SetupVariant): void {
    this.setupForm.patchValue({setupVariant: variant});
  }

  onKeyDown(event: KeyboardEvent, variant: SetupVariant): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectSetupVariant(variant);
    }
  }

  private addCustomIcon() {
    this.iconRegistry.addSvgIcon(
      'devhandover_self',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/devhandover_self.svg')
    );
    this.iconRegistry.addSvgIcon(
      'devhandover_expert',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/devhandover_expert.svg')
    );
  }
}
