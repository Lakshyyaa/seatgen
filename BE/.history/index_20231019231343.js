// FOR SEAT ALLOCATION
// have an lt database, with number of rows and collumns lt.xlsx
// have a teachers database, with their name, dep, free/not (let it also be an xlsx) staff.xlsx
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download

const xlsx = require('xlsx');
const workbook = xlsx.readFile('lt.xlsx');

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const sheetdata = xlsx.utils.sheet_to_json(sheet);

console.log(sheetdata);
