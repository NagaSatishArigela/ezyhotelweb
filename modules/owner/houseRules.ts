export type RuleValue = "yes" | "no" | "on_request" | "not_allowed" | "designated_area";

export interface HouseRule {
  key: string;
  label: string;
  options: { value: RuleValue; label: string }[];
}

export const HOUSE_RULES: HouseRule[] = [
  {
    key: "couple_friendly",
    label: "Couple Friendly",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "on_request", label: "On Request" },
    ],
  },
  {
    key: "pet_friendly",
    label: "Pet Friendly",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "on_request", label: "On Request" },
    ],
  },
  {
    key: "party_allowed",
    label: "Party Allowed",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "on_request", label: "On Request" },
    ],
  },
  {
    key: "alcohol_allowed",
    label: "Alcohol Allowed",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_allowed", label: "Not Allowed" },
    ],
  },
  {
    key: "smoking_allowed",
    label: "Smoking Allowed",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "designated_area", label: "Designated Area" },
    ],
  },
  {
    key: "bachelor_groups",
    label: "Bachelor Groups Allowed",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "id_proof_required",
    label: "ID Proof Required at Check-in",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "outside_food",
    label: "Outside Food Allowed",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "on_request", label: "On Request" },
    ],
  },
];
