export type ItemType = "lost" | "found";

export type MockItem = {
  id: string;
  reference: string;
  type: ItemType;
  name: string;
  category: string;
  brand?: string;
  colour?: string;
  description: string;
  privateDetails?: string;
  location: string;
  date: string;
  status: "active" | "matched" | "under_verification" | "recovered" | "disputed" | "archived";
  reporter: string;
  reporterStudentId?: string;
  matchScore?: number;
};

export const categories = [
  "Electronics",
  "ID & Documents",
  "Bags",
  "Keys",
  "Clothing",
  "Books",
  "Accessories",
  "Other",
];

export const locations = [
  "Balme Library",
  "N Block",
  "JQB Lecture Halls",
  "Legon Hall",
  "Commonwealth Hall",
  "Volta Hall",
  "Night Market",
  "Sports Stadium",
  "Business School",
];

export const items: MockItem[] = [
  {
    id: "1",
    reference: "LF-2026-000118",
    type: "found",
    name: "Black Student ID Card",
    category: "ID & Documents",
    colour: "Black",
    description:
      "Found a University of Ghana student ID card on a reading desk. Held safely pending verification.",
    privateDetails: "Student ID No: 10928471, Department of Computer Science",
    location: "Balme Library",
    date: "2026-08-15",
    status: "active",
    reporter: "Kwame Osei",
    reporterStudentId: "10884920",
    matchScore: 92,
  },
  {
    id: "2",
    reference: "LF-2026-000117",
    type: "lost",
    name: "HP Laptop Charger",
    category: "Electronics",
    brand: "HP",
    colour: "Black",
    description:
      "Left my laptop charger in a lecture hall after an afternoon class. Cable has a small blue electrical tape band around it.",
    privateDetails:
      "Tape is wrapped 3 inches from the AC brick connection point. 65W Blue-tip connector.",
    location: "JQB Lecture Halls",
    date: "2026-08-14",
    status: "matched",
    reporter: "Ama Danso",
    reporterStudentId: "10938201",
    matchScore: 78,
  },
  {
    id: "3",
    reference: "LF-2026-000116",
    type: "found",
    name: "Blue Backpack",
    category: "Bags",
    colour: "Blue",
    description: "Blue backpack found near the shuttle stop. Contents recorded privately.",
    privateDetails:
      "Inside: 2 spiral notebooks, 1 blue pencil pouch, a green water bottle with 'UG Volleyball' sticker.",
    location: "Night Market",
    date: "2026-08-13",
    status: "under_verification",
    reporter: "Verified University User",
    reporterStudentId: "10893012",
  },
  {
    id: "4",
    reference: "LF-2026-000115",
    type: "lost",
    name: "Silver Wristwatch",
    category: "Accessories",
    colour: "Silver",
    description: "Lost during a football match at the stadium. Has a distinctive leather strap.",
    privateDetails: "Engraved on back case: 'To K.A. - 2024'. Casio Edifice model.",
    location: "Sports Stadium",
    date: "2026-08-11",
    status: "active",
    reporter: "Kofi Annan",
    reporterStudentId: "10901294",
  },
  {
    id: "5",
    reference: "LF-2026-000114",
    type: "found",
    name: "Bunch of Keys",
    category: "Keys",
    description: "Three keys on a ring with a small tag, found in a hall corridor.",
    privateDetails:
      "One Brass Yale key, one silver door key, one small padlock key, red key fob with 'Room 42'.",
    location: "Legon Hall",
    date: "2026-08-10",
    status: "recovered",
    reporter: "Verified University User",
    reporterStudentId: "10874921",
  },
  {
    id: "6",
    reference: "LF-2026-000113",
    type: "lost",
    name: "Samsung Galaxy A34",
    category: "Electronics",
    brand: "Samsung",
    colour: "Graphite",
    description: "Phone misplaced between the library and N Block. Screen has a protector.",
    privateDetails:
      "IMEI: 358920194820193. Clear case with a photo card of Legon Tower inside back cover.",
    location: "N Block",
    date: "2026-08-09",
    status: "disputed",
    reporter: "Nana Yeboah",
    reporterStudentId: "10940192",
    matchScore: 64,
  },
];

