export abstract class AbstractOnboardingStepComponent {
  abstract validate(): Promise<boolean>;
}
