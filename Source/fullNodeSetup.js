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
    rl.question("Enter the DB name: ", function(dbName) {
        try {
            console.log(`Creating the Node App: ${project_name}`);
            execSync(`express --view=ejs ${project_name}`, { stdio: 'inherit' });

            process.chdir(project_name);

            console.log(`Installing Dependencies`);
            execSync(`npm install`, { stdio: 'inherit' });

            if (process.platform === 'win32') {
                execSync(`set DEBUG=${project_name}:*`, { stdio: 'inherit' });
            } else {
                execSync(`export DEBUG=${project_name}:*`, { stdio: 'inherit' });
            }

            execSync(`npm install --save-dev nodemon`, { stdio: 'inherit' });
            execSync(`npm install mysql --save`, { stdio: 'inherit' });
            execSync(`npm install dotenv --save`, { stdio: 'inherit' });

            const pack_json = `{
  "name": "${project_name}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.4.5",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}`;
            fs.writeFileSync('package.json', pack_json);
            console.log('package.json has been rewritten.');

            fs.mkdirSync('models');
            process.chdir('models');

            const mysqlFileContent = `
            const mysql = require('mysql');
            require ('dotenv').config
            const connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT
            });
            connection.connect(function(err ) {
                if (err) throw err;
                console.log("Connected to the database connection");
            });
            module.exports = connection;`
            ;
            fs.writeFileSync('db.js', mysqlFileContent);
            console.log('Created DB connection file.');

            process.chdir('..');

            const envContent = `
                DB_HOST: "localhost",
                DB_USER: "root",
                DB_PASSWORD: "",
                DB_NAME: "${dbName}",
                DB_PORT: 3306`
            ;
            fs.writeFileSync('.env', envContent);
            console.log('DB configuration has been written to .env');

            const gitIgnore = `
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
config.php
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
/var/log/*.log
/node_modules/
/vendor/
/.pnp/
/.pnp.js
.env
.env.*
.env.local
.env.development.local
.env.production.local
.env.test.local
/build/
/dist/
/public/build/
/public/uploads/
/.next/
/out/
/cache/
/var/cache/*
/tmp/
/temp/
/coverage/
/nyc_output/
/.jest/
/.jest-test-results.json
/tests/bootstrap.php.cache
.phpunit.result.cache
.php_cs.cache
/node_repl_history
*.tsbuildinfo
.npm/
.yarn/
/bin/
/public/bundles/
`;
            fs.writeFileSync(`.gitignore`, gitIgnore);

            completed("Setup completed successfully!");
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }
    });
});
// pkg Source/fullNodeSetup.js --targets node18-win-x64 --output nodeSetup.exe
