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

rl.question("Enter the project name: ", function(project_name) {
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
    "morgan": "~1.9.1",
    "mysql": "^2.18.1"
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
            require ('dotenv').config();
            const connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT
            });
            connection.connect(function(err ) {
                if (err) throw err;
                console.log(\`Connected the the DB :  \${process.env.DB_NAME} !\`);
            });
            module.exports = connection;`
            ;
            fs.writeFileSync('db.js', mysqlFileContent);
            console.log('Created DB connection file.');

            process.chdir('..');

            const envContent = `
                DB_HOST: "localhost"
                DB_USER: "root"
                DB_PASSWORD: ""
                DB_NAME: "${dbName}"
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

            const newApp = `var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
require("./models/db.js");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
`
            fs.writeFileSync(`app.js`, newApp);

            completed("Setup completed successfully!");
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }
    });
});
// pkg Source/fullNodeSetup.js --targets node18-win-x64 --output fullNodeSetup.exe
