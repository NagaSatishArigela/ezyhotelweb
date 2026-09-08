// Owner onboarding helpers that are not yet backed by quicknestserver.
// Wizard step CRUD (createDraft/saveStep/submit/getStatus/revise) is wired
// to the real Properties API via `propertiesApi` in `@/lib/api`.
// These remaining functions simulate network latency and stand in for
// pipelines that land in later modules (file upload, GSTIN/IFSC lookups).

const delay = (ms = 400): Promise<void> => new Promise<void>((r) => setTimeout(r, ms));

export const ownerApi = {
  getPincode: async (pincode: string) => {
    await delay(500);
    const mockData: Record<string, { city: string; state: string }> = {
      "110001": { city: "New Delhi", state: "Delhi" },
      "400001": { city: "Mumbai", state: "Maharashtra" },
      "560001": { city: "Bangalore", state: "Karnataka" },
      "600001": { city: "Chennai", state: "Tamil Nadu" },
      "500001": { city: "Hyderabad", state: "Telangana" },
    };
    return mockData[pincode] ?? { city: "", state: "", error: "Pincode not found" };
  },

  uploadPhoto: async (_file: File) => {
    await delay(800);
    return { url: `https://picsum.photos/800/600?random=${Math.random()}`, success: true };
  },

  // Stands in for a presigned-upload flow — returns a placeholder URL so
  // step 5's `documents` array can be populated end-to-end.
  uploadDocument: async (_file: File) => {
    await delay(800);
    return { url: `https://picsum.photos/seed/${Math.random()}/600/400`, success: true };
  },

  validateGstin: async (gstin: string) => {
    await delay(600);
    if (gstin.length !== 15) return { valid: false, error: "GSTIN must be 15 characters" };
    return { valid: true, legalName: "Mock Business Pvt Ltd", status: "Active", stateCode: gstin.substring(0, 2) };
  },

  validateIfsc: async (ifsc: string) => {
    await delay(500);
    if (ifsc.length !== 11) return { valid: false };
    return { valid: true, bankName: "Mock Bank of India", branch: "Main Branch" };
  },
};
