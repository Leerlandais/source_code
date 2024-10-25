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
rl.question("Enter the project name: ", function(proj) {
    const projName = proj || "test";
        console.log(`Project name is: ${projName}`);
    rl.question("Enter the database name: ", function(db) {
        const dbName = db || "db_default";
            console.log(`Database name is: ${dbName}`);
        rl.question("Enter the nginx port (8080:80): ", function(ng) {
            const ngPort = ng || "8080:80";
                console.log(`nginx port is: ${ngPort}`);
            rl.question("Enter the mysql port (3308:3306): ", function(my) {
                const myPort = my || "3308:3306";
                    console.log(`mysql port is: ${myPort}`);
                rl.question("Enter the phpmyadmin port (8081:80): ", function(php) {
                    const phpPort = php || "8081:80";
                        console.log(`phpmyadmin port is: ${phpPort}`);
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

