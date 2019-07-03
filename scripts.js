"use strict";

//rates
const rateDates =           ["2018-01-01", "2018-07-01", "2019-01-01"];
const spotRates =           [49.4054,      50.6405,      51.9065];
const driverLevel1Rates =   [33.5339,      34.3723,      35.2316];
const traineeRates =        [28.7277,      29.4459,      30.1820];
const conversionRates =     [46.1015,      47.2541,      48.4354];
const ojtAllowanceRates =   [9.7237,       9.9668,       10.2159];
const mealAllowanceRates =  [11.6357,      11.9266,      12.2248];
const suburbanAllowanceRates = [8.3644,    8.5736,       8.7879];
const earlyShiftRates =     [3.2508,       3.3321,       3.4154]; //a shift which is rostered to commence at or between 0400 and 0530
const afternoonShiftRates = [3.2508,       3.3321,       3.4154]; //a shift which is rostered to commence before 1800 and conclude at or after 1830.
const nightShiftRates =     [3.8209,       3.9164,       4.0143]; //a shift which is rostered to commence at or between 1800 and 0359 hours.

//colours
const ojtColour = "#ff7300";
const ddoColour = "#005229";
const phColour = "#c8ff00";
const wmColour = "#bd4bff";
const sickColour = "#ff0000";


//define Classes
class Shift {
    constructor(signOn, signOff) {
        if(signOn && signOff) {
            this.startHour = parseInt(signOn.substring(0,2));
            this.startMinute = parseInt(signOn.substring(2,4));
            this.endHour = parseInt(signOff.substring(0,2));
            this.endMinute = parseInt(signOff.substring(2,4));
        }
        else {
            this.startHour = 0;
            this.startMinute = 0;
            this.endHour = 0;
            this.endMinute = 0;
        }
        this.ojt = false; //OJT shift
        this.ph = false; //public holiday
        this.wm = false; //wasted meal
        this.sick = false; //sick day
        this.ddo = false; //DDO
        this.shiftNumber = 0;
        this.shiftWorkedNumber = 0;
    }

    get hoursString() {
        return this.calcHoursString();
    }

    get hoursDecimal() {
        let hoursFloat = 0.0;
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        hoursFloat = hours + (minutes/60);
        return hoursFloat;
    }

    get endHour48() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) return this.endHour + 24;
        else return this.endHour;
    }

    calcHoursString() {
        let hours = this.endHour - this.startHour;
        let minutes = this.endMinute - this.startMinute;
        if(hours < 0 || (hours == 0 && minutes < 0)) hours += 24;
        if(minutes < 0) {
            minutes += 60;
            hours--;
        }
        if(hours || minutes) return hours + ":" + minutes.toString().padStart(2, "0");
        else return "";
    }

    setNilHours() {
        this.startHour = 0;
        this.endHour = 0;
        this.startMinute = 0;
        this.endMinute = 0;
    }

    setShiftTimes(signOn, signOff) {
        if(signOn && signOff) {
            this.startHour = parseInt(signOn.substring(0,2));
            this.startMinute = parseInt(signOn.substring(2,4));
            this.endHour = parseInt(signOff.substring(0,2));
            this.endMinute = parseInt(signOff.substring(2,4));
        }
        else console.error("setShiftTimes(): insufficient parameters");
    }
}

class PayElement { 
    constructor(payType, hours, ojt) {
            this.payType = payType;
            this.hours = hours;
            this.ojt = ojt;
    }
    
    get sortIndex() {
        return payTypes.indexOf(this.payType);
    }

    get payAmount() {
        return this.rate * this.hours;
    }

    get payClass() {
        if(this.ojt) return this.payType + " (OJT)";
        else return this.payType;
    }

