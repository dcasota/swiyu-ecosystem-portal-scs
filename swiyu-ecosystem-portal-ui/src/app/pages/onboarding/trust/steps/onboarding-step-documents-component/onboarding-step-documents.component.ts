import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {
  ObButtonDirective,
  ObEUploadEventType,
  ObFileUploadComponent,
  ObIUploadEvent,
  ObUnsavedChangesDirective
} from '@oblique/oblique';
import {TrustOnboardingDocumentsApi} from '../../../../../api/generated';
import {AppConfigService} from '../../../../../core/appconfig/app-config.service';
import {TrustOnboardingWizardService} from '../../wizard/trust-onboarding-wizard.service';
import {AbstractOnboardingStepComponent} from '../abstract-onboarding-step-component';

@Component({
  selector: 'app-onboarding-step-documents',
  standalone: true,
  imports: [
    MatIcon,
    ObButtonDirective,
    ReactiveFormsModule,
    TranslatePipe,
    MatButton,
    ObFileUploadComponent,
    MatAnchor,
    ObUnsavedChangesDirective
  ],
  templateUrl: './onboarding-step-documents.component.html',
  providers: [{provide: AbstractOnboardingStepComponent, useExisting: OnboardingStepDocumentsComponent}],
  styleUrls: ['../onboarding-steps.scss', './onboarding-step-documents.component.scss']
})
export class OnboardingStepDocumentsComponent extends AbstractOnboardingStepComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly documentsApi = inject(TrustOnboardingDocumentsApi);
  protected readonly appConfigService = inject(AppConfigService);
  protected readonly wizardService = inject(TrustOnboardingWizardService);

  readonly form = this.fb.group({
    uploadedFiles: this.fb.control<string[]>([], [Validators.required, Validators.minLength(1)])
  });

  ngOnInit() {
    const submissionId = this.wizardService.submissionId;
    if (!submissionId) {
      return;
    }
    this.documentsApi
      .listAllDocumentsForTrustOnboarding({
        id: submissionId,
        size: 10, // currently there are never more than 10 documents per submission
        page: 0,
        sort: ['createdAt,desc']
      })
      .subscribe(documents => {
        if (documents.content) {
          this.form.patchValue({
            uploadedFiles: [
              ...documents.content
                .filter(doc => doc.name) // has a name
                .map(doc => doc.name)
            ]
          });
          this.form.updateValueAndValidity();
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

  uploadEvent(event: ObIUploadEvent): void {
    if (event.type === ObEUploadEventType.UPLOADED) {
      const file = event.files[0] as File;

      if (file.name && !this.form.controls.uploadedFiles.value?.includes(file.name)) {
        this.form.patchValue({uploadedFiles: [...this.form.controls.uploadedFiles.value!, file.name]});
        this.form.updateValueAndValidity();
      }
    }
  }
}
