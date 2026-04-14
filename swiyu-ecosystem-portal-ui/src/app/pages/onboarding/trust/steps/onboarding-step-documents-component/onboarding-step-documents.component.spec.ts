import {provideHttpClient} from '@angular/common/http';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {ObEUploadEventType, ObIUploadEvent, ObliqueTestingModule} from '@oblique/oblique';
import {of} from 'rxjs';
import {
  PagedModelTrustOnboardingSubmissionDocumentListItem,
  TrustOnboardingDocumentsApi
} from '../../../../../api/generated';
import {TrustOnboardingWizardService} from '../../wizard/trust-onboarding-wizard.service';
import {OnboardingStepDocumentsComponent} from './onboarding-step-documents.component';

describe('OnboardingStepDocumentsComponent', () => {
  let component: OnboardingStepDocumentsComponent;
  let fixture: ComponentFixture<OnboardingStepDocumentsComponent>;
  let documentsApi: TrustOnboardingDocumentsApi;

  const MOCK_SUBMISSION_ID = 'sub-123';

  beforeEach(async () => {
    const documentsApiSpy = {
      listAllDocumentsForTrustOnboarding: jest.fn()
    };

    const wizardServiceMock = {
      submissionId: MOCK_SUBMISSION_ID,
      partnerId: 'partner-001',
      submission: jest.fn().mockReturnValue(undefined),
      submissionRequest: {},
      saveAndNext: jest.fn(),
      navigateToPreviousStep: jest.fn(),
      onSaveAndContinueLater: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        OnboardingStepDocumentsComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ObliqueTestingModule,
        TranslateModule.forRoot(),
        MatIconTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: TrustOnboardingDocumentsApi, useValue: documentsApiSpy},
        {provide: TrustOnboardingWizardService, useValue: wizardServiceMock},
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingStepDocumentsComponent);
    component = fixture.componentInstance;
    documentsApi = TestBed.inject(TrustOnboardingDocumentsApi);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not call listAllDocumentsForTrustOnboarding if submissionId is not provided', () => {
      const wizardService = TestBed.inject(TrustOnboardingWizardService);
      (wizardService as TrustOnboardingWizardService).submissionId = '';
      fixture.detectChanges();
      expect(documentsApi.listAllDocumentsForTrustOnboarding).not.toHaveBeenCalled();
    });

    it('should call listAllDocumentsForTrustOnboarding with submissionId', fakeAsync(() => {
      const mockDocuments: PagedModelTrustOnboardingSubmissionDocumentListItem = {
        content: [
          {
            id: 'some-id-1',
            name: 'doc1.pdf',
            mediaType: 'application/pdf',
            type: 'TRUST_ONBOARDING_DECLARATION_OF_INTENT',
            owningBusinessPartner: '',
            trustOnboardingSubmissionId: MOCK_SUBMISSION_ID,
            createdAt: '',
            updatedAt: '',
            submittedAt: ''
          },
          {
            id: 'some-id-2',
            name: 'doc2.pdf',
            mediaType: 'application/pdf',
            type: 'TRUST_ONBOARDING_DECLARATION_OF_INTENT',
            owningBusinessPartner: '',
            trustOnboardingSubmissionId: MOCK_SUBMISSION_ID,
            createdAt: '',
            updatedAt: '',
            submittedAt: ''
          }
        ]
      };
      (documentsApi.listAllDocumentsForTrustOnboarding as jest.Mock).mockReturnValue(of(mockDocuments));

      fixture.detectChanges();
      tick();

      expect(documentsApi.listAllDocumentsForTrustOnboarding).toHaveBeenCalledWith({
        id: MOCK_SUBMISSION_ID,
        size: 10,
        page: 0,
        sort: ['createdAt,desc']
      });
      expect(component.form.controls.uploadedFiles.value).toEqual(['doc1.pdf', 'doc2.pdf']);
    }));
  });

  describe('uploadEvent', () => {
    it('should add uploaded file name to the form', () => {
      const event: ObIUploadEvent = {
        type: ObEUploadEventType.UPLOADED,
        files: [new File([''], 'new-doc.pdf')]
      };
      component.uploadEvent(event);
      expect(component.form.controls.uploadedFiles.value).toEqual(['new-doc.pdf']);
    });

    it('should not add file name if event type is not UPLOADED', () => {
      const event: ObIUploadEvent = {
        type: ObEUploadEventType.CHOSEN,
        files: [new File([''], 'new-doc.pdf')]
      };
      component.uploadEvent(event);
      expect(component.form.controls.uploadedFiles.value).toEqual([]);
    });

    it('should not add duplicate file names from upload', () => {
      component.form.controls.uploadedFiles.setValue(['doc1.pdf']);
      const event: ObIUploadEvent = {
        type: ObEUploadEventType.UPLOADED,
        files: [new File([''], 'doc1.pdf')]
      };
      component.uploadEvent(event);
      expect(component.form.controls.uploadedFiles.value).toEqual(['doc1.pdf']);
    });
  });

  describe('form validation', () => {
    it('should be invalid if uploadedFiles is empty', () => {
      component.form.controls.uploadedFiles.setValue([]);
      expect(component.form.invalid).toBe(true);
    });

    it('should be valid if uploadedFiles has at least one file', () => {
      component.form.controls.uploadedFiles.setValue(['doc1.pdf']);
      expect(component.form.valid).toBe(true);
    });
  });
});
