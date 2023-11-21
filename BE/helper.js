// THE BELOW CODE IS FOR THE 3 FUNCTIONS: UPLOAD, FETCH AND DELETE XLSX TO GITHUB

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const axios = require('axios');
const xlsx = require('xlsx')
const token = process.env.GITHUB_TOKEN;
const octokit = new Octokit({
    auth: token,
});
const owner = 'Lakshyyaa';
const repo = 'emscdn';
const branch = 'main';


async function uploadSheet(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'base64');
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


async function deleteSheet(sheetName) {
    try {
        const existingFile = await octokit.repos.getContent({
            owner,
            repo,
            path: 'files/' + sheetName, // Adjust the path based on your repository structure
            ref: branch,
        });
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
        return sheetData
    } catch (error) {
        console.error('Error fetching sheet:', error.message);
        throw error;
    }
}
fetchSheet('staff.xlsx')