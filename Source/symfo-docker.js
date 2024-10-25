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
    rl.question("Enter the database name (DB_NAME): ", function(dbName) {
        rl.question("Enter the nginx port (e.g. 8080:80): ", function(ngPort) {
            rl.question("Enter the mysql port (e.g. 3308:3306): ", function(myPort) {
                rl.question("Enter the phpmyadmin port (e.g. 8081:80): ", function(phpPort) {
        try {


        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }

        completed("Setup completed successfully!");
                }); // end phpmyadmin question
            }); // end mysql question
        }); // end nginx question
    }); // end db_name question
}); // end proj_name question

// pkg Source/symfo-docker.js --targets node18-win-x64 --output symfoDocker.exe