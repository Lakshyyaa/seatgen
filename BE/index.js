const xlsx = require('xlsx');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./db.js');

function fetchSheet(x) {
    const workbook = xlsx.readFile(x);
    const sheetName = workbook.SheetNames[0];   
    const sheet = workbook.Sheets[sheetName];
    const sheetData = xlsx.utils.sheet_to_json(sheet);
    return sheetData;
}

async function invigilationGen(newData, subName) {
    await connectDB();
    const Teacher = mongoose.model('Teacher', {
        name: String,
        subject: String,
        free: Number,
    });
    let teachers = await Teacher.find();
    const numOfTeachers = teachers.length;
    let i = 0;
    let j = 0;
    let teachersNotFree = [];

    for (const element of newData) {
        if (i % 20 == 0) {
            while (j < numOfTeachers && (teachers[j].subject == subName || teachers[j].free == 0)) {
                j++;
                console.log('j increased.');
            }
            if (j >= numOfTeachers) {
                // write code to return denial of request as no teacher available
                // return 0;
                // return right thing, to let the user know what error/right thing has happened
                break;
                // putting break right now as I want it to work even for fewer teachers
            }

            teachersNotFree.push(teachers[j]._id);
            teachers[j].free = 0;
            element.INVI = teachers[j].name;
        } else {
            element.INVI = teachers[j].name;
        }
        i++;
    }

    // below code updates the teachers to not free
    try {
        await Teacher.updateMany({ _id: { $in: teachersNotFree } }, { $set: { free: 0 } });
        console.log('updated db');
    } catch (err) {
        console.error(err);
    }
    writeToSheet(newData, subName);
    return 1;
    // return the right thing, to let the user know what error/right thing has happened
}

function seatGen(subName, inputStudentList, ltSheetName) {
    // delete the arrangement file, just to refresh
    fs.unlink(`${subName}` + 'arrangement.xlsx', (err) => {
        if (err) {
            console.error(`Error deleting arrangement file: ${err}`);
        } else {
            console.log(`arrangement has been deleted.`);
        }
    });

    // main function starts from here
    let studentList = fetchSheet(inputStudentList);
    let numberOfStudents = studentList.length;
    let ltSheet = fetchSheet(ltSheetName);
    // HERE WE SEE IF ENOUGH SEATS AVAILABLE TO SEND A BIG FOFF
    // BUT REMEMBER TO ADD AN AVAILABLE COLUMN TO IT AS WELL 0/1
    // THAT WILL BE CHANGED JUST LIKE THE TEACHERDB IN THE END OF THIS FUNCTION.
    let newData = [];
    var studentIndex = 0;

    for (let i = 0; i < ltSheet.length; i++) {
        var rowsOfLt = ltSheet[i].ROW;
        var row = 1;

        while (studentIndex < numberOfStudents && row <= rowsOfLt) {
            var collumnsOfLt = ltSheet[i].COLLUMN;
            var collumn = (row - 1) % 3 + 1;

            while (studentIndex < numberOfStudents && collumn <= collumnsOfLt) {
                // can add the logic here for invigilation
                studentList[studentIndex].LT = ltSheet[i].LT;
                studentList[studentIndex].SEAT = row + '' + String.fromCharCode(collumn + 64);
                newData.push(studentList[studentIndex]);
                studentIndex++;
                collumn = collumn + 2;
            }
            row++;
        }
        if (studentIndex >= numberOfStudents) {
            break;
        }
    }

    invigilationGen(newData, subName);
    // return the right thing, to let the user know what error/right thing has happened
    return 1;
}

// The function below writes to the sheet we want the data we want
function writeToSheet(newData, subName) {
    try {
        const wb = xlsx.utils.book_new();
        const wsName = "Sheet1";
        // Convert the array of objects to a worksheet
        const ws = xlsx.utils.json_to_sheet(newData);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(wb, ws, wsName);
        // Write the workbook to a file
        xlsx.writeFile(wb, `${subName}arrangement.xlsx`);
        console.log('File written successfully.');
        // return the right thing, to let the user know what error/right thing has happened
        return 1;
    } catch (error) {
        console.error('Error writing to file:', error);
        // return the right thing, to let the user know what error/right thing has happened
        return 0;
    }
}

let subName = 'A'; // will come from frontend
let inputStudentList = 'students.xlsx'; // will come from frontend
let ltSheetName = 'lt.xlsx'; // will be stored in backend
seatGen(subName, inputStudentList, ltSheetName);
