export interface ExplainerStep {
  title: string;
  step: string;
  hint: string;
  links: ExplainerStepLink[];
}

export interface ExplainerStepLink {
  title: string;
  url: string;
}

export enum ProofProcessType {
  dev = 'technical_proof_dev',
  self = 'technical_proof_self'
}

export const explainerStepsDev: ExplainerStep[] = [
  {
    title: 'eportal_onboardingTR_technicalProof_sendInvite_cardTitle',
    step: 'eportal_onboardingTR_technicalProof_sendInvite_cardText',
    hint: '',
    links: [
      {
        title: 'eportal_global_link_invitation',
        url: 'https://www.google.ch'
      }
    ]
  },
  {
    title: 'eportal_onboardingTR_technicalProof_handover_cardTitle',
    step: 'eportal_onboardingTR_technicalProof_handover_cardText',
    hint: '',
    links: [
      {
        title: 'eportal_global_link_TechDocumentation',
        url: 'https://www.google.ch'
      }
    ]
  },
  {
    title: 'eportal_onboardingTR_technicalProof_complete_cardTitle',
    step: 'eportal_onboardingTR_technicalProof_complete_cardText',
    hint: '',
    links: []
  }
];

export const explainerStepsSelf: ExplainerStep[] = [
  {
    title: 'eportal_onboardingTR_technicalProof_provideData_cardTitle',
    step: 'eportal_onboardingTR_technicalProof_provideData_cardText',
    hint: '',
    links: [
      {
        title: 'eportal_global_link_TechDocumentation',
        url: 'https://www.google.ch'
      }
    ]
  },
  {
    title: 'eportal_onboardingTR_technicalProof_provideData_cardTitle',
    step: 'eportal_onboardingTR_technicalProof_provideData_cardText',
    hint: 'eportal_onboardingTR_technicalProof_provideData_alert',
    links: [
      {
        title: 'eportal_global_link_DIDtoolbox',
        url: 'https://www.google.ch'
      },
      {
        title: 'eportal_global_link_TechDocumentation',
        url: ''
      }
    ]
  },
  {
    title: 'eportal_onboardingTR_technicalProof_btnSec_openOverview',
    step: 'eportal_onboardingTR_technicalProof_submitProof_cardText',
    hint: '',
    links: [
      {
        title: 'eportal_global_link_TechDocumentation',
        url: 'https://www.google.ch'
      }
    ]
  }
];
