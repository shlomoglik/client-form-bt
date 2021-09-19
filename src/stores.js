import { writable } from "svelte/store";
import { areasMap } from "./areas";
import { reduceColumns } from "./utils/data";
import { fetchMondayAPI } from "./services/monday";


export class fetchItems {
  constructor(ids = [], dict = {}) {
    this.ids = ids || [];
    this.dict = dict || {};
  }
  async getData() {
    const columnsValues = (this.dict && Object.keys(this.dict).length > 0) ? `(ids:[${Object.keys(this.dict)}])` : ""
    const qry = `{
        items(ids:[${this.ids}]){
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
    if (data && data.items.length > 0) {
      data = data.items.map(
        ({ name, id, column_values }) => {
          return { text: name, id, attributes: reduceColumns({ column_values, dict: this.dict }) };
        }
      );
    }
    return data || []
  }
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
async function fetchSalesAgents() {
  const dict = {
    name: "salesAgentName",
    email2: "salseAgentEmail",
    text90: "salseAgentID",
  }
  const qry = `{
    items_by_column_values(board_id: 443471251, column_id: "________", column_value: "v"){ 
      id
      name
      column_values(ids:[${Object.keys(dict).toString()}]) {
        id
        type
        title
        text
        value
      }
  }
}`
  let data = await fetchMondayAPI(qry)
  if (data && data.items_by_column_values && data.items_by_column_values.length > 0) {
    data = data.items_by_column_values.map(
      ({ name, id, column_values }) => {
        return { text: name, id, attributes: reduceColumns({ column_values: [{ id: "name", text: name, value: name, type: "text" }, ...column_values], dict }) };
      }
    );
  }
  return data || []
}


async function fetchProductsList() {
  const dict = {
    numbers: "price",
    status93: "retainerOrDeal",
    text: "productTitle",
    numbers3: "contractPeriod",
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


export const producstList = writable([
  {
    id: "11",
    active: false,
    category: "1",
    text: "ליווי וניהול שוטף",
    packages: ["1587242441", "1587791621"],
  },
  {
    id: "12",
    active: false,
    category: "1",
    text: "בקרת הנהלה בכירה",
    packages: ["1587242441", "1587791621"],
  },
  {
    id: "21",
    active: false,
    category: "2",
    text: "ניהול תזרים מזומנים",
    packages: ["1587791621"],
  },
  {
    id: "22",
    active: false,
    category: "2",
    text: "בניית מפה כלכלית לעסק",
    packages: ["1587242441", "1587791621"],
  },
])

const initFormData = {
  clientName: "",
  clientNumber: "",
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
  contractPeriod: 1,
  salesMan: "",
  salesAgent: "",
  feeStartDate: "",
  noOfPayments: 12,
  payments: [],
  contract: [],
  salesAgentName: "",
  salseAgentEmail: "",
  salseAgentID: "",
  paymentAttached: [],
  clientIdAttached: [],
  clientSignature: [],
  productVarietions: "",
  clientExpectations: "",
  notes: "",
  price: 0,
  priceIncludeVAT: 0,
  contractStartDate: "",
  retainerOrDeal: ""
}
const formHeaders = {
  clientName: { label: "שם הלקוח", required: true },
  payments: { label: "לוח תשלומים" },
  clientNumber: { label: "ת.ז.", required: true },
  companyName: { label: "שם העסק (רשויות)", required: true },
  companyNumber: { label: "מספר עוסק", required: true },
  price: { label: "סכום עסקה לפני מעמ", type: "number" },
  priceIncludeVAT: { label: "סכום עסקה כולל מעמ", type: "number", depend: { price: "EXIST" }, disabled: true },
  retainerOrDeal: { label: "רייטיינר / חד פעמי" },
  area: {
    label: "איזור בארץ",
    type: "list",
    options: [
      { text: "צפון", id: "north" },
      { text: "מרכז", id: "center" },
      { text: "דרום", id: "south" },
    ],
    reset: ["address"],
  },
  productVarietions: { type: "list", options: [], label: "סיווג מוצר", dict: { numbers: "price" } },
  address: {
    label: "כתובת", withSearch: "חיפוש כתובת...",
    type: "list",
    options: [],
    getData: fetchAddressList,
    filter: (list = [], formData = {}) => {
      if (!formData.area) return list
      return list.filter(el => {
        const { area_id = "" } = areasMap[el['סמל_נפה'].trim()] || {}
        return area_id ? area_id == formData.area : true
      })
    }
  },
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
  anohterPhone: { label: "טלפון נוסף", depend: { phone: "EXIST" } },
  anohterEmail: { label: "אימייל נוסף", depend: { email: "EXIST" } },

  package: { label: "חבילה", type: "list", options: [], getData: fetchProductsList, reset: ["productVarietions"] },
  contractPeriod: { label: "תקופת ההתקשרות בחודשים", type: "number" },
  contractStartDate: { label: "תאריך תחילת ההתקשרות", type: "date" },
  feeStartDate: { label: "תאריך תשלום ראשון", type: "date" },
  noOfPayments: { label: "חלוקה למספר תשלומים", type: "number" },
  salesMan: { label: "מתאם", type: "list", options: [], getData: fetchSalesDivision },
  salesAgent: { label: "סוכן שטח", type: "list", options: [], getData: fetchSalesAgents },
  contract: { label: "הסכם חתום", type: "file", options: { multiple: true } },

  salesAgentName: { label: "שם סוכן שטח", type: "text" },
  salseAgentEmail: { label: "אימייל סוכן שטח", type: "text" },
  salseAgentID: { label: "תעודת זהות סוכן שטח", type: "text" },

  paymentAttached: { label: "צ'קים", type: "file", required: true, options: { multiple: true } },
  clientIdAttached: { label: "צילום ת.ז. של בעל העסק", type: "file", required: true, options: { multiple: true } },

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
export const productItems = writable([])



async function initFetchStore(fetchFunc){
  const data = await fetchFunc()
  const { set, subscribe, update } = writable(data)
  return {subscribe,set,update}
}
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
    updateField: function (header, value) {
      this.update((store) => {
        const docData = Object.assign(store.docData, { [header]: value })
        const updateStore = {
          valid: store.valid,
          errors: store.errors,
          headers: store.headers,
          docData: { ...docData }
        }
        return updateStore
      })
    },
    reset: () => set({ docData: { ...initFormData }, errors: [], valid: false, headers }),
  }
}
export const formDoc = initForm(formHeaders, initFormData);



export let formGroups = writable([
  {
    isShrink: false,
    id: "clientData",
    title: "פרטי לקוח",
    fields: [
      "clientName",
      "clientNumber",
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
    fields: ["package", "productVarietions", "price", "priceIncludeVAT", "contractStartDate", "contractPeriod", "feeStartDate", "noOfPayments", "salesMan", "salesAgent",],
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
