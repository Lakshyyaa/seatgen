// FOR SEAT ALLOCATION
// add two subject students? but need to add time and all
// have an lt database, with number of rows and collumns lt.xlsx
// have a staff database, with their name, dep, free/not staff.xlsx
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
// rows are from A-Z and collumns form 1-10
// ADD INVIGILATION IN IT TOO   

const xlsx = require('xlsx');
function gethseet()
// const workbook = xlsx.readFile('students.xlsx');

// const sheetName = workbook.SheetNames[0];
// const sheet = workbook.Sheets[sheetName];

// const sheetdata = xlsx.utils.sheet_to_json(sheet);

let subname = 'A'
let inputstudentlist = 'students.xlsx'

let studentlist=getsheet(inputstudentlist)