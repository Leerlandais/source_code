const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.question("Enter the database name (DB_NAME): ", function(dbName) {




rl.close();
});
