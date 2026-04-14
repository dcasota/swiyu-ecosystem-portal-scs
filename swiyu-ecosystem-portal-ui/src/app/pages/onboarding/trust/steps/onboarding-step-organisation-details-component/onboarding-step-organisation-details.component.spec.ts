import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {WritableSignal, signal} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {of} from 'rxjs';
import {BusinessPartnerApi, TrustOnboardingSubmission} from '../../../../../api/generated';
import {CountryService} from '../../../../../core/util/country.service';
import {TrustOnboardingWizardService} from '../../wizard/trust-onboarding-wizard.service';
import {
  OnboardingStepOrganisationDetailsComponent,
  atLeastOneRequired
} from './onboarding-step-organisation-details.component';

describe('OnboardingStepOrganisationDetailsComponent', () => {
  let component: OnboardingStepOrganisationDetailsComponent;
  let fixture: ComponentFixture<OnboardingStepOrganisationDetailsComponent>;

  beforeEach(async () => {
    const businessPartnerApiSpy = {
      getBusinessPartner: jest.fn().mockReturnValue(
        of({
          id: 'test-partner-id',
          type: 'organisation'
        })
      )
    };
    const wizardServiceMock = {
      partnerId: 'test-partner-id',
      submissionId: 'sub-123',
      submission: signal(undefined) as WritableSignal<TrustOnboardingSubmission | undefined>,
      submissionRequest: {},
      updateOrganisationData: jest.fn(),
      saveAndNext: jest.fn(),
      navigateToPreviousStep: jest.fn(),
      onSaveAndContinueLater: jest.fn()
    };
    await TestBed.configureTestingModule({
      imports: [
        OnboardingStepOrganisationDetailsComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideObliqueTestingConfiguration(),
        {provide: Window, useValue: window},
        {
          provide: BusinessPartnerApi,
          useValue: businessPartnerApiSpy
        },
        {provide: TrustOnboardingWizardService, useValue: wizardServiceMock},
        CountryService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(OnboardingStepOrganisationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.form.get('partnerType')?.value).toBe('organisation');
      expect(component.form.get('hasUid')?.value).toBe(false);
      expect(component.form.get('correspondingLanguage')?.value).toBe('EN');
      expect(component.form.get('readTermsAndConditions')?.value).toBe(false);
      expect(component.form.get('readPrivacyPolicy')?.value).toBe(false);
    });

    it('should have all required form controls', () => {
      expect(component.form.get('partnerType')).toBeTruthy();
      expect(component.form.get('hasUid')).toBeTruthy();
      expect(component.form.get('entityName')).toBeTruthy();
      expect(component.form.get('entityAddress')).toBeTruthy();
      expect(component.form.get('contactPerson')).toBeTruthy();
      expect(component.form.get('registryIds')).toBeTruthy();
      expect(component.form.get('readTermsAndConditions')).toBeTruthy();
      expect(component.form.get('readPrivacyPolicy')).toBeTruthy();
    });

    it('should initialize languages array', () => {
      expect(component.languages).toEqual(['DE', 'FR', 'IT', 'EN', 'RM']);
    });
  });

  describe('Form Validation', () => {
    it('should require partnerType', () => {
      const control = component.form.get('partnerType');
      control?.setValue(null);
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require at least one entity name language', () => {
      const entityName = component.form.get('entityName');
      expect(entityName?.hasError('atLeastOneRequired')).toBe(true);

      entityName?.get('de')?.setValue('Test Organisation');
      expect(entityName?.hasError('atLeastOneRequired')).toBe(false);
    });

    it('should require all address fields', () => {
      const address = component.form.get('entityAddress');
      expect(address?.get('street')?.hasError('required')).toBe(true);
      expect(address?.get('postalCode')?.hasError('required')).toBe(true);
      expect(address?.get('city')?.hasError('required')).toBe(true);
      expect(address?.get('country')?.hasError('required')).toBe(true);
    });

    it('should require contact person firstName, lastName, and email', () => {
      const contactPerson = component.form.get('contactPerson');
      expect(contactPerson?.get('firstName')?.hasError('required')).toBe(true);
      expect(contactPerson?.get('lastName')?.hasError('required')).toBe(true);
      expect(contactPerson?.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const email = component.form.get('contactPerson.email');
      email?.setValue('invalid-email');
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('valid@email.com');
      expect(email?.hasError('email')).toBe(false);
    });

    it('should require terms and conditions to be accepted', () => {
      const control = component.form.get('readTermsAndConditions');
      expect(control?.hasError('required')).toBe(true);

      control?.setValue(true);
      expect(control?.hasError('required')).toBe(false);
    });

    it('should require privacy policy to be accepted', () => {
      const control = component.form.get('readPrivacyPolicy');
      expect(control?.hasError('required')).toBe(true);

      control?.setValue(true);
      expect(control?.hasError('required')).toBe(false);
    });
  });

  describe('UID Validation', () => {
    it('should not require UID when hasUid is false', () => {
      component.form.get('hasUid')?.setValue(false);
      fixture.detectChanges();

      const uidControl = component.form.get('registryIds.UID');
      expect(uidControl?.hasError('required')).toBe(false);
    });

    it('should require UID when hasUid is true', () => {
      component.form.get('hasUid')?.setValue(true);
      fixture.detectChanges();

      const uidControl = component.form.get('registryIds.UID');
      expect(uidControl?.hasError('required')).toBe(true);
    });

    it('should clear UID value when hasUid is set to false', () => {
      const uidControl = component.form.get('registryIds.UID');
      uidControl?.setValue('CHE-123.456.789');

      component.form.get('hasUid')?.setValue(false);
      fixture.detectChanges();

      expect(uidControl?.value).toBe('');
    });
  });

  describe('Corresponding Language Sync', () => {
    it('should sync correspondingLanguage with contactPerson.correspondingLanguage', fakeAsync(() => {
      component.form.get('correspondingLanguage')?.setValue('DE');
      tick();
      expect(component.form.get('contactPerson.correspondingLanguage')?.value).toBe('DE');
    }));
  });

  describe('Saved Data Input', () => {
    it('should patch form values when savedData is provided', () => {
      const mockData = {
        id: 'DEAD-BEEF-000',
        version: 1,
        partnerId: '000-000',
        entityEmail: 'test@test.ch',
        isGovActor: false,
        status: TrustOnboardingSubmission.StatusEnum.Unsubmitted,
        proofOfPossessionList: [],
        registryIds: {},
        entityName: {
          de: 'Test Organisation',
          fr: 'Organisation Test',
          it: '',
          en: '',
          rm: ''
        },
        entityAddress: {
          street: 'Test Street 1',
          postalCode: '3000',
          city: 'Bern',
          country: 'CH'
        },
        contactPerson: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+41 12 345 67 89'
        }
      };

      const wizardService = TestBed.inject(TrustOnboardingWizardService);
      (wizardService as TrustOnboardingWizardService).submission.set(mockData);
      fixture.detectChanges();

      expect(component.form.get('entityName.de')?.value).toBe('Test Organisation');
      expect(component.form.get('entityAddress.street')?.value).toBe('Test Street 1');
      expect(component.form.get('contactPerson.firstName')?.value).toBe('John');
    });
  });

  describe('atLeastOneRequired Validator', () => {
    it('should return error when no controls have values', () => {
      const formGroup = new FormGroup({
        de: new FormControl(''),
        fr: new FormControl(''),
        it: new FormControl(''),
        en: new FormControl(''),
        rm: new FormControl('')
      });

      const validator = atLeastOneRequired();
      const result = validator(formGroup);

      expect(result).toEqual({atLeastOneRequired: true});
    });

    it('should return null when at least one control has a value', () => {
      const formGroup = new FormGroup({
        de: new FormControl('Test'),
        fr: new FormControl(''),
        it: new FormControl(''),
        en: new FormControl(''),
        rm: new FormControl('')
      });

      const validator = atLeastOneRequired();
      const result = validator(formGroup);

      expect(result).toBeNull();
    });
  });
});
