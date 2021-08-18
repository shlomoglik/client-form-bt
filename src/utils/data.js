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