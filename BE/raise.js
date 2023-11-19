// A SCHEMA FOR EXAMS SCHEDULED FOR FUTURE: SUB AND TIME AND LT
// A SCHEMA FOR THE REQUESTS SENT: SUB, TIME, EXCEL SHEET LINK, TYPE? ANNOUNCE OR SCHEDULE

// UPON LOGIN OF A TEACHER, WHENEVER THE TEACHER TYPES IN THE TIME, THE FRONTEND CHECKS IN THE DB
// 1. IF THE TEACHER HAS SCHEDULED ONE ALREADY AS ONE REQUEST PER TEACHER UNTIL CONCLUDED
// 2. OR IF THE TIME SLOT IS BOOKED AND RETURN FOFF IF SO OR
// 3. IF SEATS ENOUGH (WRITE ITS FUNCTIONS WHICH SEES AVAILABLE COLLUMNS IN EXCEL SHEET OF LT)
// EACH SUB CAN HAVE ONLY ONE EXAM PER TIME AND NO REQUESTS UNTIL NEW OCCURRED.

// THE FRONTEND RECEIVES THE XLSX SHEET AND UPLOADS THEM TO GITHUB, THEN SEND THE DATA AS SCHEMA OBJECT TO BACKEND
// AND GETS STORED IN MONGODB

// ON OPENING THE ACCOUNT, THE ADMIN CAN VIEW ALL THE REQUESTS, THEN TAKE THE ACTION:
// 1. ANNOUNCEMENT: SEND EMAIL TO THE STUDENTS IN THE SHEET AFTER FETCHING IT, AND WRITE THE E-MAIL
// 2. CLICK ON THE SEATGEN FUNCTION AND SEND IT ALL AS EMAIL TO THE SAME STUDENTS.

// AFTER THE WORK IS DONE, IT DELETES THE SHEET FROM THE REPO, ADD TO CALENDAR, REMOVE FROM REQUESTS.
// THE NAME OF THE SHEET IS SUB_STUDENTS


const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const axios = require('axios');
const xlsx = require('xlsx')

// Replace with your GitHub personal access token
const token = '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';

// Create an Octokit instance with authentication
const octokit = new Octokit({
    auth: token,
});

// Replace with your GitHub username, repository name, and branch
const owner = 'Lakshyyaa';
const repo = 'emscdn';
const branch = 'main';


async function uploadSheet(filePath) {
    try {
        // Read the content of the file
        const fileContent = fs.readFileSync(filePath, 'base64');

        // Create or update a file in the repository
        const response = await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: 'files/' + filePath, // Replace with the desired path in your repository
            message: 'Upload file', // Commit message
            content: fileContent, // Convert content to base64
            branch,
        });
        console.log('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
}


// Function to delete a file from the repository
async function deleteSheet(sheetName) {
    try {
        // Get the current content of the file
        const existingFile = await octokit.repos.getContent({
            owner,
            repo,
            path: 'files/' + sheetName, // Adjust the path based on your repository structure
            ref: branch,
        });

        // Delete the file
        const response = await octokit.repos.deleteFile({
            owner,
            repo,
            path: 'files/' + sheetName,
            message: 'Delete file', // Commit message
            sha: existingFile.data.sha, // SHA of the existing file
            branch,
        });

        console.log('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error.message);
    }
}


// Example usage


// Function to fetch the content of a file
async function fetchSheet(filePath) {
    const url = `https://api.github.com/repos/Lakshyyaa/emscdn/contents/files/${filePath}`;

    try {
        const response = await axios.get(url);
        const base64Content = response.data.content;
        const fileBuffer = Buffer.from(base64Content, 'base64');
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(sheetData)
    } catch (error) {
        console.error('Error fetching sheet:', error.message);
        throw error;
    }
}


async function main() {
    // await uploadSheet('staff.xlsx');
    // await fetchSheet('staff.xlsx');
    // await deleteSheet('students.xlsx');
}

// Run the main function
main().catch((error) => console.error('Error:', error));
