// FOR SEAT ALLOCATION
// add two subject students? but need to add time and all
// have an lt database, with number of rows and collumns lt.xlsx
// have a staff database, with their name, dep, free/not staff.xlsx
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
// rows are from A-Z and collumns form 1-10
// ADD INVIGILATION IN IT TOO, test case if free teachers not found


// const workbook = xlsx.readFile('students.xlsx');

// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// const sheetdata = xlsx.utils.sheet_to_json(sheet);

const xlsx = require('xlsx');
const fs = require('fs');

function getsheet(x) {
    const workbook = xlsx.readFile(x);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetdata = xlsx.utils.sheet_to_json(sheet);
    return sheetdata
}

// The code below generates diagonal seating plan for each lt and writes to an excel sheet having subject name
// It stores the object json in newdata array first then writes to the xlsx sheet in the end

let subname = 'A' // will come from frontend
let inputstudentlist = 'students.xlsx' // will come from frontend
let studentlist = getsheet(inputstudentlist)
let numberofstudents = studentlist.length
let ltsheet = getsheet('lt.xlsx') // will be stored in backend
let stafflist=getsheet('staff.xlsx');
let newdata = []

// delete the Aarrangement file
fs.unlink(`${subname}` + 'arrangement.xlsx', (err) => {
    if (err) {
        console.error(`Error deleting file: ${err}`);
    } else {
        console.log(`lol has been deleted.`);
    }
});

var studentindex = 0;
var teacherindex=0
for (let i = 0; i < ltsheet.length; i++) {
    var rowsoflt = ltsheet[i].ROW
    var row = 1;
    while (studentindex < numberofstudents && row <= rowsoflt) {
        var collumnsoflt = ltsheet[i].COLLUMN
        var collumn = (row - 1) % 3 + 1
        while (studentindex < numberofstudents && collumn <= collumnsoflt) {
            if (studentindex % 2 == 0) 
            {
                // traverse until a free teacher found and he not of dep A
                while(stafflist[teacherindex].FREE==0 || stafflist[teacherindex].DEP==subname)
                {
                    teacherindex++;
                }
            }
            studentlist[studentindex].LT = ltsheet[i].LT
            studentlist[studentindex].SEAT = row + '' + String.fromCharCode(collumn + 64)
            studentlist[studentindex].INVIGILATOR = stafflist[teacherindex].NAME
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
const wb = xlsx.utils.book_new();
const ws_name = "Sheet1";

// Convert the array of objects to a worksheet
const ws = xlsx.utils.json_to_sheet(newdata);

// Add the worksheet to the workbook
xlsx.utils.book_append_sheet(wb, ws, ws_name);

// Write the workbook to a file
xlsx.writeFile(wb, `${subname}`+'arrangement.xlsx');
