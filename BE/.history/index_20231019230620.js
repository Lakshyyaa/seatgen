// for seat allocation
// have an lt database, with number of rows and collumns
// have a teachers database, with their dep, free/not
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
const xlsx = require('xlsx');
const workbook = xlsx.readFile('lt.xlsx');

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json(sheet);

// console.log(jsonData);
console.log(jsonData);
