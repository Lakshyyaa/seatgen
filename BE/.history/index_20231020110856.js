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
for (let i = 0; i < ltsheet.length / 10; i++) {
    var rowsoflt = ltsheet[i].ROW
    var row = 1;
    while (row <= rowsoflt) {
        var collumnsoflt = ltsheet[i].COLLUMN
        var collumn = (row+3) % 3;
        while (collumn <= collumnsoflt) {
            studentlist[studentindex].LT = ltsheet[i].LT
            studentlist[studentindex].SEAT = row + '' + collumn
            console.log(studentlist[studentindex]);
            studentindex++
            collumn = collumn + 2;
        }
        row++;
    }
}
// console.log(newdata)
// Assigning sheets from each lt from the ltsheet
// for (let i = 0; i < ltsheet.length; i++) {
//     var ltsize = ltsheet[i].ROW * ltsheet[i].COLLUMN
//     while (ltsize > 0)
//     {

//     }
// }
