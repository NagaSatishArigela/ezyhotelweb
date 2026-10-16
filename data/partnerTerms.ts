// Source: Terms and Conditions - Ezyhotels.com -1.pdf supplied by the user.
// Declaration wording preserved; drafting notes and unset metadata excluded.
export type PartnerTermsBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets" | "numbered"; items: string[] };

export interface PartnerTermsSection {
  id: string;
  heading: string;
  blocks: PartnerTermsBlock[];
}

export const partnerTermsIntroduction = "By submitting a property for listing on EzyHotels.com, the Property Owner / Proprietor / Lessee / Authorized Representative / Business Partner (“Partner”, “Property Owner”, “you” or “your”) hereby declares, confirms, represents and undertakes that all information, documents, photographs, facilities, prices, availability, licences and other details submitted to EzyHotels.com are true, accurate, current and legally valid.";

export const partnerTermsSections: PartnerTermsSection[] = [
{
  "id": "section-1",
  "heading": "1. Authority to List the Property",
  "blocks": [
    {
      "type": "numbered",
      "items": [
        "I confirm that I am the lawful owner of the property or am otherwise legally authorised to operate and/or list the property for accommodation, hospitality, event or other services offered through EzyHotels.com.",
        "If I am not the legal owner, I confirm that I possess valid authority, lease, management agreement, power of attorney, authorisation letter or other lawful permission permitting me to operate and list the property.",
        "I undertake to provide documentary evidence of such authority whenever requested by EzyHotels.com or any competent government/statutory authority.",
        "I shall not list any property without the knowledge or authority of the lawful owner/operator.",
        "I shall immediately inform EzyHotels.com if my ownership, lease, management rights or authority to operate the property expires, changes, is cancelled or is disputed."
      ]
    }
  ]
},
{
  "id": "section-2",
  "heading": "2. Accuracy of Property Information",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I declare that all information submitted to EzyHotels.com, including:"
    },
    {
      "type": "bullets",
      "items": [
        "Property name",
        "Property address",
        "Contact details",
        "Owner/manager details",
        "Room types",
        "Number of rooms",
        "Room size",
        "Bed configuration",
        "Tariffs/prices",
        "Taxes",
        "Availability",
        "Amenities",
        "Facilities",
        "Check-in/check-out times",
        "Cancellation policies",
        "Photos/videos",
        "Property category",
        "Star/category claims",
        "Accessibility information",
        "Parking facilities",
        "Food and beverage facilities",
        "Swimming pool/spa/gym facilities",
        "Event/banquet facilities",
        "Other services"
      ]
    },
    {
      "type": "paragraph",
      "text": "is accurate and shall not be misleading, fraudulent, exaggerated or materially incomplete."
    }
  ]
},
{
  "id": "section-3",
  "heading": "3. Property Licences and Government Approvals",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to obtain and maintain all licences, registrations, permissions, certificates and approvals legally applicable to my property and its activities."
    },
    {
      "type": "paragraph",
      "text": "Depending upon the nature and location of the property, these may include applicable:"
    },
    {
      "type": "bullets",
      "items": [
        "Trade licence",
        "Municipal/local authority permission",
        "Building/occupancy approval",
        "Fire safety/NOC",
        "Police/local authority requirements",
        "Shops and Establishments registration",
        "Tourism/hotel registration",
        "FSSAI licence/registration, where food services are provided",
        "Liquor licence, where applicable",
        "GST registration, where legally applicable",
        "Pollution/environmental permissions, where applicable",
        "Lift/electrical safety approvals, where applicable",
        "Swimming pool permissions/safety requirements, where applicable",
        "Labour-related registrations",
        "Music/copyright/public performance permissions, where applicable",
        "Any state-specific accommodation/homestay/guest-house requirements",
        "Any other licence or permission required by Central, State or local law."
      ]
    },
    {
      "type": "paragraph",
      "text": "I shall not represent that a licence or approval exists when it does not."
    }
  ]
},
{
  "id": "section-4",
  "heading": "4. Compliance with Applicable Indian Laws",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I agree to comply with all applicable Central, State and local laws, rules, regulations, notifications, orders and directions applicable to my property and business."
    },
    {
      "type": "paragraph",
      "text": "This undertaking includes compliance with applicable laws relating to:"
    },
    {
      "type": "bullets",
      "items": [
        "Hospitality and accommodation",
        "Consumer protection",
        "Taxation",
        "GST",
        "Income tax",
        "Labour and employment",
        "Fire and building safety",
        "Food safety",
        "Public health",
        "Environmental requirements",
        "Privacy and personal data",
        "Information technology",
        "Cybersecurity",
        "Foreign guests",
        "Prevention of fraud and unlawful activities",
        "Protection of women and children",
        "Accessibility and public safety",
        "Local municipal requirements."
      ]
    },
    {
      "type": "paragraph",
      "text": "The Consumer Protection Act, 2019 applies to consumer protection and specifically addresses misleading advertisements and consumer disputes."
    }
  ]
},
{
  "id": "section-5",
  "heading": "5. Guest Safety",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I acknowledge that I am responsible for maintaining the property in a reasonably safe, hygienic and lawful condition."
    },
    {
      "type": "paragraph",
      "text": "I undertake to:"
    },
    {
      "type": "numbered",
      "items": [
        "Maintain appropriate fire and emergency safety arrangements.",
        "Maintain safe electrical, structural and common-area conditions.",
        "Provide appropriate emergency exits where required.",
        "Maintain required fire extinguishers/fire equipment where applicable.",
        "Ensure that rooms and facilities advertised to customers are reasonably fit for their intended use.",
        "Promptly address known safety hazards.",
        "Comply with applicable health, sanitation and hygiene requirements.",
        "Inform EzyHotels.com of any material safety issue that may affect guests."
      ]
    }
  ]
},
{
  "id": "section-6",
  "heading": "6. Guest Identification and Records",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall comply with applicable laws and government requirements concerning:"
    },
    {
      "type": "bullets",
      "items": [
        "Guest identification",
        "Guest registers",
        "Verification of identity",
        "Record maintenance",
        "Police reporting",
        "Foreign guest reporting",
        "Government inspection",
        "Preservation and production of records where legally required."
      ]
    }
  ]
},
{
  "id": "section-7",
  "heading": "7. Foreign Guests",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Where foreign nationals are accommodated, I shall comply with the applicable immigration and foreigner-registration requirements in force at the relevant time, including prescribed reporting/record-keeping requirements and any electronic or physical forms required by the competent authority."
    },
    {
      "type": "paragraph",
      "text": "The Immigration and Foreigners Act, 2025 is currently in force from 1 September 2025 and provides the current statutory framework concerning foreigners, including visa and registration matters."
    }
  ]
},
{
  "id": "section-8",
  "heading": "8. GST and Tax Compliance",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to comply with all applicable GST and direct-tax requirements relating to my property and business."
    },
    {
      "type": "paragraph",
      "text": "Where applicable, I shall:"
    },
    {
      "type": "bullets",
      "items": [
        "Provide correct GSTIN details.",
        "Maintain valid GST registration.",
        "Charge GST only as legally permitted.",
        "Issue appropriate invoices/tax documents.",
        "Maintain proper books and records.",
        "File applicable GST returns.",
        "Pay applicable taxes within prescribed timelines.",
        "Provide accurate tax information to EzyHotels.com.",
        "Cooperate with applicable TDS/TCS or other statutory deductions where legally required."
      ]
    },
    {
      "type": "paragraph",
      "text": "Hotel accommodation and related services are subject to GST classification and applicable rates under the GST framework. Current CBIC material provides the applicable treatment for accommodation services."
    }
  ]
},
{
  "id": "section-9",
  "heading": "9. Pricing and Tax Transparency",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I confirm that the prices/tariffs submitted to EzyHotels.com are genuine and authorised by me."
    },
    {
      "type": "paragraph",
      "text": "I shall not:"
    },
    {
      "type": "bullets",
      "items": [
        "Artificially increase prices after receiving a booking.",
        "Add undisclosed mandatory charges.",
        "Misrepresent taxes.",
        "Advertise a price that cannot actually be honoured, except where the terms clearly disclose lawful conditions.",
        "Refuse a confirmed booking merely because the property wishes to obtain a higher price from another customer."
      ]
    },
    {
      "type": "paragraph",
      "text": "Any applicable taxes, fees, deposits or mandatory charges must be properly disclosed in accordance with applicable law and the EzyHotels.com platform policies."
    }
  ]
},
{
  "id": "section-10",
  "heading": "10. Room Availability and Inventory",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to maintain accurate inventory on EzyHotels.com."
    },
    {
      "type": "paragraph",
      "text": "I shall:"
    },
    {
      "type": "bullets",
      "items": [
        "Keep availability updated.",
        "Honour confirmed bookings subject to the agreed booking terms.",
        "Immediately update inventory when a room becomes unavailable.",
        "Avoid double-booking.",
        "Inform EzyHotels.com promptly of unavoidable operational issues.",
        "Not intentionally accept overlapping bookings for the same room."
      ]
    }
  ]
},
{
  "id": "section-11",
  "heading": "11. Booking Acceptance",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Once a booking is confirmed in accordance with EzyHotels.com procedures, I shall provide the accommodation/service substantially in accordance with the booking details."
    },
    {
      "type": "paragraph",
      "text": "Any refusal, cancellation, relocation or modification shall be handled in accordance with the applicable EzyHotels.com Partner Terms, Booking Policy and Cancellation Policy."
    }
  ]
},
{
  "id": "section-12",
  "heading": "12. No False or Misleading Representation",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall not upload or publish:"
    },
    {
      "type": "bullets",
      "items": [
        "Fake photographs",
        "Fake reviews",
        "Fake ratings",
        "False star classifications",
        "False awards",
        "False certifications",
        "False amenities",
        "Misleading room descriptions",
        "Misleading location information",
        "Misleading pricing",
        "Misleading promotional claims."
      ]
    },
    {
      "type": "paragraph",
      "text": "The Information Technology Act, 2000 provides the statutory framework for electronic commerce and electronic communications, while consumer-protection law addresses misleading representations and advertisements."
    }
  ]
},
{
  "id": "section-13",
  "heading": "13. Photographs, Videos and Intellectual Property",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I declare that I have the necessary rights or permissions to upload photographs, videos, logos, descriptions and other materials supplied to EzyHotels.com."
    },
    {
      "type": "paragraph",
      "text": "I shall not upload material that:"
    },
    {
      "type": "bullets",
      "items": [
        "Infringes copyright",
        "Infringes trademark rights",
        "Violates privacy rights",
        "Contains unauthorised personal photographs",
        "Misappropriates another property's branding",
        "Violates any applicable law."
      ]
    },
    {
      "type": "paragraph",
      "text": "I grant EzyHotels.com a non-exclusive right to use the submitted property information, photographs and promotional material for listing, marketing, booking and operating the EzyHotels.com platform, subject to the applicable Partner Terms."
    }
  ]
},
{
  "id": "section-14",
  "heading": "14. Personal Data and Privacy",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall collect, use, store and share guest/customer personal information only for lawful purposes and in accordance with applicable privacy/data-protection requirements."
    },
    {
      "type": "paragraph",
      "text": "I shall take reasonable measures to prevent unauthorised access, disclosure, loss, misuse or alteration of guest information."
    },
    {
      "type": "paragraph",
      "text": "The Digital Personal Data Protection Act, 2023 provides India's statutory framework for processing digital personal data, and the Digital Personal Data Protection Rules, 2025 were notified on 13 November 2025 with phased commencement provisions."
    }
  ]
},
{
  "id": "section-15",
  "heading": "15. Prohibited Activities",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall not knowingly use the property, EzyHotels.com platform or booking system for any unlawful purpose, including activities involving:"
    },
    {
      "type": "bullets",
      "items": [
        "Fraud",
        "Forgery",
        "Money laundering",
        "Unlawful gambling",
        "Human trafficking",
        "Exploitation",
        "Child sexual abuse or exploitation",
        "Unlawful prostitution/sexual exploitation",
        "Narcotics/drug-related offences",
        "Terrorist or extremist activities",
        "Storage or use of prohibited weapons",
        "Cybercrime",
        "Any other criminal or unlawful activity."
      ]
    },
    {
      "type": "paragraph",
      "text": "The Bharatiya Nyaya Sanhita, 2023 is India's current principal criminal code and came into force on 1 July 2024."
    }
  ]
},
{
  "id": "section-16",
  "heading": "16. Protection of Children",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to comply with all applicable laws concerning the protection of children."
    },
    {
      "type": "paragraph",
      "text": "I shall not permit the property to be used for any unlawful activity involving children."
    },
    {
      "type": "paragraph",
      "text": "Where identification, age verification or other safeguards are legally required, I shall follow the applicable requirements."
    }
  ]
},
{
  "id": "section-17",
  "heading": "17. Non-Discrimination and Guest Conduct",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall provide accommodation/services in accordance with applicable law and the property's disclosed policies."
    },
    {
      "type": "paragraph",
      "text": "I may refuse or terminate accommodation only on lawful grounds and in accordance with applicable law, safety requirements, property rules and booking terms."
    },
    {
      "type": "paragraph",
      "text": "I shall not engage in unlawful discrimination or harassment."
    }
  ]
},
{
  "id": "section-18",
  "heading": "18. Cleanliness and Hygiene",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to maintain:"
    },
    {
      "type": "bullets",
      "items": [
        "Reasonable cleanliness of rooms",
        "Clean bedding/linen",
        "Sanitary washrooms",
        "Safe drinking water where advertised",
        "Hygienic common areas",
        "Appropriate waste disposal",
        "Food hygiene where food is provided",
        "Pest-control measures where reasonably required."
      ]
    }
  ]
},
{
  "id": "section-19",
  "heading": "19. Food Services",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Where food or beverages are provided, I undertake to comply with applicable food-safety and licensing requirements, including applicable FSSAI requirements."
    },
    {
      "type": "paragraph",
      "text": "I shall not provide food or beverages in violation of applicable food-safety laws."
    }
  ]
},
{
  "id": "section-20",
  "heading": "20. Alcohol and Regulated Products",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Where alcohol or any regulated product/service is offered, I undertake to obtain and maintain every licence/permission legally required by the applicable State/local authority."
    },
    {
      "type": "paragraph",
      "text": "I shall not represent that EzyHotels.com authorises an activity that is prohibited or unlicensed."
    }
  ]
},
{
  "id": "section-21",
  "heading": "21. Banquet Hall / Event Property",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Where a property is listed as a banquet hall, event venue, wedding venue, farmhouse, convention facility or similar premises, I confirm that the property is legally permitted to provide the advertised services."
    },
    {
      "type": "paragraph",
      "text": "I shall comply with applicable requirements concerning:"
    },
    {
      "type": "bullets",
      "items": [
        "Fire safety",
        "Occupancy limits",
        "Noise restrictions",
        "Parking",
        "Food safety",
        "Liquor licensing",
        "Public safety",
        "Music/copyright permissions",
        "Local authority permissions",
        "Event-specific permissions."
      ]
    }
  ]
},
{
  "id": "section-22",
  "heading": "22. Fire, Emergency and Disaster Compliance",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall comply with applicable fire-safety and emergency requirements and shall not knowingly exceed legally permitted occupancy limits."
    },
    {
      "type": "paragraph",
      "text": "Where an emergency, fire, structural issue, government closure order or other serious safety issue affects the property, I shall promptly notify EzyHotels.com where such issue may affect existing or future bookings."
    }
  ]
},
{
  "id": "section-23",
  "heading": "23. Property Disputes and Legal Proceedings",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall disclose to EzyHotels.com any material legal dispute, government order, closure order, licence cancellation, attachment, sealing order or other legal restriction that materially affects my ability to provide the listed accommodation/services."
    }
  ]
},
{
  "id": "section-24",
  "heading": "24. No Unauthorised Subletting or Listing",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I shall not list a property where I have no legal right to operate it."
    },
    {
      "type": "paragraph",
      "text": "Where the property is leased, managed or operated under another person's ownership, I shall obtain and maintain the necessary contractual permission."
    }
  ]
},
{
  "id": "section-25",
  "heading": "25. Booking Cancellation and Relocation",
  "blocks": [
    {
      "type": "paragraph",
      "text": "If I cannot honour a confirmed booking due to circumstances attributable to me, I shall immediately inform EzyHotels.com and cooperate with its applicable cancellation/relocation/refund procedure."
    },
    {
      "type": "paragraph",
      "text": "I acknowledge that additional consequences may apply under the EzyHotels.com Partner Terms and Commission/Settlement Schedule."
    }
  ]
},
{
  "id": "section-26",
  "heading": "26. Guest Complaints",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I undertake to reasonably cooperate with EzyHotels.com in resolving guest complaints relating to:"
    },
    {
      "type": "bullets",
      "items": [
        "Room condition",
        "Cleanliness",
        "Safety",
        "Misrepresentation",
        "Booking availability",
        "Property facilities",
        "Service quality",
        "Overcharging",
        "Unauthorised charges",
        "Staff conduct."
      ]
    },
    {
      "type": "paragraph",
      "text": "Nothing in this declaration is intended to remove any consumer rights available under applicable Indian law. The Consumer Protection Act, 2019 provides statutory consumer protection and dispute-redressal mechanisms."
    }
  ]
},
{
  "id": "section-27",
  "heading": "27. Inspection and Verification",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I authorise EzyHotels.com, subject to applicable law and reasonable procedures, to verify information supplied by me for the purpose of onboarding and maintaining the property listing."
    },
    {
      "type": "paragraph",
      "text": "EzyHotels.com may request updated:"
    },
    {
      "type": "bullets",
      "items": [
        "KYC documents",
        "Property documents",
        "Licences",
        "Certificates",
        "Tax details",
        "Bank details",
        "Photographs",
        "Other compliance information."
      ]
    }
  ]
},
{
  "id": "section-28",
  "heading": "28. Right to Suspend or Remove Listing",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I acknowledge that EzyHotels.com may suspend, restrict, delist or terminate a property listing in accordance with the Partner Terms where there is, among other things:"
    },
    {
      "type": "bullets",
      "items": [
        "False information",
        "Fraudulent documentation",
        "Repeated booking failures",
        "Material guest-safety concerns",
        "Illegal activity",
        "Expired/cancelled licences",
        "Material breach of Partner Terms",
        "Non-payment/settlement issues",
        "Regulatory requirements",
        "Government order",
        "Risk to customers or the EzyHotels.com platform."
      ]
    },
    {
      "type": "paragraph",
      "text": "Where appropriate, EzyHotels.com may request clarification or supporting documents before taking action."
    }
  ]
},
{
  "id": "section-29",
  "heading": "29. Indemnification",
  "blocks": [
    {
      "type": "paragraph",
      "text": "To the extent permitted by applicable law, I agree to indemnify and hold harmless EzyHotels.com, its owners, directors, employees, officers and authorised representatives against losses, claims, penalties, liabilities, costs and expenses arising from:"
    },
    {
      "type": "bullets",
      "items": [
        "My unlawful conduct;",
        "False information supplied by me;",
        "Invalid or forged documents;",
        "Lack of required licences;",
        "Violation of applicable law;",
        "Property-related negligence;",
        "Guest injury caused by matters under my responsibility;",
        "Tax non-compliance attributable to me;",
        "Intellectual-property infringement by materials supplied by me;",
        "Violation of third-party rights;",
        "Breach of this declaration or the Partner Terms."
      ]
    }
  ]
},
{
  "id": "section-30",
  "heading": "30. No Guarantee of Bookings",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I understand that listing a property on EzyHotels.com does not guarantee any minimum number of bookings, revenue, occupancy or income unless expressly agreed in a separate written agreement."
    }
  ]
},
{
  "id": "section-31",
  "heading": "31. Independent Business Relationship",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Unless expressly stated otherwise in a written agreement, I acknowledge that I remain responsible for operating my property, employees, agents, contractors, licences, taxes, statutory compliance and guest services."
    },
    {
      "type": "paragraph",
      "text": "Listing the property on EzyHotels.com does not by itself create an employment relationship, partnership, joint venture, franchise or agency relationship between EzyHotels.com and the Property Owner."
    }
  ]
},
{
  "id": "section-32",
  "heading": "32. Bank and Settlement Information",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I confirm that the bank account and payout information provided to EzyHotels.com belongs to me/the registered business or is otherwise lawfully authorised for receiving settlement amounts."
    },
    {
      "type": "paragraph",
      "text": "I shall immediately notify EzyHotels.com of any change in bank account or payout information."
    }
  ]
},
{
  "id": "section-33",
  "heading": "33. Tax Deduction / Statutory Withholding",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I acknowledge that EzyHotels.com may be required to deduct or withhold applicable taxes from payments/settlements in accordance with the Income-tax Act, applicable rules and other statutory requirements."
    },
    {
      "type": "paragraph",
      "text": "Any applicable TDS/TCS or other statutory deduction shall be handled in accordance with the law applicable at the relevant time."
    }
  ]
},
{
  "id": "section-34",
  "heading": "34. Electronic Acceptance",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I acknowledge that accepting this declaration electronically, including by ticking the checkbox and clicking “Continue”, “Submit”, “Accept” or a similar electronic confirmation, constitutes my electronic acceptance of this declaration and the applicable EzyHotels.com Partner Terms."
    },
    {
      "type": "paragraph",
      "text": "The Information Technology Act, 2000 provides legal recognition to electronic commerce and electronic communications."
    }
  ]
},
{
  "id": "section-35",
  "heading": "35. Changes in Law",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I acknowledge that laws, rules, tax rates, government procedures, licences and regulatory requirements may change."
    },
    {
      "type": "paragraph",
      "text": "I agree to comply with the applicable legal requirements in force from time to time."
    }
  ]
},
{
  "id": "section-36",
  "heading": "36. Continuing Obligation",
  "blocks": [
    {
      "type": "paragraph",
      "text": "My obligations under this declaration shall continue throughout the period during which my property remains listed on EzyHotels.com and, where applicable, for obligations relating to bookings, payments, records, taxes, disputes and legal compliance arising from the listing period."
    }
  ]
},
{
  "id": "section-37",
  "heading": "37. Governing Law",
  "blocks": [
    {
      "type": "paragraph",
      "text": "This declaration and the relationship between EzyHotels.com and the Property Owner shall be governed by the laws applicable in India, subject to the dispute-resolution, jurisdiction and other provisions contained in the applicable EzyHotels.com Partner Terms."
    }
  ]
},
{
  "id": "section-38",
  "heading": "38. Final Declaration",
  "blocks": [
    {
      "type": "paragraph",
      "text": "I hereby declare that: “I have read and understood this Property Listing Legal Declaration and Compliance Undertaking. I confirm that I have the legal authority to list and operate this property and that all information and documents submitted by me to EzyHotels.com are true, accurate, complete and valid to the best of my knowledge and belief. I undertake to comply with all applicable Central, State and local laws, licences, regulations, tax requirements, safety requirements, consumer-protection requirements, data-protection requirements and foreign-guest reporting requirements applicable to my property. I understand that providing false information, fraudulent documents or unlawful services may result in suspension/removal of my property listing and may also expose me to civil, regulatory or criminal consequences under applicable law.”"
    }
  ]
},
];
