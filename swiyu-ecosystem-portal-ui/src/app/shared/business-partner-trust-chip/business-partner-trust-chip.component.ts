import {Component, computed, input} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {BusinessPartner, BusinessPartnerListItem, BusinessPartnerTrustStatus} from '../../api/generated';

@Component({
  selector: 'app-business-partner-trust-chip',
  imports: [MatChipsModule, MatIconModule, TranslatePipe],
  templateUrl: './business-partner-trust-chip.component.html',
  styleUrl: './business-partner-trust-chip.component.scss'
})
export class BusinessPartnerTrustChipComponent {
  readonly businessPartner = input.required<BusinessPartnerListItem | BusinessPartner | undefined>();
  readonly dayDiffNowToMaxDateForTrustVerificationStatus = computed(() => {
    if (this.businessPartner()?.maxDateForTrustVerificationStatus == null) {
      return undefined;
    }
    const maxDateForTrustVerificationStatus = Date.parse(this.businessPartner()!.maxDateForTrustVerificationStatus!);
    return Math.ceil((maxDateForTrustVerificationStatus - Date.now()) / (1000 * 60 * 60 * 24));
  });
  protected readonly BusinessPartnerTrustStatus = BusinessPartnerTrustStatus;
}
