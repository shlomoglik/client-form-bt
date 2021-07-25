import { writable } from "svelte/store";

export const formDoc = writable({
  docData: {
    clientName: "",
    companyName: "",
    companyNumber: "",
    area: "",
    adress: "",
    companyType: "",
    companyArea: "",
    phone: "",
    email: "",
    anohterPhone: "",
    anohterEmail: "",
    package: "",
    dealStatus: "",
    salesMan1: "",
    salesMan2: "",
    contract: "",
    paymentAttached: "",
    clientIdAttached: "",
    clientExpectations: "",
    notes: "",
  },
  headers: {
    clientName: { label: "שם הלקוח" },
    companyName: { label: "שם העסק (רשויות)" },
    companyNumber: { label: "ת.ז. | ח.פ" },
    area: {
      label: "איזור בארץ",
      type: "list",
      options: [
        { text: "צפון", id: "north" },
        { text: "מרכז", id: "center" },
        { text: "דרום", id: "south" },
      ],
    },
    adress: { label: "כתובת" },
    companyType: { label: "סוג עוסק" },
    companyArea: { label: "תחום עיסוק" },

    phone: { label: "טלפון" },
    email: { label: "אימייל" },
    anohterPhone: { label: "טלפון נוסף" },
    anohterEmail: { label: "אימייל נוסף" },

    package: {
      label: "חבילה",
      type: "list",
      options: [
        { text: "BT-PRO", id: "BT_PRO", attributes: { price: 5000 } },
        { text: "BT", id: "BT", attributes: { price: 5000 } },
        { text: "DIGITAL-PRO", id: "DP", attributes: { price: 5000 } },
        { text: "מנכלים", id: "CEO", attributes: { price: 5000 } },
      ],
    },
    dealStatus: { label: "סטטוס עסקה" },
    salesMan1: { label: "מתאם" },
    salesMan2: { label: "סוכן שטח" },
    contract: { label: "הסכם חתום" },

    paymentAttached: { label: "צ'קים" },
    clientIdAttached: { label: "צילום ת.ז. של בעל העסק" },

    clientExpectations: {
      label: "תיאום ציפיות",
      type: "long",
      placeholder: "מהם ציפיות הלקוח מהתהליך ?",
    },
    notes: {
      label: "הערות",
      type: "long",
      placeholder: "הערות, תוספות לחבילה , דגשים מסחריים",
    },
  },
});

export let formGroups = writable([
  {
    isShrink: false,
    id: "clientData",
    title: "פרטי לקוח",
    fields: [
      "clientName",
      "companyName",
      "companyNumber",
      "area",
      "adress",
      "companyType",
      "companyArea",
    ],
  },
  {
    isShrink: true,
    id: "contacts",
    title: "פרטי קשר",
    fields: ["phone", "email", "anohterPhone", "anohterEmail"],
  },
  {
    isShrink: true,
    id: "dealData",
    title: "פרטי עסקה",
    fields: ["package", "dealStatus", "salesMan1", "salesMan2", "contract"],
  },
  {
    isShrink: true,
    id: "attachments",
    title: "צרופות",
    fields: ["paymentAttached", "clientIdAttached"],
  },
  {
    isShrink: true,
    id: "notes",
    title: "הערות ותוספות",
    fields: ["clientExpectations", "notes"],
  },
]);