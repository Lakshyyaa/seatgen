// FOR SEAT ALLOCATION
// add two subject students? but need to add time and all
// have an lt database, with number of rows and collumns lt.xlsx
// have a staff database, with their name, dep, free/not in mongodb
// input the subject name and student list xlsx sheet, which will be returned with seats, mail or download
// rows are from A-Z and collumns form 1-10
// ADD INVIGILATION IN IT TOO, test case if free teachers not found


const xlsx = require('xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./db.js');


// The function below fetches the sheet and returns its json to be processed from further
function getsheet(x) {
    const workbook = xlsx.readFile(x);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetdata = xlsx.utils.sheet_to_json(sheet);
    return sheetdata
}


// The function below does the invigilationgen and is called in the seatgen function
async function invigilation(newdata, subname) {
    await connectDB()
    const Teacher = mongoose.model('Teacher', {
        name: String,
        subject: String,
        free: Number,
    });
    const teachers = await Teacher.find();
    let i = 0
    let j = 0;
    for (const element of newdata) {
        if (i % 20 == 0) {
            while (teachers[j].subject == subname || teachers[j].free == 0) {
                j++
            }
            await Teacher.updateOne({ _id: teachers[j]._id }, { $set: { free: 0 } })
            element.INVI = teachers[j].name
        }
        else {
            element.INVI = teachers[j].name
        }
        i++;
    }
    writetosheet(newdata, subname)
}


// The function below generates diagonal seating plan for each lt and writes to an excel sheet having subject name
// It stores the object json in newdata array first then writes to the xlsx sheet in the end
function seatgen(subname, inputstudentlist, ltsheetname) {
    // delete the Aarrangement file, just to refresh
    fs.unlink(`${subname}` + 'arrangement.xlsx', (err) => {
        if (err) {
            console.error(`Error deleting arrangement file: ${err}`);
        } else {
            console.log(`arrangement has been deleted.`);
        }
    });

    // main function starts from here
    let studentlist = getsheet(inputstudentlist)
    let numberofstudents = studentlist.length
    let ltsheet = getsheet(ltsheetname)
    let newdata = []
    var studentindex = 0;
    for (let i = 0; i < ltsheet.length; i++) {
        var rowsoflt = ltsheet[i].ROW
        var row = 1
        while (studentindex < numberofstudents && row <= rowsoflt) {
            var collumnsoflt = ltsheet[i].COLLUMN
            var collumn = (row - 1) % 3 + 1
            while (studentindex < numberofstudents && collumn <= collumnsoflt) {
                // can add the logic here for invigilation
                studentlist[studentindex].LT = ltsheet[i].LT
                studentlist[studentindex].SEAT = row + '' + String.fromCharCode(collumn + 64)
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
    invigilation(newdata, subname);
}


// The function below writes to sheet we want the data we want
function writetosheet(newdata, subname) {
    const wb = xlsx.utils.book_new();
    const ws_name = "Sheet1";
    // Convert the array of objects to a worksheet
    const ws = xlsx.utils.json_to_sheet(newdata);
    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, ws_name);
    // Write the workbook to a file
    xlsx.writeFile(wb, `${subname}` + 'arrangement.xlsx');
}

let subname = 'A' // will come from frontend
let inputstudentlist = 'students.xlsx' // will come from frontend
let ltsheetname = 'lt.xlsx' // will be stored in backend
seatgen(subname, inputstudentlist, ltsheetname);