export const statusLabels: Record<MockItem["status"], string> = {
  active: "Active",
  matched: "Potential match",
  under_verification: "Under verification",
  recovered: "Recovered",
  disputed: "Disputed",
  archived: "Archived",
};

export const stats = [
  { label: "Items reported", value: "1,284" },
  { label: "Successfully returned", value: "913" },
  { label: "Active listings", value: "146" },
  { label: "Return rate", value: "71%" },
];

export type VerificationQuestion = {
  id: string;
  question: string;
};

export const verificationQuestions: VerificationQuestion[] = [
  { id: "q1", question: "Describe any unique mark, sticker or damage on the item." },
  { id: "q2", question: "What colour is the item and are there any secondary colours?" },
  { id: "q3", question: "List anything that was inside or attached to the item." },
  { id: "q4", question: "If applicable, give the serial number or IMEI (or the last 4 digits)." },
];

export type ClaimRecord = {
  id: string;
  reference: string;
  itemName: string;
  submitted: string;
  status:
    | "under_review"
    | "verification_pending"
    | "evidence_requested"
    | "approved"
    | "rejected"
    | "disputed";
  handoverCode?: string;
};

export const myClaims: ClaimRecord[] = [
  {
    id: "c1",
    reference: "CLM-2026-000042",
    itemName: "Black Student ID Card",
    submitted: "2026-08-16",
    status: "approved",
    handoverCode: "UG-LF-48213",
  },
  {
    id: "c2",
    reference: "CLM-2026-000039",
    itemName: "Blue Backpack",
    submitted: "2026-08-14",
    status: "under_review",
  },
];

export const claimStatusLabels: Record<ClaimRecord["status"], string> = {
  under_review: "Under review",
  verification_pending: "Awaiting your answers",
  evidence_requested: "Evidence requested",
  approved: "Approved — collect item",
  rejected: "Not approved",
  disputed: "Disputed",
};

export type NotificationRecord = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  kind: "match" | "claim" | "handover" | "admin";
};

export const notifications: NotificationRecord[] = [
  {
    id: "n1",
    kind: "match",
    title: "Possible match found (92%)",
    body: "A found Student ID Card at Balme Library closely matches your lost report.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "claim",
    title: "Claim CLM-2026-000042 approved",
    body: "Collect your item at the Balme Library help desk with code UG-LF-48213.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "n3",
    kind: "handover",
    title: "Handover scheduled",
    body: "Your handover is scheduled for Thursday, 10:00 at the Student Affairs office.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "n4",
    kind: "admin",
    title: "Report received",
    body: "Thanks for flagging a suspicious claim — a moderator is reviewing it.",
    time: "4 days ago",
    unread: false,
  },
];

/* ══════════════════════════════════════════════════════════
   ADMIN DATA MODELS & INITIAL STATE
   ══════════════════════════════════════════════════════════ */

export type VerificationScoreBreakdown = {
  identity: number; // max 20
  description: number; // max 20
  uniqueFeature: number; // max 20
  serialNumber: number; // max 20
  evidence: number; // max 10
  consistency: number; // max 10
};

export type ClaimAnswerResponse = {
  question: string;
  answer: string;
  expectedAnswer: string;
  match: boolean;
  score: number;
};

export type ClaimEvidenceFile = {
  id: string;
  type: string;
  name: string;
  url: string;
  note: string;
  status: "pending" | "verified" | "rejected";
};

