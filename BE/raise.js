// A SCHEMA FOR EXAMS SCHEDULED FOR FUTURE: SUB AND TIME AND LT
// A SCHEMA FOR THE REQUESTS SENT: SUB, TIME, EXCEL SHEET LINK, TYPE? ANNOUNCE OR SCHEDULE

// UPON LOGIN OF A TEACHER, WHENEVER THE TEACHER TYPES IN THE TIME, THE FRONTEND CHECKS IN THE DB
// 1. IF THE TEACHER HAS SCHEDULED ONE ALREADY AS ONE REQUEST PER TEACHER UNTIL CONCLUDED
// 2. OR IF THE TIME SLOT IS BOOKED AND RETURN FOFF IF SO OR
// 3. IF SEATS ENOUGH (WRITE ITS FUNCTIONS WHICH SEES AVAILABLE COLLUMNS IN EXCEL SHEET OF LT) - W R I T E
// EACH SUB CAN HAVE ONLY ONE EXAM PER TIME AND NO REQUESTS UNTIL NEW OCCURRED.

// THE FRONTEND RECEIVES THE XLSX SHEET AND UPLOADS THEM TO GITHUB, THEN SEND THE DATA AS SCHEMA OBJECT TO BACKEND
// AND GETS STORED IN MONGODB - W R I T E

// ON OPENING THE ACCOUNT, THE ADMIN CAN VIEW ALL THE REQUESTS, THEN TAKE THE ACTION:
// 1. ANNOUNCEMENT: SEND EMAIL TO THE STUDENTS IN THE SHEET AFTER FETCHING IT, AND WRITE THE E-MAIL
// 2. CLICK ON THE SEATGEN FUNCTION AND SEND IT ALL AS EMAIL TO THE SAME STUDENTS.

// AFTER THE WORK IS DONE, IT DELETES THE SHEET FROM THE REPO, ADD TO CALENDAR, REMOVE FROM REQUESTS.
// THE NAME OF THE SHEET IS SUB_STUDENTS
// DO CTRL+F AND SEARCH FOR HALLS AND ADD LOGIC TO CALCULATE AND USE HALLS IN THE CODE BELOW MARK/UNMARK


// THE BELOW CODE IS FOR THE SCHEMA OF SCHEDULED EXAMS AND REQUESTS PENDING AND THEIR USE
const mongoose = require('mongoose')
const xlsx = require('xlsx')
const connectDB = require('./db.js');
const maxhalls = 17 // shweta maam told us that we can have halls uniform and equal, 
// though seatgen function works regardless, just counting seats will take time

const Schedule = mongoose.model('Schedule', {
    subject: String,
    start: Date,
    end: Date,
    halls: Number
});
const Request = mongoose.model('Request', {
    subject: String,
    start: Date,
    end: Date,
    link: String,
    type: String, // can be announce cancel, announce exam, announce view sheet
});

// FUNCTION TO PUT IN SCHEDULED
async function addToSchedule(subName, startTime, endTime, halls) {
    await connectDB()
    const newSchedule = new Schedule({
        subject: subName,
        start: startTime,
        end: endTime,
        halls: halls,
    });

    try {
        const result = await newSchedule.save();
        console.log('Schedule inserted:');
    } catch (error) {
        console.error('Error inserting schedule:', error);
    }
}
// FUNCTION TO PUT IN REQUESTS
async function addToRequests(subName, startTime, endTime, link, requestType, fileName) {
    if (checkSlot(subName, startTime, endTime, hallNeeded(fileName))) {
        // FIRST SEND AN APPROVED THING
        await connectDB()
        const newRequest = new Request({
            subject: subName,
            start: startTime,
            end: endTime,
            link: link,
            type: requestType,
        });

        try {
            const result = await newRequest.save();
            console.log('Request inserted:');
        } catch (error) {
            console.error('Error inserting request:', error);
        }
    }
    else {
        return // RETURN A DENIED THING WITH REASON
    }
}
// FUNCTION TO REMOVE FROM SCHEDULED
async function removeFromScheduled(subName) {
    await connectDB()
    try {
        const result = await Schedule.deleteOne({ subject: subName });
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted schedule with subject: ${subName}`);
        } else {
            console.log(`No schedule found with subject: ${subName}`);
        }
    } catch (error) {
        console.error('Error removing schedule:', error);
    }
}
// FUNCTION TO REMOVE FROM REQUESTS
async function removeFromRequests(subName) {
    await connectDB()
    try {
        const result = await Request.deleteOne({ subject: subName });
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted schedule with subject: ${subName}`);
        } else {
            console.log(`No schedule found with subject: ${subName}`);
        }
    } catch (error) {
        console.error('Error removing schedule:', error);
    }
}

