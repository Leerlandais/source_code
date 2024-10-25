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
            console.log("Creating Symfony Webapp");
            // execSync(`symfony create --webapp ${projName}`, { stdio: 'inherit' });
            // process.chdir(`${projName}`);

            console.log("Creating Dockerfile");
            const dockFile = `FROM php:8.2-fpm

# Installer les extensions PDO et MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer APCu
RUN pecl install apcu && docker-php-ext-enable apcu

# Installer Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Configurer Xdebug
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \\
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \\
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \\
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \\
    && echo "xdebug.log=/tmp/xdebug.log" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Activer et configurer OPcache
RUN docker-php-ext-install opcache \\
    && echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/opcache.ini \\
    && echo "opcache.validate_timestamps=1" >> /usr/local/etc/php/conf.d/opcache.ini`

            fs.writeFileSync('Dockerfile', dockFile);

            console.log('Dockerfile creation complete');


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