export type AdminClaim = {
  id: string;
  reference: string;
  itemId: string;
  itemReference: string;
  itemName: string;
  itemCategory: string;
  itemLocation: string;
  claimantId: string;
  claimantName: string;
  claimantStudentId: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantHall: string;
  claimantProgramme: string;
  submittedAt: string;
  status: "under_review" | "evidence_requested" | "approved" | "rejected" | "disputed";
  verificationScore: number;
  scoreBreakdown: VerificationScoreBreakdown;
  responses: ClaimAnswerResponse[];
  evidenceFiles: ClaimEvidenceFile[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  disputeClaimants?: Array<{
    claimantName: string;
    studentId: string;
    submittedAt: string;
    score: number;
  }>;
};

export type AdminUser = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  hall: string;
  programme: string;
  level: string;
  role: "student" | "admin";
  verificationStatus: "verified" | "pending" | "unverified";
  accountStatus: "active" | "suspended";
  joinedDate: string;
  reportsCount: number;
  claimsCount: number;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: "claim" | "item" | "user" | "handover" | "system" | "evidence";
  entityId: string;
  details: string;
  ipAddress: string;
};

export type HandoverRecord = {
  id: string;
  claimReference: string;
  itemName: string;
  ownerName: string;
  finderName: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  verificationCode: string;
  finderConfirmed: boolean;
  ownerConfirmed: boolean;
  status: "scheduled" | "completed" | "cancelled";
};

