// FOR SEAT ALLOCATION
// add two subject students? but need to add time and all
// have an lt database, with number of rows and collumns lt.xlsx
// have a staff database, with their name, dep, free/not staff.xlsx
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
// rows are from A-Z and collumns form 1-10
// ADD INVIGILATION IN IT TOO


// const workbook = xlsx.readFile('students.xlsx');

// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// const sheetdata = xlsx.utils.sheet_to_json(sheet);

const xlsx = require('xlsx');

function getsheet(x) {
    const workbook = xlsx.readFile(x);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetdata = xlsx.utils.sheet_to_json(sheet);
    return sheetdata
}
function addcollumn(sheetname, collumnname) {
    const workbook = xlsx.readFile(sheetname);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
}


let subname = 'A'
let inputstudentlist = 'students.xlsx'
let studentlist = getsheet(inputstudentlist)
let numberofstudents = studentlist.length

// addcollumn(inputstudentlist, 'LT')
// addcollumn(inputstudentlist, 'SEAT')
let ltsheet = getsheet('lt.xlsx')
let newdata = []

var studentindex = 0;
for (let i = 0; i < ltsheet.length; i++) {
    var rowsoflt = ltsheet[i].ROW
    var row = 1;
    while (studentindex < numberofstudents && row <= rowsoflt) {
        var collumnsoflt = ltsheet[i].COLLUMN
        var collumn = (row - 1) % 3 + 1
        while (studentindex < numberofstudents && collumn <= collumnsoflt) {
            studentlist[studentindex].LT = ltsheet[i].LT
            studentlist[studentindex].SEAT = row + '' + String.fromCharCode(collumn + 64)
            // console.log(studentlist[studentindex]);
            newdata.push(studentlist[studentindex])
            studentindex++
            collumn = collumn + 2;
        }
        row++;
    }
    if (studentindex >= numberofstudents) {
        break;
    }
}
// console.log(newdata)
const wb = xlsx.utils.book_new();
const ws_name = "Sheet1";

// Convert the array of objects to a worksheet
const ws = xlsx.utils.json_to_sheet(newdata);

// Add the worksheet to the workbook
xlsx.utils.book_append_sheet(wb, ws, ws_name);

// Write the workbook to a file
xlsx.writeFile(wb, 'output.xlsx');
// Assigning sheets from each lt from the ltsheet
// for (let i = 0; i < ltsheet.length; i++) {
//     var ltsize = ltsheet[i].ROW * ltsheet[i].COLLUMN
//     while (ltsize > 0)
//     {

//     }
// }
