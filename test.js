const store = {
    contractPeriod:12,
}
const text = "משך ההסכם הינו ל#_contractPeriod_# חודשים  (קרי, כ #_contractPeriod_# תשלומים חודשיים),"

const newText = text.replace(/#_([a-zA-Z]+)_#/g,(_,match)=>store[match]);
console.log(newText)