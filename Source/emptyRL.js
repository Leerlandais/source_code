const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const completed = (msg) => {
    console.log(msg);
    rl.question('The process seems to have completed successfully - press Enter to close', () => {
        rl.close();
    });
};
rl.question("Enter the project name: ", function(projName) {
    try {

// everything else goes here


    }catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }

        completed("Setup completed successfully!");

});

// pkg Source/FILENAME.js --targets node18-win-x64 --output EXENAME.exe