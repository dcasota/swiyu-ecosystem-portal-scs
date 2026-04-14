import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {ObSelectableDirective} from '@oblique/oblique';

@Component({
  selector: 'app-radio-card',
  imports: [MatCard, MatCardContent, ObSelectableDirective],
  templateUrl: './radio-card.component.html',
  styleUrl: './radio-card.component.scss'
})
export class RadioCardComponent {
  dataCy = input.required();
  value = input.required();
  checked = input<boolean>(false);
  hasError = input<boolean>(false);
  disabled = input<boolean>(false);
  @Output() cardSelect = new EventEmitter<void>();

  onKeyBoardInteraction(event: KeyboardEvent) {
    if (this.disabled()) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.cardSelect.emit();
    }
  }
}
