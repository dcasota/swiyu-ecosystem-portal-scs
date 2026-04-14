import {TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {BusinessPartner, BusinessPartnerApi, IdentifierApi, PartnerCreationRequest} from '../../../../api/generated';
import {OrganizationService} from '../../../../api/organization.service';
import {AppRoutes} from '../../../../app.routes';
import {AppConfigService} from '../../../../core/appconfig/app-config.service';
import {AuthService} from '../../../../core/security/auth.service';
import {OauthMockRoleDialogComponent} from '../dialogs/oauth-mock-role-dialog/oauth-mock-role-dialog.component';
import {PartnerRegistrationWizardService} from './partner-registration-wizard.service';

describe('PartnerRegistrationWizardService', () => {
  let service: PartnerRegistrationWizardService;
  let paymentEnabled = false;
  let tokenRefreshEnabled = true;
  let routerNavigateMock: jest.Mock;
  let createUrlTreeMock: jest.Mock;
  let serializeUrlMock: jest.Mock;
  let registerBusinessPartnerMock: jest.Mock;
  let getAllIdentifiersOfPartnerMock: jest.Mock;
  let getBusinessPartnerMock: jest.Mock;
  let refreshTokenMock: jest.Mock;
  let startLoginFlowWithReturnUrlMock: jest.Mock;
  let dialogOpenMock: jest.Mock;

  const validPartnerRequest: PartnerCreationRequest = {
    organizationName: 'Example Org',
    addressZipCode: '3000',
    addressCity: 'Bern',
    contactPhone: '+41791234567',
    contactEmail: 'contact@example.org',
    businessPartnerType: PartnerCreationRequest.BusinessPartnerTypeEnum.Business
  };

  beforeEach(() => {
    routerNavigateMock = jest.fn();
    createUrlTreeMock = jest.fn().mockReturnValue({});
    serializeUrlMock = jest.fn().mockReturnValue('/serialized-next-url');
    registerBusinessPartnerMock = jest.fn();
    getAllIdentifiersOfPartnerMock = jest.fn();
    getBusinessPartnerMock = jest.fn();
    refreshTokenMock = jest.fn().mockReturnValue(of({}));
    startLoginFlowWithReturnUrlMock = jest.fn();
    dialogOpenMock = jest.fn().mockReturnValue({afterClosed: () => of(true)});

    TestBed.configureTestingModule({
      providers: [
        PartnerRegistrationWizardService,
        {
          provide: Router,
          useValue: {
            navigate: routerNavigateMock,
            createUrlTree: createUrlTreeMock,
            serializeUrl: serializeUrlMock
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: dialogOpenMock
          }
        },
        {
          provide: OrganizationService,
          useValue: {
            registerBusinessPartner: registerBusinessPartnerMock
          }
        },
        {
          provide: IdentifierApi,
          useValue: {
            getAllIdentifiersOfPartner: getAllIdentifiersOfPartnerMock
          }
        },
        {
          provide: BusinessPartnerApi,
          useValue: {
            getBusinessPartner: getBusinessPartnerMock
          }
        },
        {
          provide: AppConfigService,
          useValue: {
            get isFunctionalityPaymentEnabled() {
              return paymentEnabled;
            },
            get tokenRefreshEnabled() {
              return tokenRefreshEnabled;
            }
          }
        },
        {
          provide: AuthService,
          useValue: {
            refreshToken: refreshTokenMock,
            startLoginFlowWithReturnUrl: startLoginFlowWithReturnUrlMock
          }
        }
      ]
    });

    service = TestBed.inject(PartnerRegistrationWizardService);
    tokenRefreshEnabled = true;
  });

  it('navigates next from product to profile', () => {
    service.currentStepIndex = 0;
    (service as unknown as {navigateToNextStep: () => void}).navigateToNextStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingProfileCreation());
  });

  it('does not navigate next from payment when partner is missing', () => {
    paymentEnabled = true;
    service.currentStepIndex = 2;

    (service as unknown as {navigateToNextStep: () => void}).navigateToNextStep();

    expect(routerNavigateMock).not.toHaveBeenCalled();
  });

  it('when token refresh disabled opens oauth mock dialog and starts login with return url', () => {
    paymentEnabled = true;
    tokenRefreshEnabled = false;
    registerBusinessPartnerMock.mockReturnValue(of({id: 'partner-1'}));
    serializeUrlMock.mockReturnValue('/ui/onboarding/base/register/partner-1/payment');
    service.currentStepIndex = 1;

    (service as unknown as {createProfile: (request: PartnerCreationRequest) => {subscribe: () => void}})
      .createProfile(validPartnerRequest)
      .subscribe();

    expect(dialogOpenMock).toHaveBeenCalledWith(OauthMockRoleDialogComponent, {
      data: {roleValue: 'partner-1:ti_@businesspartner_#read'},
      disableClose: true
    });
    expect(startLoginFlowWithReturnUrlMock).toHaveBeenCalledWith('/ui/onboarding/base/register/partner-1/payment');
    expect(refreshTokenMock).not.toHaveBeenCalled();
    expect(getAllIdentifiersOfPartnerMock).not.toHaveBeenCalled();
    expect(routerNavigateMock).not.toHaveBeenCalled();
  });

  it('hydrateFromPartnerRoute loads partner and identifier when missing', () => {
    const bp = {id: 'p-1'} as BusinessPartner;
    getBusinessPartnerMock.mockReturnValue(of(bp));
    getAllIdentifiersOfPartnerMock.mockReturnValue(of({content: [{id: 'id-1'}]}));

    service.hydrateFromPartnerRoute('p-1');

    expect(getBusinessPartnerMock).toHaveBeenCalledWith({businessPartnerId: 'p-1'});
    expect(getAllIdentifiersOfPartnerMock).toHaveBeenCalled();
    expect(service.partner()?.id).toBe('p-1');
    expect(service.identifierEntryId()).toBe('id-1');
    expect(service.areStepsEditable()).toBe(false);
  });

  it('creates partner and navigates to payment when payment is enabled', () => {
    paymentEnabled = true;
    registerBusinessPartnerMock.mockReturnValue(of({id: 'partner-1'}));
    getAllIdentifiersOfPartnerMock.mockReturnValue(of({content: [{id: 'identifier-1'}]}));
    service.currentStepIndex = 1;

    (service as unknown as {createProfile: (request: PartnerCreationRequest) => {subscribe: () => void}})
      .createProfile(validPartnerRequest)
      .subscribe();

    expect(registerBusinessPartnerMock).toHaveBeenCalledWith(validPartnerRequest);
    expect(getAllIdentifiersOfPartnerMock).toHaveBeenCalled();
    expect(service.identifierEntryId()).toBe('identifier-1');
    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingPayment('partner-1'));
  });

  it('creates partner and navigates to handover when payment is disabled', () => {
    paymentEnabled = false;
    registerBusinessPartnerMock.mockReturnValue(of({id: 'partner-1'}));
    getAllIdentifiersOfPartnerMock.mockReturnValue(of({content: [{id: 'identifier-1'}]}));
    service.currentStepIndex = 1;

    (service as unknown as {createProfile: (request: PartnerCreationRequest) => {subscribe: () => void}})
      .createProfile(validPartnerRequest)
      .subscribe();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingHandover('partner-1'));
  });

  it('navigates next from payment to handover when payment is enabled', () => {
    paymentEnabled = true;
    service.partner.set({id: 'partner-1'} as BusinessPartner);
    service.currentStepIndex = 2;
    (service as unknown as {navigateToNextStep: () => void}).navigateToNextStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingHandover('partner-1'));
  });

  it('does not navigate next from handover when payment is disabled', () => {
    paymentEnabled = false;
    service.partner.set({id: 'partner-1'} as BusinessPartner);
    service.currentStepIndex = 2;
    (service as unknown as {navigateToNextStep: () => void}).navigateToNextStep();

    expect(routerNavigateMock).not.toHaveBeenCalled();
  });

  it('navigates previous from handover to payment when payment is enabled', () => {
    paymentEnabled = true;
    service.partner.set({id: 'partner-1'} as BusinessPartner);
    service.currentStepIndex = 3;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingPayment('partner-1'));
  });

  it('navigates previous from product to introduction', () => {
    service.currentStepIndex = 0;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingIntroduction());
  });

  it('navigates previous from profile to product selection', () => {
    service.currentStepIndex = 1;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingProductSelection());
  });

  it('navigates previous from payment to profile when payment is enabled', () => {
    paymentEnabled = true;
    service.partner.set({id: 'partner-1'} as BusinessPartner);
    service.currentStepIndex = 2;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingProfileCreation());
  });

  it('navigates previous from handover to profile when payment is disabled', () => {
    paymentEnabled = false;
    service.partner.set({id: 'partner-1'} as BusinessPartner);
    service.currentStepIndex = 2;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingProfileCreation());
  });

  it('falls back to product selection when partner is missing on previous', () => {
    paymentEnabled = true;
    service.currentStepIndex = 3;

    service.navigateToPreviousStep();

    expect(routerNavigateMock).toHaveBeenCalledWith(AppRoutes.baseOnboardingProductSelection());
  });
});
