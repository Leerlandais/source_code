const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



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

        // create the config

        // and routeCont

        // and pubCount....

        // ...base.twig

        // template.twig

        // homepage.twig

        // and the big index

        // run composer (make sure I'm in the folder)

        // add git and create the glory commit

        rl.close();
    });


