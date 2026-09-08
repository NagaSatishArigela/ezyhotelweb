import type { RootState } from "@/store";

export const selectDraftId = (state: RootState) => state.onboarding.draftId;
export const selectCurrentStep = (state: RootState) => state.onboarding.currentStep;
export const selectCompletedSteps = (state: RootState) => state.onboarding.completedSteps;
export const selectPropertyType = (state: RootState) => state.onboarding.propertyType;
export const selectBookingPolicy = (state: RootState) => state.onboarding.bookingPolicy;
export const selectSelectedAmenities = (state: RootState) => state.onboarding.selectedAmenities;
export const selectOnboardingStatus = (state: RootState) => state.onboarding.status;