    get rate() {
        let selectedDate = $("#week-commencing-date").datepicker("getDate");
        let rate = 0;
        if(this.ojt) rate += getEbaRate(selectedDate, ojtAllowanceRates); //apply OJT allowance
        switch(this.payType) {
            case "normal": //Normal rate
            case "sick":
            case "guarantee": //pay guarantee to 8 hours
            case "edo":
            case "wePen100":
            case "rost100":
            case "phGaz":
            case "phXpay":
            case "phWorked":
            case "nonRosPH": //8 hours pay for NOT working on Easter Saturday but NOT UNDERLINED
                rate += getEbaRate(selectedDate, selectedGradeRates);
                break;
            case "wePen50":
            case "phPen50":
            case "rost50":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate /= 2;
                break;
            case "ot150":
            case "phPen150":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate *= 1.5;
                break;
            case "ot200":
                rate += getEbaRate(selectedDate, selectedGradeRates);
                rate *= 2;
                break;
            case "earlyShift":
                rate += getEbaRate(selectedDate, earlyShiftRates);
                break;
            case "afternoonShift":
                rate += getEbaRate(selectedDate, afternoonShiftRates);
                break;
            case "nightShift":
                rate += getEbaRate(selectedDate, nightShiftRates);
                break;
            case "metroSig2":
                rate += getEbaRate(selectedDate, suburbanAllowanceRates);
                break;
            case "mealAllowance":
                rate += getEbaRate(selectedDate, mealAllowanceRates);
                break;
            default:
                console.error("PayElement.rate: unable to get rate for payType \"" + this.payType + "\"");
                return null;
        }
        return parseFloat(rate.toFixed(4));
    }
}


//initialise variables
let shifts = [];
let shiftPay = [[]]; //multidimensional array to store pay elements per shift. first dimension is shift number (0-13), second is pay element for that shift.
let selectedGradeRates;
for (let i = 0; i < 14; i++) shifts.push(new Shift()); //init shifts array with 0 length shifts
let timeField = function() {return document.querySelectorAll(".time")}; //alias for time input boxes
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//init on document load
$(document).ready(function() { 
    initButtons();
    updateGrade();

    let radios = $(".pay-grade-radio");
    for(let i = 0; i < radios.length; i++) {
        radios[i].addEventListener("change", function(){updateGrade();});
    }

    //setup datepicker
    $("#week-commencing-date").datepicker({
        dateFormat: "d/m/yy",
        beforeShowDay: function(date){
            var day = date.getDay();
		    return [ ( day == 0), "" ];
        },
        onClose: function(){
            printShiftHours();
            updateOptionsButtons();
            updateShiftPayTable();
            updateResults();
        }
    });
    updateDates();
    timeChanged(0); //forces update in case data already loaded by browser (such as by refreshing page)
    let timeField = $(".time");
    for(let i = 0; i < timeField.length; i++) { //close shelves on time field focus
        timeField[i].addEventListener("focus", function(){closeAllOptionsShelves();});
    } 
});

function initButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        optionsButtons[i].addEventListener("click", function(){toggleOptionsShelf(i)});
        optionsButtons[i].textContent = "Options";
    }
    updateOptionsButtons();
}