// WRITE CODE TO CHECK AND CALL WHICH FOR WHICH

// first check if any subject has happened and needs to be removed by looking at current time
async function checkSlot(subName, start, end, reqHalls) {
    let approve = 1;
    await connectDB()
    // check the sub in requests, if present, deny and even for time clashes - W R I T E  I T  H E R E
    try {
        const requests = await Request.find({})
        if (requests.length > 0) {
            console.log('1212')
        }
        else {
            console.log('12')
        }
        // const existingRequest = await Request.findOne({ subject: subName });
        // if (existingRequest) {
        //     console.log(`A request for ${subName} already exists.`);
        //     approve = 0 // return 0 for deny 1 for approved
        // } else {
        //     console.log(`No request found for ${subName}.`);
        // }
    } catch (error) {
        console.error('Error checking slot:', error);
    }
    // check the sub in scheduled, if time clashes and lt not available cancel
    try {
        const existingSchedule = await Schedule.find({ subject: subName });
        if (existingSchedule.length > 0) {
            let halls = reqHalls;
            existingSchedule.forEach(s => {
                halls += s.halls
                if (halls + 5 > maxhalls) {  // Always keeping a buffer of 5 halls.
                    approve = 0  // as enough halls not left
                }
                if ((s.start > start && s.start < end) || (s.end > start && s.end < end)) {
                    approve = 0; // as it overlapped with an existing schedule
                }
            })
        } else {
            console.log(`No schedule found for ${subName}.`);
        }
    } catch (error) {
        console.error('Error checking slot:', error);
    }
    return approve; // all checks passed
}

function hallNeeded(fileName) {
    const hallSize = 100;
    const workbook = xlsx.readFile(fileName);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = xlsx.utils.sheet_to_json(sheet);
    console.log(sheetData.length);
    return Math.ceil(sheetData.length / hallSize);;
}

// WRITE CODE FOR THE MOMENT LOGS IN AND THE REQUESTS AND SCHEDULED STUFF ARE SHOWN/FETCHED IN THE FRONTEND

// WHENEVER SOMETHING REMOVED FROM SCHEDULED, FREE THE HALLS IN THE DB


// const a = new Date(2023, 10, 20, 12, 30, 0)
// const b = new Date(2023, 10, 20, 12, 45, 0)
// const c = new Date(2023, 10, 20, 12, 50, 0)
// addToRequests('CN', a, b, 'as', 'cancel')
// addToRequests('CN', a, c, 'as', 'cancel')

// USER SENDS REQ,
// 1. CHECK IF REQ SECTION FULL HAS ONE, IF IT HAS, DENY
// 2. CHECK IF THE REQ HAS ENOUGH TIME OR SLOT, IF NOT, FOFF THEN
// 2. WHEN THE ADMIN LOGS IN, HE WILL PUSH REQ TO SCHEDULED AFTER USING THE SEATGEN/OTHER FUNCTIONS, AND DELETE
// ITS XLSX FILE
// 3. IF THE REQUEST IS TO CANCEL, CHECK IF EXAM HAPPENDED, ELSE REMOVE IT.
// 4. KEEP CHECKING TIME IF EXAM PASSED, REMOVE IT FOM THE SCHEDULE.

// WRITE THE ABOVE CODE AND WRITE FOR THE WHEN USER ACTUALLY HITS THE BUTTON TO SCHEDULE ONE