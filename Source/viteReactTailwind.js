// project to be completed soon

function createReactAppWithTailwind() {
    const readline = require('readline');
    const { execSync } = require('child_process');
    const fs = require('fs');
    const path = require('path');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


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
