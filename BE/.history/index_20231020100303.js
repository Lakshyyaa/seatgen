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
let ltsheet = getsheet(inputstudentlist)
let newdata=[]
for(let i=0;i<ltsheet.length;i++)
{
    ltsheet[i].OK='qq'
    ltsheet[i].OL='qq'
    // console.log(ltsheet[i])
}
console.log(ltsheet)
// Assigning sheets from each lt from the ltsheet
// for (let i = 0; i < ltsheet.length; i++) {
//     var ltsize = ltsheet[i].ROW * ltsheet[i].COLLUMN
//     while (ltsize > 0)
//     {

//     }
// }