function updateOptionsButtons() {
    let optionsButtons = $(".options-button");
    for(let i = 0; i < optionsButtons.length; i++) {
        let ojt = shifts[i].ojt;
        let ddo = shifts[i].ddo;
        let ph = shifts[i].ph;
        let wm = shifts[i].wm;
        let sick = shifts[i].sick;
        if($(".shift-options-shelf")[i].style.display == "block") optionsButtons[i].style.borderStyle = "solid"; //if shelf open, highlight
            else  optionsButtons[i].style.borderStyle = "none";
        if(sick) {
            optionsButtons[i].textContent = "Sick";
            optionsButtons[i].style.backgroundColor = sickColour;
            optionsButtons[i].style.backgroundImage = "";
            optionsButtons[i].style.color = "";
            optionsButtons[i].style.fontWeight = "bold";
        }
        else if(ddo) {
            optionsButtons[i].textContent = "DDO";
            optionsButtons[i].style.backgroundColor = ddoColour;
            optionsButtons[i].style.backgroundImage = "";
            optionsButtons[i].style.color = "";
            optionsButtons[i].style.fontWeight = "bold";
        }
        else if(shifts[i].hoursDecimal <= 0){ //if ZERO HOURS
            optionsButtons[i].textContent = "OFF";
            optionsButtons[i].style.backgroundColor = "black";
            optionsButtons[i].style.backgroundImage = "";
            optionsButtons[i].style.color = "";
            optionsButtons[i].style.fontWeight = "bold";
            if(ojt || ph || wm) { //if any shift options selected, show this on the main option button.
                /*let multipleOptions = false; //trigger for adding delimiters for multiple options
                optionsButtons[i].textContent += " (";
                if(ojt) {
                    optionsButtons[i].textContent += "OJT";
                    multipleOptions = true;
                } 
                if(ph) {
                    if(multipleOptions) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "PH";
                    multipleOptions = true;
                }
                if(wm) {
                    if(multipleOptions) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "WM";
                    multipleOptions = true;
                }
                optionsButtons[i].textContent += ")";*/
                optionsButtons[i].textContent += " (+)";
            }
        }
        else { //if actual shift
            if(ojt || ph || wm){
                let optionsCount = 0;
                optionsButtons[i].textContent = "";
                optionsButtons[i].style.color = "black";
                optionsButtons[i].style.fontWeight = "";
                optionsButtons[i].style.backgroundImage = "";
                if(ojt){
                    optionsButtons[i].textContent = "OJT";
                    optionsButtons[i].style.backgroundColor = ojtColour;
                    optionsCount++;
                }
                if(ph){
                    if(optionsCount > 0) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "PH";
                    optionsButtons[i].style.backgroundColor = phColour;
                    
                    optionsCount++;
                }
                if(wm){
                    if(optionsCount > 0) optionsButtons[i].textContent += " + ";
                    optionsButtons[i].textContent += "WM";
                    optionsButtons[i].style.backgroundColor = wmColour;
                    optionsCount++;
                }
                //set gradient colour for multiple options
                if(optionsCount > 0) {
                    let cssGradient = "linear-gradient(to right";
                    if(ojt) cssGradient += "," + ojtColour;
                    if(ddo) cssGradient += "," + ddoColour;
                    if(ph) cssGradient += "," + phColour;
                    if(wm) cssGradient += "," + wmColour;
                    if(sick) cssGradient += "," + sickColour;
                    cssGradient += ")";
                    optionsButtons[i].style.backgroundImage = cssGradient;
                }
            }
            else{
                optionsButtons[i].textContent = "Normal";
                optionsButtons[i].style.color = "black";
                optionsButtons[i].style.backgroundColor = "";
                optionsButtons[i].style.fontWeight = "";
                optionsButtons[i].style.backgroundImage = "";
            }
        }   
    }
}

function toggleOptionsShelf(day) {
    if($(".shift-options-shelf")[day].style.display == "block"){ //close
        $(".shift-options-shelf")[day].style.display = "";
        updateOptionsButtons();
    }
    else {                                                      //open
        closeAllOptionsShelves();
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        $(".shift-options-shelf")[day].style.display = "block";
        updateOptionsButtons();
        generateOptionsShelfButtons(day);
    }
}

function refreshOptionsShelf(day) {
    if($(".shift-options-shelf")[day].style.display == "block"){ //if open, refresh
        $(".shift-options-shelf")[day].textContent = ""; //clear existing buttons
        updateOptionsButtons();
        generateOptionsShelfButtons(day);
    }
    else {                                                      //if closed, do not
        console.warn("Options shelf on day " + day + " is closed!");
    }
}

function closeAllOptionsShelves() {
    for(let i = 0; i < $(".shift-options-shelf").length; i++){ //close all shelves first
        $(".shift-options-shelf")[i].style.display = "";
    }
    updateOptionsButtons();
}

