import { O_OBJECT, O_STRING } from "./objTypes"
//generete random
export const uuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)


//test value types
export const isEmptyValue = value => value === "" || value === null || (Array.isArray(value) && value.length === 0) || value === undefined
export const isEmptyArray = (arr = []) => isFlatArray(arr) ? arr.every(el => !el) : arr.every(el => isEmptyValue(el))
export const isEmptyObj = (value = {}) => Object.keys(value)[0] === undefined || Object.values(value).every(v => isEmptyValue(value))
export const isFlatArray = arr => Array.isArray(arr) && arr.every(el => typeof el === "string" || typeof el === "number")
export const objType = obj => Object.prototype.toString.call(obj);
export const isString = input => objType(input) === O_STRING
export const isObject = input => objType(input) === O_OBJECT

export const addMonths = (monthsToAdd = 0, d = new Date()) => new Date(d.getFullYear(), d.getMonth() + parseInt(monthsToAdd), d.getDate());


export function getDisplayValue(value, type, settings = {}) {
    let displayValue = ''
    if (type === "list") {
        const { options = [] } = settings.field
        const filedOptions = options.filter(({ id }) => id === value)
        displayValue = filedOptions.map(({ text }) => text).join(" , ")
        if (settings.attributes && Array.isArray(settings.attributes)) {
            displayValue = ""
            settings.attributes.forEach((attr, ind) => {
                filedOptions.map(({ attributes }) => {
                    if (attributes && attributes[attr]) {
                        if (ind > 0) displayValue += " , "
                        displayValue += attributes[attr].text
                    }
                })
            })
        }
    } else if (type === "number") {
        displayValue = formatNumber(value, settings)
    } else if (type === "currency") {
        displayValue = `${formatNumber(value, settings)} ₪`
    } else if (type === "date") {
        displayValue = formatDateDisplay(new Date(value))
    }
    return displayValue
}

export function formatNumber(input, { isFloat, digits = 2 } = {}) {

    if (isNaN(parseFloat(input))) {
        return "0"
    }

    const isNegative = parseInt(input) < 0
    let result = Math.abs(Math.round(input));
    if (isFloat) {
        result = Math.abs(parseInt(input));
        var floatingPart = `${parseFloat(input)}`.split(".")[1] || "00";
        floatingPart = floatingPart.substring(0, digits)
    }
    result = result.toString(); //"12345678"
    const length = result.length - 1
    const split = result.split("").reverse(); //[8,7,6,5,4,3,2,1]
    const splitData = split.join("");
    const splitR = splitData.split(""); //[8,7,6,5,4,3,2,1]
    if (split.length > 3) {
        let inserts = 0;
        split.forEach((el, ind) => {
            const i = ind + 1
            if (i % 3 === 0 && ind > 0 && ind < length) {
                splitR.splice(i + inserts, 0, ",")  //[8,7,6, |","|  5,4,3,2,1]
                inserts++;
            }
        })
    }
    result = splitR.reverse().join("");
    if (isFloat) {
        // 8321=₁
        // let subscriptFloationg = floatingPart.toString().split("").map(n => String.fromCharCode(8320 + Number(n))).join("")
        // result = `${result}.${subscriptFloationg}`
        result = `${result}.${floatingPart}`
    }
    if (isNegative) {
        result = `( ${result} -)`
    }
    return result
}

export function formatDateDisplay(date, options = {}) {
    if (isNaN(date.getMilliseconds())) return "----/--/--"

    const y = date.getFullYear();
    let m = date.getMonth(); m++;
    if (Number(m).toString() < 10) m = "0" + m
    let d = date.getDate();
    if (Number(d).toString() < 10) d = "0" + d

    const outputFormat = options.outputFormat || "dd/mm/yyyy"
    let output
    if (outputFormat === "dd/mm/yyyy") {
        output = d + "/" + m + "/" + y;
    } else if (outputFormat === "dd/mm/yy") {
        output = d + "/" + m + "/" + y.toString().substring(2);
    } else if (outputFormat === "yyyy-MM-dd") {
        output = y + "-" + m + "-" + d
    } else if (outputFormat === "dd=>mm") {
        const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
        const monthName = months[date.getMonth() % 12]
        output = d + " ל" + monthName
    }
    if (options.useHours) {
        let h = date.getHours();
        let mm = date.getMinutes();
        if (h < 10) h = `0${h}`
        if (mm < 10) mm = `0${mm}`
        output += ` ${h}:${mm}`
    }
    return output;
}

export const reduceColumns = ({ column_values = [], key = "id", dict = {} } = {}) => {
    return column_values.reduce((acc, curr) => {
        let field = curr[key]
        if (dict && dict[curr[key]]) {
            field = dict[curr[key]]
        }
        return { ...acc, [field]: curr }
    }, {})
}

export function getCssText() {
    for (let i = 0; i < window.document.styleSheets.length; i++) {
        for (let j = 0; j < window.document.styleSheets[i].cssRules.length; j++) {
            console.log(window.document.styleSheets[i].cssRules[j].cssText)
        }
    }
}