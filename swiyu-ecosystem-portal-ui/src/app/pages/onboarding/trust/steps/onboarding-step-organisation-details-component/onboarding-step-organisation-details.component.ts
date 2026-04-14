import {UpperCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {
  ObButtonModule,
  ObMatErrorDirective,
  ObSelectableGroupDirective,
  ObUnsavedChangesDirective
} from '@oblique/oblique';
import {
  BusinessPartnerApi,
  PartnerCreationRequest,
  TrustOnboardingSubmissionRequest
} from '../../../../../api/generated';
import {AppConfigService} from '../../../../../core/appconfig/app-config.service';
import {CountryService} from '../../../../../core/util/country.service';
import {RadioCardComponent} from '../../../../../shared/radio-card/radio-card.component';
import {TrustOnboardingWizardService} from '../../wizard/trust-onboarding-wizard.service';
import {AbstractOnboardingStepComponent} from '../abstract-onboarding-step-component';
import PartnerTypeEnum = PartnerCreationRequest.BusinessPartnerTypeEnum;

export const atLeastOneRequired =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const hasValue = Object.values(group.controls).some(control => control.value);
    return hasValue ? null : {atLeastOneRequired: true};
  };

interface PartnerInfo {
  id: string;
  type: string;
}

@Component({
  selector: 'app-onboarding-step-organisation-details',
  imports: [
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ObMatErrorDirective,
    TranslateModule,
    MatIcon,
    MatSelect,
    MatOption,
    FormsModule,
    UpperCasePipe,
    MatCheckbox,
    ObSelectableGroupDirective,
    RadioCardComponent,
    ObUnsavedChangesDirective,
    MatButtonModule,
    ObButtonModule
  ],
  templateUrl: './onboarding-step-organisation-details.component.html',
  styleUrls: ['../onboarding-steps.scss'],
  providers: [{provide: AbstractOnboardingStepComponent, useExisting: OnboardingStepOrganisationDetailsComponent}],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingStepOrganisationDetailsComponent extends AbstractOnboardingStepComponent implements OnInit {
  protected readonly wizardService = inject(TrustOnboardingWizardService);
  public partner = signal<PartnerInfo | undefined>(undefined);
  private readonly fb = inject(FormBuilder);
  protected readonly countryService = inject(CountryService);
  protected readonly appConfigService = inject(AppConfigService);
  private readonly translateService = inject(TranslateService);
  protected readonly PartnerTypeSelection = PartnerTypeEnum;
  private readonly businessPartnerApi = inject(BusinessPartnerApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly languages: string[] = ['DE', 'FR', 'IT', 'EN', 'RM'];
  readonly form = this.fb.group({
    partnerType: this.fb.control<string | undefined>(undefined, Validators.required),
    hasUid: this.fb.control<boolean>(false),
    entityName: this.fb.group(
      {
        de: [''],
        fr: [''],
        it: [''],
        en: [''],
        rm: ['']
      },
      {validators: atLeastOneRequired()}
    ),
    entityAddress: this.fb.group({
      street: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }),
    contactPerson: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      correspondingLanguage: this.fb.control<'EN' | 'DE' | 'FR' | 'IT' | 'RM'>('EN')
    }),
    correspondingLanguage: this.fb.control<'EN' | 'DE' | 'FR' | 'IT' | 'RM'>('EN'),
    registryIds: this.fb.group({
      UID: ['']
    }),
    readTermsAndConditions: this.fb.control<boolean>(false, Validators.requiredTrue),
    readPrivacyPolicy: this.fb.control<boolean>(false, Validators.requiredTrue)
  });

  constructor() {
    super();
    this.translateSetup();
    this.form.controls.hasUid.valueChanges.pipe(takeUntilDestroyed()).subscribe(hasUid => {
      if (hasUid) {
        this.form.controls.registryIds.controls.UID.enable();
      } else {
        this.form.controls.registryIds.controls.UID.disable();
      }
    });
    this.form.valueChanges.subscribe(value => {
      this.wizardService.updateOrganisationData(value as Partial<TrustOnboardingSubmissionRequest>);
    });
    effect(() => {
      const data = this.wizardService.submission();
      if (data) {
        this.form.patchValue(data, {emitEvent: false});
      }
    });
    effect(() => {
      const partner = this.partner();
      if (partner) {
        this.form.patchValue({partnerType: partner.type});
      }
    });
  }

  override async validate(): Promise<boolean> {
    const isValid = this.form.valid;

    if (!isValid) {
      this.form.markAllAsTouched();
    }

    return isValid;
  }

  ngOnInit(): void {
    this.form.controls.hasUid.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(hasUid => {
      const uidControl = this.form.get('registryIds.UID');
      if (uidControl) {
        if (hasUid === true) {
          uidControl.setValidators(Validators.required);
        } else {
          uidControl.clearValidators();
          uidControl.setValue('');
        }
        uidControl.updateValueAndValidity();
      }
    });
    this.form.controls.correspondingLanguage.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(lang => {
      this.form.controls.contactPerson.controls.correspondingLanguage.setValue(lang, {emitEvent: false});
    });
    this.businessPartnerApi
      .getBusinessPartner({
        businessPartnerId: this.wizardService.partnerId!
      })
      .subscribe({
        next: partner => {
          this.partner.set({
            id: partner.id,
            type: partner.type
          });
        }
      });
  }

  private translateSetup() {
    // Required for translate service auto collection of i18n keys
    this.translateService.get('eportal_global_country_CH');
  }
}
