// // FOR SEAT ALLOCATION
// // add two subject students? but need to add time and all
// // have an lt database, with number of rows and collumns lt.xlsx
// // have a staff database, with their name, dep, free/not staff.xlsx
// // input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
// // rows are from A-Z and collumns form 1-10
// // ADD INVIGILATION IN IT TOO


// // const workbook = xlsx.readFile('students.xlsx');

// // const sheetName = workbook.SheetNames[0];
// // const sheet = workbook.Sheets[sheetName];

// // const sheetdata = xlsx.utils.sheet_to_json(sheet);

// const xlsx = require('xlsx');

// function getsheet(x) {
//     const workbook = xlsx.readFile(x);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const sheetdata = xlsx.utils.sheet_to_json(sheet);
//     return sheetdata
// }
// function addcollumn(sheetname, collumnname) {

// }


// let subname = 'A'
// let inputstudentlist = 'students.xlsx'
// let studentlist = getsheet(inputstudentlist)
// let numberofstudents = studentlist.length

// addcollumn(inputstudentlist, 'LT')
// // addcollumn(inputstudentlist, 'SEAT')
// let ltsheet = getsheet(inputstudentlist)
// console.log(ltsheet)


// // Assigning sheets from each lt from the ltsheet
// // for (let i = 0; i < ltsheet.length; i++) {
// //     var ltsize = ltsheet[i].ROW * ltsheet[i].COLLUMN
// //     while (ltsize > 0)
// //     {

// //     }
// // }

const xlsx = require('xlsx');

function getsheet(x) {
    const workbook = xlsx.readFile(x);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetdata = xlsx.utils.sheet_to_json(sheet);
    return sheetdata;
}

function addcollumn(sheetname, collumnname) {
    const workbook = xlsx.readFile(sheetname);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Find the last used column
    let lastCol = sheet['!ref'].split(':')[1];
    if (!lastCol) {
        lastCol = 'A';
    } else {
        lastCol = String.fromCharCode(lastCol.charCodeAt(0) + 1);
    }

    // Set the new column name
    sheet[lastCol + '1'] = { v: collumnname, t: 's' };

    // Update the sheet's range
    sheet['!ref'] = sheet['!ref'].split(':')[0] + ':' + lastCol + '1';

    // Save the modified workbook
    xlsx.writeFile(workbook, sheetname);
}

let subname = 'A';
let inputstudentlist = 'students.xlsx';
let studentlist = getsheet(inputstudentlist);
let numberofstudents = studentlist.length;

addcollumn(inputstudentlist, 'LT'); // Add the 'LT' column
addcollumn(inputstudentlist, 'SEAT'); // Add the 'SEAT' column

let ltsheet = getsheet(inputstudentlist);
console.log(ltsheet);
