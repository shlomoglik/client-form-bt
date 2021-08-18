// const MONDAY_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM1Njc4NTQ0LCJ1aWQiOjEyMzMzODczLCJpYWQiOiIyMDIwLTAxLTI4IDE4OjQ3OjQzIFVUQyIsInBlciI6Im1lOndyaXRlIn0.c-7keL6LOa54KkO-ZOKh34Tun-qnDRQvgnLYuNXW8E4'
import { writable } from "svelte/store";

async function fetchMondayAPI(qry) {
  const url = 'https://api.monday.com/v2/'
  const result = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': MONDAY_TOKEN
    },
    body: JSON.stringify({ 'query': qry })
  });
  if (result && result.status === 200) {
    const json = await result.json()
    if (json.data && json.data.boards[0].groups[0].items.length > 0) {
      return json.data.boards[0].groups[0].items.map(
        ({ name, id, ...rest }) => {
          return { text: name, id, attributes: { ...rest } };
        }
      );
    }
  }
  return []
}
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
  const data = await fetchMondayAPI(qry)
  return data
}
async function fetchProductsList() {
  const qry = `{
    boards(ids:___){
        items{
          id
          name
        }
    }
  }`
  const data = await fetchMondayAPI(qry)
  return data
}
async function fetchAddressList() {
  const url = "https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=3000"
  const result = await fetch(url);
  if (result && result.status === 200) {
    const json = await result.json()
    if (json.result && json.result.records) {
      return json.result.records.map(record => {
        Object.assign(record, { id: record._id, name: record.שם_ישוב })
      })
    }
  }
  return []
}
const formData = {
  clientName: "",
  companyName: "",
  companyNumber: "",
  area: "",
  address: "",
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
  clientSignature: [],
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
  address: { label: "כתובת", withSearch: "חיפוש כתובת...", type: "list", options: [], getData: fetchAddressList },
  companyType: { label: "סוג עוסק" },
  companyArea: { label: "תחום עיסוק" },

  phone: { label: "טלפון", required: true },
  email: { label: "אימייל", required: true },
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
  dealStatus: {
    label: "סטטוס עסקה", type: "list", options: [
      { text: "נחתם", id: "נחתם" },
      { text: "בתהליך חתימה", id: "בתהליך חתימה" }
    ]
  },
  salesMan1: { label: "מתאם", type: "list", options: [], getData: fetchSalesDivision },
  salesMan2: {
    label: "סוכן שטח", type: "list",
    options: [
      { text: "עידן כהן", id: "20499445" },
      { text: "ישראל בועז שטרית", id: "23185896" },
      { text: "רון אזרן", id: "15960469" },
      { text: "אייל אסולין", id: "12478041" },
      { text: "ישראל סויסה", id: "23381794" },
      { text: "עמית מרציאנו", id: "23573246" },
      { text: "ישורון גליקמן", id: "12366457" },
    ]
  },
  contract: { label: "הסכם חתום", type: "file", options: { multiple: false } },

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
  clientSignature: { type: "signature", label: "חתימת הלקוח", required: true }
}

export const userDoc = writable(null)
export const prompt = writable(null)


function initForm(_headers, _docData) {

  const docData = { ..._docData }
  const headers = { ..._headers }

  const params = (new URL(document.location)).searchParams;
  for (const [k, v] of params) {
    if (headers[k]) {
      docData[k] = v
    }
  }

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
    updateField: function (header, data) {
      this.update(curr => {
        console.log(curr, header, data)
      })
    },
    reset: () => set({ docData: { ...formData }, errors: [], valid: false, headers }),
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
      "address",
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
    fields: ["package", "dealStatus", "salesMan1", "salesMan2"],
  },
  {
    isShrink: true,
    id: "attachments",
    title: "צרופות",
    fields: ["paymentAttached", "clientIdAttached", "contract"],
  },
  {
    isShrink: true,
    id: "notes",
    title: "הערות ותוספות",
    fields: ["clientExpectations", "notes"],
  },
]);
