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

    // Define the new column name in the header row
    const headerCell = `${collumnname}1`;
    sheet[headerCell] = { t: 's', v: columnName };

    // If you want to add data to the new column, loop through your data array and update the cells.
    // For example, if you have an array of data in `columnData`:
    // for (let i = 0; i < columnData.length; i++) {
    //   const cell = `${columnName}${i + 2}`; // Start from the second row (assuming header is in the first row)
    //   sheet[cell] = { t: 's', v: columnData[i] };
    // }

    // Write the updated workbook back to the same file
    xlsx.writeFile(workbook, sheetname);
}


let subname = 'A'
let inputstudentlist = 'students.xlsx'
let studentlist = getsheet(inputstudentlist)
let numberofstudents = studentlist.length

addcollumn(inputstudentlist, 'LT')
// addcollumn(inputstudentlist, 'SEAT')
let ltsheet = getsheet(inputstudentlist)
console.log(ltsheet)


// Assigning sheets from each lt from the ltsheet
// for (let i = 0; i < ltsheet.length; i++) {
//     var ltsize = ltsheet[i].ROW * ltsheet[i].COLLUMN
//     while (ltsize > 0)
//     {

//     }
// }
