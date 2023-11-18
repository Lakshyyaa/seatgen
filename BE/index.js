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
// Return false if not enough teachers availabe or if calendar is filled.
async function invigilation(newdata, subname) {
    await connectDB()
    const Teacher = mongoose.model('Teacher', {
        name: String,
        subject: String,
        free: Number,
    });
    let teachers = await Teacher.find();
    const numofteachers = teachers.length
    let i = 0
    let j = 0;
    let teachersnotfree=[]
    for (const element of newdata) {
        if (i % 20 == 0) {
            while (j < numofteachers && (teachers[j].subject == subname || teachers[j].free == 0)) {
                j++
                console.log('j increased.')
            }
            if (j >= numofteachers) {
                // write code to return denial of request as no teacher available
                // return 0;
                // return right thing, to let user know what error/right thing has happend
                break;
                // putting break right now as i want it to work even for less teachers
            }

            teachersnotfree.push(teachers[j]._id)
            teachers[j].free = 0;
            element.INVI = teachers[j].name
        }
        else {
            element.INVI = teachers[j].name
        }
        i++;
    }
    // below code updated the teachers to not free
    try{
        await Teacher.updateMany({ _id: { $in: teachersnotfree } }, { $set: { free: 0 } });
        console.log('updated db')
    }
    catch(err)
    {
        console.error(err)
    }
    writetosheet(newdata, subname)
    return 1;
    // return right thing, to let user know what error/right thing has happend
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
    // return right thing, to let user know what error/right thing has happend
    return 1;
}


// The function below writes to sheet we want the data we want
function writetosheet(newdata, subname) {
    try {
        const wb = xlsx.utils.book_new();
        const ws_name = "Sheet1";
        // Convert the array of objects to a worksheet
        const ws = xlsx.utils.json_to_sheet(newdata);
        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(wb, ws, ws_name);
        // Write the workbook to a file
        xlsx.writeFile(wb, `${subname}arrangement.xlsx`);
        console.log('File written successfully.');
        // return right thing, to let user know what error/right thing has happend
        return 1;
    } catch (error) {
        console.error('Error writing to file:', error);
        // return right thing, to let user know what error/right thing has happend
        return 0;
    }
}

let subname = 'A' // will come from frontend
let inputstudentlist = 'students.xlsx' // will come from frontend
let ltsheetname = 'lt.xlsx' // will be stored in backend
seatgen(subname, inputstudentlist, ltsheetname);
