import {Component, input, InputSignal, OnInit, output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {ObAlertComponent, ObButtonDirective, ObIAlertType} from '@oblique/oblique';

@Component({
  selector: 'app-stateful-alert',
  imports: [MatIcon, MatIconButton, ObAlertComponent, ObButtonDirective, TranslateModule, MatTooltip],
  templateUrl: './stateful-alert.component.html',
  styleUrl: './stateful-alert.component.scss'
})
export class StatefulAlertComponent implements OnInit {
  static readonly DEBUG_FORCE_VISIBILITY = false;
  type = input<ObIAlertType>('info');
  storageKey: InputSignal<string> = input.required();
  visible = input(true);
  closed = output<void>();

  get isNotificationActive() {
    return (
      StatefulAlertComponent.DEBUG_FORCE_VISIBILITY ||
      (this.visible() && localStorage.getItem(this.storageKey()) === 'true')
    );
  }

  public markActive() {
    localStorage.setItem(this.storageKey(), 'true');
  }

  public markInactive() {
    localStorage.setItem(this.storageKey(), 'false');
  }

  ngOnInit(): void {
    // Set  notification to active if not already set
    if (localStorage.getItem(this.storageKey()) == null) {
      localStorage.setItem(this.storageKey(), 'true');
    }
  }

  close() {
    this.markInactive();
    this.closed.emit();
  }
}
