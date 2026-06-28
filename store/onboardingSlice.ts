import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PropertyType = "hotel" | "resort" | "homestay" | "villa" | "pg" | "farm" | "banquet" | "other";
export type BookingPolicy = "hourly" | "fullday" | "both";
// Mirrors PropertyStatus in quicknestserver's prisma/schema.prisma
export type OnboardingStatus = "draft" | "pending_review" | "needs_revision" | "approved" | "rejected" | "suspended";

interface OnboardingState {
  draftId: string | null;
  currentStep: number;
  completedSteps: number[];
  propertyType: PropertyType | null;
  bookingPolicy: BookingPolicy | null;
  selectedAmenities: string[];
  status: OnboardingStatus;
  submissionRef: string | null;
}

const initialState: OnboardingState = {
  draftId: null,
  currentStep: 1,
  completedSteps: [],
  propertyType: null,
  bookingPolicy: null,
  selectedAmenities: [],
  status: "draft",
  submissionRef: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setDraftId(state, action: PayloadAction<string>) {
      state.draftId = action.payload;
    },
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    completeStep(state, action: PayloadAction<number>) {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
      state.currentStep = action.payload + 1;
    },
    setPropertyType(state, action: PayloadAction<PropertyType>) {
      state.propertyType = action.payload;
    },
    setBookingPolicy(state, action: PayloadAction<BookingPolicy>) {
      state.bookingPolicy = action.payload;
    },
    setSelectedAmenities(state, action: PayloadAction<string[]>) {
      state.selectedAmenities = action.payload;
    },
    setStatus(state, action: PayloadAction<OnboardingStatus>) {
      state.status = action.payload;
    },
    setSubmissionRef(state, action: PayloadAction<string>) {
      state.submissionRef = action.payload;
    },
    resetOnboarding() {
      return initialState;
    },
    rehydrateOnboarding(state, action: PayloadAction<Partial<OnboardingState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setDraftId, setCurrentStep, completeStep,
  setPropertyType, setBookingPolicy, setSelectedAmenities,
  setStatus, setSubmissionRef, resetOnboarding, rehydrateOnboarding,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
