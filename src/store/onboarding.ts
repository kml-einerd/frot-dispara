import { create } from 'zustand';

export type OnboardingStep = 'connect-whatsapp' | 'select-groups' | 'create-promo' | 'test-dispatch';

const STEPS: OnboardingStep[] = ['connect-whatsapp', 'select-groups', 'create-promo', 'test-dispatch'];
const STORAGE_KEY = 'dispara_onboarding_complete';

interface OnboardingState {
  isOpen: boolean;
  currentStep: OnboardingStep;
  // Data collected during wizard
  connectedSessionId: string | null;
  selectedGroupIds: string[];
  createdPromoId: string | null;

  // Actions
  open: () => void;
  close: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  setConnectedSession: (id: string) => void;
  setSelectedGroups: (ids: string[]) => void;
  setCreatedPromo: (id: string) => void;
  complete: () => void;
  isComplete: () => boolean;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  isOpen: false,
  currentStep: 'connect-whatsapp',
  connectedSessionId: null,
  selectedGroupIds: [],
  createdPromoId: null,

  open: () => set({ isOpen: true, currentStep: 'connect-whatsapp' }),
  close: () => set({ isOpen: false }),

  nextStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx < STEPS.length - 1) set({ currentStep: STEPS[idx + 1] });
  },

  prevStep: () => {
    const idx = STEPS.indexOf(get().currentStep);
    if (idx > 0) set({ currentStep: STEPS[idx - 1] });
  },

  goToStep: (step) => set({ currentStep: step }),

  setConnectedSession: (id) => set({ connectedSessionId: id }),
  setSelectedGroups: (ids) => set({ selectedGroupIds: ids }),
  setCreatedPromo: (id) => set({ createdPromoId: id }),

  complete: () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    set({ isOpen: false });
  },

  isComplete: () => localStorage.getItem(STORAGE_KEY) === 'true',
}));

export { STEPS };
