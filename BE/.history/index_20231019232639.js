// FOR SEAT ALLOCATION
// have an lt database, with number of rows and collumns lt.xlsx
// have a staff database, with their name, dep, free/not staff.xlsx
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download

const xlsx = require('xlsx');
const workbook = xlsx.readFile('students.xlsx');

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const sheetdata = xlsx.utils.sheet_to_json(sheet);

let subname=