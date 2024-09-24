const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("What would you like to do?\n1. Setup a forked project\n2. Create a React/TW project\n3. Create a React/BS project\n4. Create a Node project\n5. Create a Node with DB\n6. Create an empty MVC\n", (choice) => {
    if (choice === '1') {
        setupForkedProject();
    } else if (choice === '2') {
        createReactAppWithTailwind();
    } else if (choice === '3') {
        createReactAppWithBootstrap();
    } else if (choice === '4') {
        createNodeApp();
    } else if (choice === '5') {
        createNodeAppWithDB();
    } else if (choice === '6') {
        createMVC();
    } else {
        console.log("Invalid option");
        rl.close();
    }
});

function setupForkedProject (){

    rl.question("Copy the URL of YOUR fork here: ", function(repoUrl) {
        const project_name = path.basename(repoUrl, '.git');

        rl.question("Enter the database name (DB_NAME): ", function(dbName) {

            try {
                console.log(`Cloning the repository from ${repoUrl}...`);
                execSync(`git clone ${repoUrl}`, { stdio: 'inherit' });

                process.chdir(project_name);

                const upstreamUrl = `https://github.com/Leerlandais/${project_name}.git`;
                console.log(`Adding upstream remote: ${upstreamUrl}...`);
                execSync(`git remote add upstream ${upstreamUrl}`, { stdio: 'inherit' });

                console.log(`Installing composer dependencies...`);
                execSync(`composer install`, { stdio: 'inherit' });

                console.log(`Updating composer dependencies...`);
                execSync(`composer update`, { stdio: 'inherit' });

                const configContent = `
<?php
const DB_DRIVER = "mysql";
const DB_HOST = "localhost";
const DB_LOGIN = "root";
const DB_PWD = "";
const DB_NAME = "${dbName}";  
const DB_PORT = 3306;
const DB_CHARSET = "utf8mb4";

const PROJECT_DIRECTORY = __DIR__;
`;
                console.log(`Writing config.php with DB_NAME: ${dbName}...`);
                fs.writeFileSync('config.php', configContent);

                console.log('Setup complete!');

            } catch (error) {
                console.error(`Error occurred: ${error.message}`);
            }

            rl.close();
        });
    });
}

function createReactAppWithTailwind() {
    rl.question("Enter the project name: ", function(projName) {
        const project_name = projName.toLowerCase();
        try{
            console.log(`Creating the React App :  ${project_name}`);
            execSync(`npx create-react-app ${project_name}`, { stdio: 'inherit' });

            process.chdir(project_name);

            console.log(`Installing Tailwind`);
            execSync(`npm install -D tailwindcss`, { stdio: 'inherit' });
            // execSync(`npx tailwindcss init`, { stdio: 'inherit' });
            const cssAttributes = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`;

            const originalCss = fs.readFileSync('src/index.css', 'utf8');

            fs.writeFileSync('src/index.css', cssAttributes + originalCss);
            const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
            fs.writeFileSync('tailwind.config.js', tailwindConfig);

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }

        rl.close();
    });
}

function createReactAppWithBootstrap(){
    rl.question("Enter the project name: ", function(projName) {
        const project_name = projName.toLowerCase();
        try{
            console.log(`Creating the React App :  ${project_name}`);
            execSync(`npx create-react-app ${project_name}`, { stdio: 'inherit' });

            process.chdir(project_name);

            console.log(`Installing Bootstrap`);
            execSync(`npm install bootstrap`, { stdio: 'inherit' });
            const bootstrapImports = `import "bootstrap/dist/css/bootstrap.min.css";\nimport "bootstrap/dist/js/bootstrap.bundle.min";\n`;

            const originalJs = fs.readFileSync('src/index.js', 'utf8');

            fs.writeFileSync('src/index.js', bootstrapImports + originalJs);

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }

        rl.close();
    });
}

function createNodeApp() {
    rl.question("Enter the project name: ", function(projName) {
        const project_name = projName.toLowerCase();
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

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }

        rl.close();
    });
}

function createNodeAppWithDB(){
    rl.question("Enter the project name: ", function(projName) {
        rl.question("Enter the DB name: ", function(dbName) {
            const project_name = projName.toLowerCase();  // project_name, use this consistently
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
const dbConfig = require('../config/dbConfig.js');
const connection = mysql.createConnection({
    host: dbConfig.DB_HOST,
    user: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    port: dbConfig.DB_PORT
});
connection.connect(function(err ) {
    if (err) throw err;
    console.log("Connected to the database connection");
});
module.exports = connection;
`;
                fs.writeFileSync('db.js', mysqlFileContent);
                console.log('Created DB connection file.');

                process.chdir('..');
                fs.mkdirSync('config');
                process.chdir('config');

                const dbConfigContent = `
module.exports = {
    DB_HOST: "localhost",
    DB_USER: "root",
    DB_PASSWORD: "",
    DB_NAME: "${dbName}",
    DB_PORT: 3306
};
`;
                fs.writeFileSync('dbConfig.js', dbConfigContent);
                console.log('DB configuration has been written to dbConfig.js.');

            } catch (error) {
                console.error(`Error occurred: ${error.message}`);
            }

            rl.close();
        });
    });
}

function createMVC() {

    rl.question("Enter the project name: ", function(projName) {
        try {
            // Create all directories under the project name
            fs.mkdirSync(`${projName}`);
            fs.mkdirSync(`${projName}/controller`);
            fs.mkdirSync(`${projName}/data`);
            fs.mkdirSync(`${projName}/model`);
            fs.mkdirSync(`${projName}/public`);
            fs.mkdirSync(`${projName}/view`);
            fs.mkdirSync(`${projName}/public/images`);
            fs.mkdirSync(`${projName}/public/scripts`);
            fs.mkdirSync(`${projName}/public/styles`);
            fs.mkdirSync(`${projName}/view/private`);
            fs.mkdirSync(`${projName}/view/public`);

            function createReadmeInFolders(folders) {
                folders.forEach(folder => {
                    try {
                        if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
                            const folderName = path.basename(folder);
                            const readmeContent = `# Placeholder for ${folderName}`;

                            fs.writeFileSync(path.join(folder, 'README.md'), readmeContent);
                            console.log(`Created README.md in ${folder}`);
                        }
                    } catch (error) {
                        console.error(`Error processing folder ${folder}: ${error.message}`);
                    }
                });
            }

            createReadmeInFolders([
                `${projName}/controller`,
                `${projName}/data`,
                `${projName}/model`,
                `${projName}/public`,
                `${projName}/public/images`,
                `${projName}/public/scripts`,
                `${projName}/public/styles`,
                `${projName}/view`,
                `${projName}/view/private`,
                `${projName}/view/public`
            ]);

            const extIndex = `
            <?php
            header("Location: public");
            die();
            `;
            fs.writeFileSync(`${projName}/index.php`, extIndex);

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
            fs.writeFileSync(`${projName}/.gitignore`, gitIgnore);
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }

        rl.close();
    });

}
