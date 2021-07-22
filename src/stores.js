import { writable } from 'svelte/store';

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
            options: [{ text: "צפון", id: "north" }, { text: "מרכז", id: "center" }, { text: "דרום", id: "south" }]
        },
        adress: { label: "כתובת" },
        companyType: { label: "סוג עוסק" },
        companyArea: { label: "תחום עיסוק" },

        phone: { label: "טלפון" },
        email: { label: "אימייל" },
        anohterPhone: { label: "טלפון נוסף" },
        anohterEmail: { label: "אימייל נוסף" },

        package: { label: "חבילה" },
        dealStatus: { label: "סטטוס עסקה" },
        salesMan1: { label: "מתאם" },
        salesMan2: { label: "סוכן שטח" },
        contract: { label: "הסכם חתום" },

        paymentAttached: { label: "צ'קים" },
        clientIdAttached: { label: "צילום ת.ז. של בעל העסק" },

        clientExpectations: { label: "תיאום ציפיות", type: "long", placeholder: "מהם ציפיות הלקוח מהתהליך ?" },
        notes: { label: "הערות", type: "long", placeholder: "הערות, תוספות לחבילה , דגשים מסחריים" },
    },
})
