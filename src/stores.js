import { writable } from "svelte/store";
async function fetchSalesDivision() {
  const qry = `{
    boards(ids:443471251){
      groups(ids:"new_group65637"){
        items{
          id
          name
        }
      }
    }
  }`
  const url = 'https://api.monday.com/v2/'
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM1Njc4NTQ0LCJ1aWQiOjEyMzMzODczLCJpYWQiOiIyMDIwLTAxLTI4IDE4OjQ3OjQzIFVUQyIsInBlciI6Im1lOndyaXRlIn0.c-7keL6LOa54KkO-ZOKh34Tun-qnDRQvgnLYuNXW8E4'
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ 'query': qry })
  });
}
const formData = {
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
  contract: [],
  paymentAttached: [],
  clientIdAttached: [],
  clientExpectations: "",
  notes: "",
  price: ""
}
const formHeaders = {
  clientName: { label: "שם הלקוח", required: true },
  companyName: { label: "שם העסק (רשויות)", required: true },
  companyNumber: { label: "ת.ז. | ח.פ", required: true },
  price: { label: "סכום עסקה" },
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
  salesMan1: { label: "מתאם", type: "list", options: [], getData: fetchSalesDivision },
  salesMan2: {
    label: "סוכן שטח", type: "list", options: [
      { text: "עידן כהן", id: "20499445" },
      { text: "ישראל בועז שטרית", id: "23185896" },
      { text: "רון אזרן", id: "15960469" },
      { text: "אייל אסולין", id: "12478041" },
      { text: "ישראל סויסה", id: "23381794" },
      { text: "עמית מרציאנו", id: "23573246" },
      { text: "ישורון גליקמן", id: "12366457" },
    ]
  },
  contract: { label: "הסכם חתום", type: "file", required: true, options: { multiple: false } },

  paymentAttached: { label: "צ'קים", type: "file", required: true, options: { multiple: false } },
  clientIdAttached: { label: "צילום ת.ז. של בעל העסק", type: "file", required: true, options: { multiple: false } },

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
}

export const userDoc = writable(null)
export const prompt = writable(null)


function initForm(_headers, _docData) {

  const docData = { ..._docData }
  const headers = { ..._headers }

  const { set, subscribe, update } = writable({
    valid: false,
    errors: [],
    docData,
    headers
  })

  return {
    subscribe,
    set,
    update,
    reset: () => set({ ...formData }),
  }
}
export const formDoc = initForm(formHeaders, formData);


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