function generateOptionsShelfButtons(day) {
    let shelf = $(".shift-options-shelf")[day];

    //OJT button
    let ojtButton = document.createElement("a");
    ojtButton.textContent = "OJT";
    ojtButton.setAttribute("class", "button ojt-button");
    if(shifts[day].ojt) {//if OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        ojtButton.style.background = "";
        ojtButton.style.color = "black";
    }
    else {//if not OJT
        ojtButton.addEventListener("click", function(){
            shifts[day].ojt = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        ojtButton.style.background = "none";
    }

    //DDO button
    let ddoButton = document.createElement("a");
    ddoButton.textContent = "DDO";
    ddoButton.setAttribute("class", "button ddo-button");
    if(shifts[day].ddo) {//if DDO
        ddoButton.addEventListener("click", function(){
            shifts[day].ddo = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        ddoButton.style.background = "";
        ddoButton.style.color = "black";
    }
    else {//if not DDO
        ddoButton.addEventListener("click", function(){
            shifts[day].ddo = true;
            shifts[day].sick = false;
            shifts[day].ph = false;
            shifts[day].wm = false;
            shifts[day].ojt = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        ddoButton.style.background = "none";
    }

    //Public Holiday button
    let phButton = document.createElement("a");
    phButton.textContent = "Public Holiday";
    phButton.setAttribute("class", "button ph-button");
    if(shifts[day].ph) {//if PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        phButton.style.background = "";
        phButton.style.color = "black";
    }
    else {//if not PH
        phButton.addEventListener("click", function(){
            shifts[day].ph = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        phButton.style.background = "none";
    }

    //Wasted Meal button
    let wmButton = document.createElement("a");
    wmButton.textContent = "Wasted Meal";
    wmButton.setAttribute("class", "button wm-button");
    if(shifts[day].wm) {//if WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        wmButton.style.background = "";
        wmButton.style.color = "black";
    }
    else {//if not WM
        wmButton.addEventListener("click", function(){
            shifts[day].wm = true;
            shifts[day].sick = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        wmButton.style.background = "none";
    }

    //Sick button
    let sickButton = document.createElement("a");
    sickButton.textContent = "Sick";
    sickButton.setAttribute("class", "button sick-button");
    if(shifts[day].sick) {//if sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        sickButton.style.background = "";
        sickButton.style.color = "black";
    }
    else {//if not sick
        sickButton.addEventListener("click", function(){
            shifts[day].sick = true;
            shifts[day].ph = false;
            shifts[day].wm = false;
            shifts[day].ojt = false;
            refreshOptionsShelf(day);
            updateShiftWorkedCount();
            printShiftHours();
            updateShiftPayTable();
            updateResults();
        });
        sickButton.style.background = "none";
    }

    //append buttons to shelf
    shelf.appendChild(ojtButton);
    shelf.appendChild(ddoButton);
    shelf.appendChild(phButton);
    shelf.appendChild(wmButton);
    shelf.appendChild(sickButton);
}

function timeChanged(field) {
    if(timeField()[field].value.length == 4) {
        updateShiftTable();
        if(field < 27) timeField()[field + 1].focus();
    }
    else {
        shifts[fieldToShift(field)].setNilHours();
    }
    updateShiftWorkedCount();
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

function setFormColour(colour) {
    for(let i = 0; i < $(".container").length; i++) {
        $(".container")[i].style.backgroundColor = colour;
    }
}

function getPayGrade() {
    return document.forms.payGradeForm.payGrade.value;
}

function updateGrade() {
    switch(getPayGrade()) {
        case "spot": 
            selectedGradeRates = spotRates;
            setFormColour("#4691db");
            break;
        case "level1":
            selectedGradeRates = driverLevel1Rates;
            setFormColour("rgb(114, 99, 191)");
            break;
        case "trainee":
            selectedGradeRates = traineeRates;
            setFormColour("rgb(56, 149, 149)");
            break;
        case "conversion":
            selectedGradeRates = conversionRates;
            setFormColour("rgb(207, 133, 50)");
            break;
        default: selectedGradeRates = undefined;
    }
    printShiftHours();
    updateOptionsButtons();
    updateShiftPayTable();
    updateResults();
}

function updateShiftTable() {
    let times = timeField();
    for(let i = 0; i < times.length; i += 2) {
        let currentShift = fieldToShift(i);
        if(times[i].value.length == 4 && times[i+1].value.length == 4 && times[i].checkValidity() && times[i+1].checkValidity()){
            shifts[currentShift].setShiftTimes(times[i].value, times[i+1].value);
        }
        else {
            shifts[currentShift].setNilHours();
        }
    }
    updateShiftWorkedCount();
}

function updateShiftWorkedCount() {
    let shiftsCount = 0;
    let shiftsWorkedCount = 0;
    for(let i = 0; i < shifts.length; i++) {
        //determine if shift
        if(shifts[i].hoursDecimal > 0 || shifts[i].sick || shifts[i].ph || shifts[i].ddo) {
            shifts[i].shiftNumber = ++shiftsCount;
        } else shifts[i].shiftNumber = 0;

        //determine if worked shift
        if(shifts[i].hoursDecimal > 0 && !shifts[i].sick) {
            shifts[i].shiftWorkedNumber = ++shiftsWorkedCount;
        } else shifts[i].shiftWorkedNumber = 0;
    }
}

function updateResults(viewFormat) {
    let resultArea = document.getElementById("result-area");
    let totalValue = 0.0;
    let selectedDate = $("#week-commencing-date").datepicker("getDate");
    let dateDiv = document.querySelector(".week-commencing");
    resultArea.innerHTML = ""; //clear existing results
    if(!selectedDate) {
        dateDiv.style.borderStyle = "solid";
        dateDiv.style.background = "";
        let dateErrorElement = document.createElement("h3");
        dateErrorElement.textContent = "Please set Week Commencing date!";
        resultArea.appendChild(dateErrorElement);
    }
    else {
        dateDiv.style.borderStyle = "none";
        dateDiv.style.background = "none";

        switch(viewFormat) {
            case "test":
                let shiftTitle = document.createElement("h3");
                shiftTitle.textContent = "TEST VIEW FORMAT";
                resultArea.appendChild(shiftTitle);
                break;
            case "debug":
            default:
                for(let i = 0; i < 14; i++) {
                    if(shiftPay[i].length > 0){ //if any pay elements for current day
                        let shiftDiv = document.createElement("div");
                        let shiftTitle = document.createElement("h3");
                        shiftTitle.textContent = $(".day-of-week")[i].textContent;
                        shiftDiv.appendChild(shiftTitle);
                        let shiftSubtitle = document.createElement("i");
                        shiftSubtitle.textContent = "Shift " + shifts[i].shiftNumber + " | Shift Worked: " + shifts[i].shiftWorkedNumber;
                        shiftDiv.appendChild(shiftSubtitle);
                        let payElements = document.createElement("ul");
                        for(let j = 0; j < shiftPay[i].length; j++) {
                            let payElement = document.createElement("li");
                            payElement.textContent = "Type: " + shiftPay[i][j].payClass + " | Rate: " + shiftPay[i][j].rate.toFixed(4) + " | Hours: " + shiftPay[i][j].hours.toFixed(4) + " | $" + shiftPay[i][j].payAmount.toFixed(2);
                            payElements.appendChild(payElement);
                            totalValue += shiftPay[i][j].payAmount;
                        }
                        shiftDiv.appendChild(payElements);
                        shiftDiv.appendChild(document.createElement("hr"));
                        resultArea.appendChild(shiftDiv);
                    }
                }
                if(totalValue > 0.0) {
                    let totalElement = document.createElement("h3");
                    totalElement.setAttribute("id", "totalElement");
                    totalElement.textContent = "Total Gross: $" + totalValue.toFixed(2);
                    resultArea.appendChild(totalElement);
                }
        }
    }
}

function updateDates() { //updates day of week fields
    let dayOfWeekFields = document.querySelectorAll(".day-of-week");
    let inputDate = $("#week-commencing-date").datepicker("getDate");
    if(!inputDate){ //if date invalid, blank the dates
        for(let i = 0; i < dayOfWeekFields.length; i++){
            dayOfWeekFields[i].innerHTML = daysOfWeek[i%7];
        }
    }
    else { //date valid, print dates
        if(inputDate.getDay() === 0){ //only update if a Sunday
            for(let i = 0; i < dayOfWeekFields.length; i++){
                dayOfWeekFields[i].innerHTML = daysOfWeek[i%7] + " - " + inputDate.getDate() + "/" + (inputDate.getMonth() + 1);
                inputDate.setDate(inputDate.getDate() + 1);
            }
        }
    }
}

function addAllFields() { //function to test time input boxes
    let times = document.querySelectorAll("input.time");
    let total = 0;

    let x;
    for (x in times) {
        let value = parseInt(times[x].value)
        if(!isNaN(value)) total += value;
    }
    return total;
}

function fieldToShift(field) {
    switch(field) {
        case 0: case 1: return 0;
        case 2: case 3: return 1;
        case 4: case 5: return 2;
        case 6: case 7: return 3;
        case 8: case 9: return 4;
        case 10: case 11: return 5;
        case 12: case 13: return 6;
        case 14: case 15: return 7;
        case 16: case 17: return 8;
        case 18: case 19: return 9;
        case 20: case 21: return 10;
        case 22: case 23: return 11;
        case 24: case 25: return 12;
        case 26: case 27: return 13;
        default: return NaN;
    }
}

function printShiftHours() {
    let hoursField = document.querySelectorAll(".shift-hours");
    for(let i = 0; i < shifts.length; i++) {
        hoursField[i].innerHTML = shifts[i].hoursString;
    }
}

function getEbaRate(date, rates) {
    let wcDate = Date.parse(date);
    for(let i = rates.length - 1; i >= 0; i--) {
        if(wcDate >= Date.parse(rateDates[i])){
            return rates[i];
        }
    }
    console.error("getEbaRate() Error: Invalid date or no matching payrate");
    return 0;
}

//calculates pay elements for each shift in the shift table and places them into the pay table (shiftPay[])
function updateShiftPayTable() {
    shiftPay = []; //clear pay table
    for(let day = 0; day < 14; day++) {
        let s = shifts[day]; //alias
        shiftPay.push([]);
        if(s.hoursDecimal <= 0) { //if shift has zero hours
            //check for shift options (PH?)
            if(shifts[day].sick) shiftPay[day].push(new PayElement("sick", 8));
        }
        else { //if shift has hours
            if(s.ph) { //Public Holiday
                //check for XPAY or XLEAVE //PLACEHOLDER CALCULATION
                shiftPay[day].push(new PayElement("phWorked", s.hoursDecimal, s.ojt));
                shiftPay[day].push(new PayElement("phPen50", s.hoursDecimal, s.ojt));
            }
            else { //NOT PH
                let shiftworkAllowanceEligible = true; //deny shiftwork allowance for excess shift and weekend penalties
                if(s.shiftWorkedNumber <= 10){ //ordinary rate for non-excess shifts
                    shiftPay[day].push(new PayElement("normal", s.hoursDecimal, s.ojt));
                }
                //calculate guarantee
                if(isWeekday(day) && s.shiftWorkedNumber <= 10 && s.hoursDecimal < 8) {
                    if(getPayGrade() == "trainee") {
                        if(s.hoursDecimal < 7.6) {
                            let guaranteeHours = 7.6 - s.hoursDecimal;
                            shiftPay[day].push(new PayElement("guarantee", guaranteeHours, s.ojt));
                        }
                    }
                    else {
                        let guaranteeHours = 8 - s.hoursDecimal;
                        shiftPay[day].push(new PayElement("guarantee", guaranteeHours, s.ojt));
                    }
                }
                //calulate excess hours overtime 
                if(s.hoursDecimal > 8) {
                    let overtimeHours = s.hoursDecimal - 8;
                    if(overtimeHours > 3) {
                        shiftPay[day].push(new PayElement("rost50", 3, s.ojt));
                        shiftPay[day].push(new PayElement("rost100", overtimeHours - 3, s.ojt));
                    }
                    else {
                        shiftPay[day].push(new PayElement("rost50", overtimeHours, s.ojt));
                    }
                    if(overtimeHours > 2) {
                        shiftPay[day].push(new PayElement("mealAllowance", 1));
                    }
                }
                //calculate excess shift overtime
                if(s.shiftWorkedNumber > 10){
                    shiftworkAllowanceEligible = false;
                    if(s.shiftWorkedNumber > 12) {
                        shiftPay[day].push(new PayElement("ot200", s.hoursDecimal, s.ojt));
                    }
                    else {
                        shiftPay[day].push(new PayElement("ot150", s.hoursDecimal, s.ojt));
                    }
                }
                //calculate shiftwork allowances
                if(shiftworkAllowanceEligible) {
                    let shiftworkHours = Math.round(s.hoursDecimal); //round to nearest whole hr as per EA
                    if(shiftworkHours > 8) shiftworkHours = 8;
                    if(s.startHour == 4 || (s.startHour == 5 && s.startMinute <= 30)) { //early shift
                        shiftPay[day].push(new PayElement("earlyShift", shiftworkHours));
                    }
                    if(s.startHour < 18 && (s.endHour48 > 18 || (s.endHour48 == 18 && s.endMinute >= 30))) { //afternoon shift
                        shiftPay[day].push(new PayElement("afternoonShift", shiftworkHours));
                    }
                    if((s.startHour >= 18 && s.startHour <= 23) || (s.startHour >= 0 && s.startHour <= 3)) { //night shift
                        shiftPay[day].push(new PayElement("nightShift", shiftworkHours));
                    }
                }
            }
        }
        if(getPayGrade() != "trainee" && s.shiftWorkedNumber > 0) { //suburban allowance
            shiftPay[day].push(new PayElement("metroSig2", 1));
        }
        if(s.wm) { //wasted meal
            shiftPay[day].push(new PayElement("mealAllowance", 1));
        }   
    }
}

function isWeekday(day) { //only for values 0-13. returns True outside of this range.
    switch(day) {
        case 0:
        case 6:
        case 7:
        case 13:
            return false;
        default:
            return true;
    }
}