export const initialAdminClaims: AdminClaim[] = [
  {
    id: "ac1",
    reference: "CLM-2026-000042",
    itemId: "1",
    itemReference: "LF-2026-000118",
    itemName: "Black Student ID Card",
    itemCategory: "ID & Documents",
    itemLocation: "Balme Library",
    claimantId: "u1",
    claimantName: "Emmanuel Kwakye",
    claimantStudentId: "10928471",
    claimantEmail: "e.kwakye@st.ug.edu.gh",
    claimantPhone: "+233 24 819 4012",
    claimantHall: "Legon Hall",
    claimantProgramme: "BSc. Computer Science",
    submittedAt: "2026-08-16 14:32",
    status: "approved",
    verificationScore: 95,
    scoreBreakdown: {
      identity: 20,
      description: 20,
      uniqueFeature: 20,
      serialNumber: 20,
      evidence: 8,
      consistency: 7,
    },
    responses: [
      {
        question: "What is your Student ID number as shown on the front?",
        answer: "10928471",
        expectedAnswer: "10928471",
        match: true,
        score: 20,
      },
      {
        question: "What department or programme is listed on the card?",
        answer: "Department of Computer Science",
        expectedAnswer: "Department of Computer Science",
        match: true,
        score: 20,
      },
      {
        question: "Describe any sticker or protective sleeve attached to the ID card.",
        answer: "Transparent hard plastic holder with a black UG neck lanyard",
        expectedAnswer: "Clear plastic casing with black lanyard",
        match: true,
        score: 18,
      },
    ],
    evidenceFiles: [
      {
        id: "ev1",
        type: "Student ID Photo",
        name: "ug_id_scan.pdf",
        url: "#",
        note: "Official university registration printout with matching ID number 10928471",
        status: "verified",
      },
    ],
    reviewNotes:
      "Identity verified against university database record. Handover code UG-LF-48213 issued.",
    reviewedBy: "Admin Moderation Desk",
    reviewedAt: "2026-08-16 16:10",
  },
  {
    id: "ac2",
    reference: "CLM-2026-000045",
    itemId: "3",
    itemReference: "LF-2026-000116",
    itemName: "Blue Backpack",
    itemCategory: "Bags",
    itemLocation: "Night Market",
    claimantId: "u2",
    claimantName: "Abena Mensah",
    claimantStudentId: "10910293",
    claimantEmail: "a.mensah@st.ug.edu.gh",
    claimantPhone: "+233 20 551 8920",
    claimantHall: "Volta Hall",
    claimantProgramme: "BA. Political Science",
    submittedAt: "2026-08-15 09:15",
    status: "under_review",
    verificationScore: 82,
    scoreBreakdown: {
      identity: 20,
      description: 18,
      uniqueFeature: 18,
      serialNumber: 10,
      evidence: 8,
      consistency: 8,
    },
    responses: [
      {
        question: "Describe what key items were inside the main compartment of the bag.",
        answer: "2 spiral notebooks and a green water bottle with a UG Volleyball sticker",
        expectedAnswer:
          "2 spiral notebooks, 1 blue pencil pouch, green water bottle with UG Volleyball sticker",
        match: true,
        score: 18,
      },
      {
        question: "What unique keychain or zipper tag was attached to the front pocket?",
        answer: "Small silver brass key ring",
        expectedAnswer: "Brass key ring",
        match: true,
        score: 18,
      },
    ],
    evidenceFiles: [
      {
        id: "ev2",
        type: "Purchase Receipt",
        name: "backpack_receipt.jpg",
        url: "#",
        note: "Store receipt for Jansport Blue Backpack dated July 2025",
        status: "pending",
      },
    ],
  },
  {
    id: "ac3",
    reference: "CLM-2026-000048",
    itemId: "6",
    itemReference: "LF-2026-000113",
    itemName: "Samsung Galaxy A34",
    itemCategory: "Electronics",
    itemLocation: "N Block",
    claimantId: "u3",
    claimantName: "Kofi Owusu",
    claimantStudentId: "10982019",
    claimantEmail: "k.owusu@st.ug.edu.gh",
    claimantPhone: "+233 55 102 9381",
    claimantHall: "Commonwealth Hall",
    claimantProgramme: "BSc. Administration",
    submittedAt: "2026-08-14 18:40",
    status: "disputed",
    verificationScore: 68,
    scoreBreakdown: {
      identity: 20,
      description: 15,
      uniqueFeature: 15,
      serialNumber: 0,
      evidence: 10,
      consistency: 8,
    },
    responses: [
      {
        question: "Provide the 15-digit IMEI number or last 4 digits.",
        answer: "Not sure of IMEI",
        expectedAnswer: "358920194820193",
        match: false,
        score: 0,
      },
      {
        question: "Describe what photo or item is placed behind the phone case.",
        answer: "A photo card of Legon Tower",
        expectedAnswer: "Photo card of Legon Tower",
        match: true,
        score: 20,
      },
    ],
    evidenceFiles: [
      {
        id: "ev3",
        type: "Box IMEI Photo",
        name: "samsung_box.jpg",
        url: "#",
        note: "Photo of Samsung phone retail box",
        status: "pending",
      },
    ],
    disputeClaimants: [
      {
        claimantName: "Kofi Owusu",
        studentId: "10982019",
        submittedAt: "2026-08-14 18:40",
        score: 68,
      },
      {
        claimantName: "Selorm Adzo",
        studentId: "10948201",
        submittedAt: "2026-08-15 11:20",
        score: 64,
      },
    ],
    reviewNotes: "Multiple users claiming same phone. Requires admin dispute resolution.",
  },
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: "u1",
    studentId: "10928471",
    name: "Emmanuel Kwakye",
    email: "e.kwakye@st.ug.edu.gh",
    phone: "+233 24 819 4012",
    hall: "Legon Hall",
    programme: "BSc. Computer Science",
    level: "300",
    role: "student",
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2025-09-01",
    reportsCount: 2,
    claimsCount: 1,
  },
  {
    id: "u2",
    studentId: "10910293",
    name: "Abena Mensah",
    email: "a.mensah@st.ug.edu.gh",
    phone: "+233 20 551 8920",
    hall: "Volta Hall",
    programme: "BA. Political Science",
    level: "200",
    role: "student",
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2025-09-05",
    reportsCount: 1,
    claimsCount: 2,
  },
  {
    id: "u3",
    studentId: "10982019",
    name: "Kofi Owusu",
    email: "k.owusu@st.ug.edu.gh",
    phone: "+233 55 102 9381",
    hall: "Commonwealth Hall",
    programme: "BSc. Administration",
    level: "400",
    role: "student",
    verificationStatus: "pending",
    accountStatus: "active",
    joinedDate: "2025-10-12",
    reportsCount: 3,
    claimsCount: 1,
  },
  {
    id: "u4",
    studentId: "10884920",
    name: "Kwame Osei",
    email: "k.osei@st.ug.edu.gh",
    phone: "+233 24 391 0294",
    hall: "Akuafo Hall",
    programme: "BSc. Nursing",
    level: "300",
    role: "student",
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2025-09-02",
    reportsCount: 4,
    claimsCount: 0,
  },
  {
    id: "u5",
    studentId: "00000001",
    name: "Dr. Evans Addo (Admin)",
    email: "eaddo@ug.edu.gh",
    phone: "+233 30 250 0381",
    hall: "Student Affairs Office",
    programme: "University Staff",
    level: "Staff",
    role: "admin",
    verificationStatus: "verified",
    accountStatus: "active",
    joinedDate: "2025-01-15",
    reportsCount: 0,
    claimsCount: 0,
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-08-16 16:10",
    userId: "u5",
    userName: "Dr. Evans Addo (Admin)",
    action: "CLAIM_APPROVED",
    entityType: "claim",
    entityId: "CLM-2026-000042",
    details: "Approved claim for Black Student ID Card (Score: 95%). Generated code UG-LF-48213.",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-2",
    timestamp: "2026-08-16 14:32",
    userId: "u1",
    userName: "Emmanuel Kwakye",
    action: "CLAIM_SUBMITTED",
    entityType: "claim",
    entityId: "CLM-2026-000042",
    details: "Submitted ownership claim for item LF-2026-000118 with ID proof attached.",
    ipAddress: "197.251.142.10",
  },
  {
    id: "log-3",
    timestamp: "2026-08-15 11:20",
    userId: "u5",
    userName: "Dr. Evans Addo (Admin)",
    action: "DISPUTE_FLAGGED",
    entityType: "claim",
    entityId: "CLM-2026-000048",
    details: "Flagged multiple claims on Samsung Galaxy A34 as Disputed.",
    ipAddress: "192.168.1.45",
  },
  {
    id: "log-4",
    timestamp: "2026-08-15 09:15",
    userId: "u2",
    userName: "Abena Mensah",
    action: "EVIDENCE_UPLOADED",
    entityType: "evidence",
    entityId: "ev2",
    details: "Uploaded backpack purchase receipt for claim CLM-2026-000045.",
    ipAddress: "197.251.140.88",
  },
  {
    id: "log-5",
    timestamp: "2026-08-10 17:00",
    userId: "u5",
    userName: "Dr. Evans Addo (Admin)",
    action: "ITEM_RECOVERED",
    entityType: "item",
    entityId: "LF-2026-000114",
    details: "Handover completed for Bunch of Keys. Item status updated to recovered.",
    ipAddress: "192.168.1.45",
  },
];

export const initialHandovers: HandoverRecord[] = [
  {
    id: "h1",
    claimReference: "CLM-2026-000042",
    itemName: "Black Student ID Card",
    ownerName: "Emmanuel Kwakye",
    finderName: "Kwame Osei",
    location: "Balme Library Help Desk",
    scheduledDate: "2026-08-18",
    scheduledTime: "10:30 AM",
    verificationCode: "UG-LF-48213",
    finderConfirmed: true,
    ownerConfirmed: false,
    status: "scheduled",
  },
  {
    id: "h2",
    claimReference: "CLM-2026-000030",
    itemName: "Bunch of Keys",
    ownerName: "Patricia Boakye",
    finderName: "Verified University User",
    location: "Legon Hall Porter Lodge",
    scheduledDate: "2026-08-10",
    scheduledTime: "14:00 PM",
    verificationCode: "UG-LF-82941",
    finderConfirmed: true,
    ownerConfirmed: true,
    status: "completed",
  },
];
