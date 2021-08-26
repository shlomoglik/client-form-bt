import { writable } from "svelte/store";

const MONDAY_URL = 'https://api.monday.com/v2/'


export class fetchItems {
  constructor(ids = [], dict = {}) {
    this.ids = ids;
    this.dict = dict;
  }
  async getData() {
    const columnsValues = Object.keys(this.dict).length > 0 ? `(ids:${Object.keys(this.dict)})` : ""
    const qry = `{
        items(ids:${this.ids}){
          id
          name
          column_values${columnsValues}{
            id
            type
            title
            text
            value
         }
        }
    }`
    let data = await fetchMondayAPI(qry)
    return data || []
  }
}


async function fetchMondayAPI(qry) {
  const result = await fetch(MONDAY_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': MONDAY_TOKEN
    },
    body: JSON.stringify({ 'query': qry })
  });
  if (result && result.status === 200) {
    const json = await result.json()
    if (json.data) return json.data
  }
  // return []
}

const reduceColumns = ({ column_values = [], key = "id", dict = {} } = {}) => {
  return column_values.reduce((acc, curr) => {
    let field = curr[key]
    if (dict && dict[curr[key]]) {
      field = dict[curr[key]]
    }
    return { ...acc, [field]: curr }
  }, {})
}
async function fetchSalesDivision() {
  const qry = `{
    boards(ids:443471251){
      groups(ids:"new_group65637"){
        items{
          id
          name
          column_values{
            id
            type
            title
            text
            value
          }
        }
      }
    }
  }`
  let data = await fetchMondayAPI(qry)
  if (data && data.boards && data.boards[0].groups[0].items.length > 0) {
    data = data.boards[0].groups[0].items.map(
      ({ name, id }) => {
        return { text: name, id, attributes: {} };
      }
    );
  }
  return data || []
}
async function fetchProductsList() {
  const dict = {
    numbers: "price",
    // numbers: "minPrice",
    text: "productTitle",
    subitems: "productVarietions"
  }
  const qry = `{
    boards(ids:1587237484){
      items{
        id
        name
        column_values(ids:[${Object.keys(dict).toString()}]){
           id
          type
          title
          text
          value
        }
      }
    }
  }`
  let data = await fetchMondayAPI(qry)
  if (data && data.boards[0].items.length > 0) {
    data = data.boards[0].items.map(
      ({ name, id, column_values }) => {
        return { text: name, id, attributes: reduceColumns({ column_values, dict }) };
      }
    );
  }
  return data || []
}
async function fetchAddressList() {
  const url = "https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=3000"
  const result = await fetch(url);
  if (result && result.status === 200) {
    const json = await result.json()
    if (json.result && json.result.records) {
      return json.result.records.map(record => {
        return Object.assign(record, { id: record._id, text: record.שם_ישוב })
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
  salesMan1: "",
  salesMan2: "",
  contract: [],
  paymentAttached: [],
  clientIdAttached: [],
  clientSignature: [],
  productVarietions: [],
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
  productVarietions: { type: "list", options: [] },
  address: { label: "כתובת", withSearch: "חיפוש כתובת...", type: "list", options: [], getData: fetchAddressList },
  companyType: {
    label: "סוג עוסק", type: "list", options: [
      { text: "עוסק פטור", id: "עוסק פטור" },
      { text: "עוסק מורשה", id: "עוסק מורשה" },
      { text: "חברה בעמ", id: "חברה בעמ" },
      { text: "חברה מסחרית", id: "חברה מסחרית" },
      { text: "שותפות", id: "שותפות" },
    ]
  },
  companyArea: { label: "תחום עיסוק" },

  phone: { label: "טלפון", required: true },
  email: { label: "אימייל", required: true },
  anohterPhone: { label: "טלפון נוסף" },
  anohterEmail: { label: "אימייל נוסף" },

  package: {
    label: "חבילה",
    type: "list",
    options: [],
    getData: fetchProductsList
    // options: [
    //   { text: "BT-PRO", id: "BT_PRO", attributes: { price: 5000 } },
    //   { text: "BT", id: "BT", attributes: { price: 5000 } },
    //   { text: "DIGITAL-PRO", id: "DP", attributes: { price: 5000 } },
    //   { text: "מנכלים", id: "CEO", attributes: { price: 5000 } },
    // ],
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
    fields: ["package", "salesMan1", "salesMan2", "price"],
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
