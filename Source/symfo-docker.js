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
    const projName = proj || "symfony";
        console.log(`Project name is: ${projName}`);
    rl.question("Enter the database name: ", function(db) {
        const dbName = db || "symfony";
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
                    rl.question("Enter Git Repository URL to automatically create remote address (default: no) ", function(git) {
                        const gitRep = git || false;
                        if(gitRep) {
                            console.log(`Project will be pushed to: ${gitRep}`);
                        }
        try {
            console.log("Creating Symfony Webapp");
            execSync(`symfony new ${projName} --version=lts --webapp`, { stdio: 'inherit' });
            process.chdir(`${projName}`);
            execSync('symfony server:ca:install')

            console.log("Creating Dockerfile");
            const dockFile = `FROM php:8.2-fpm

# Installer les extensions PDO et MySQL
RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer APCu
RUN pecl install apcu && docker-php-ext-enable apcu

# Installer Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Install Git cos I'm an addict and can't be anywhere without it
RUN apt-get update && apt-get install -y git

# Created .bashrc to set up an alias for php bin/yadayada (I'm sick of typing that :-D)
RUN echo "alias lee='php bin/console'" >> /root/.bashrc
RUN echo "alias cr='composer require'" >> /root/.bashrc
RUN echo "alias ci='composer require'" >> /root/.bashrc

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

            fs.writeFileSync('Dockerfile.bak', dockFile);

            console.log('Dockerfile creation complete');

            console.log('Beginning creation of nginx file');
            fs.mkdirSync('nginx');
            process.chdir('nginx');
            const ngFile = `server {
    listen 80;
    server_name localhost;

    root /var/www/html/public;
    index index.php index.html index.htm;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ \\.php$ {
        # include snippets/fastcgi-php.conf;
        fastcgi_pass php:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
}`
        fs.writeFileSync(`default.conf`, ngFile);
        console.log("nginx folder and default.conf created")

            process.chdir('..');


        console.log("Creating docker-compose");
        const dockComp = `
services:
  php:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./:/var/www/html

    networks:
      - symfony-network

  nginx:
    image: nginx:latest
    volumes:
      - ./:/var/www/html
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "${ngPort}"
    networks:
      - symfony-network
    depends_on:
      - php

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT}
      MYSQL_DATABASE: \${MYSQL_DB}
      MYSQL_USER: \${MYSQL_USER}
      MYSQL_PASSWORD: \${MYSQL_PASS}
    ports:
      - "${myPort}"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - symfony-network

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: \${PMA_HOST}
      MYSQL_USER: \${PMA_USER}
      MYSQL_PASSWORD: \${PMA_PASS}
    ports:
      - "${phpPort}"
    networks:
      - symfony-network

volumes:
  mysql-data:

networks:
  symfony-network:


`
        fs.writeFileSync('docker-compose.yaml.bak', dockComp);
        console.log('Docker-compose.yaml created');

        console.log('Beginning creation of .env file for Symfony');
        const env = `# In all environments, the following files are loaded if they exist,
# the latter taking precedence over the former:
#
#  * .env                contains default values for the environment variables needed by the app
#  * .env.local          uncommitted file with local overrides
#  * .env.$APP_ENV       committed environment-specific defaults
#  * .env.$APP_ENV.local uncommitted environment-specific overrides
#
# Real environment variables win over .env files.
#
# DO NOT DEFINE PRODUCTION SECRETS IN THIS FILE NOR IN ANY OTHER COMMITTED FILES.
# https://symfony.com/doc/current/configuration/secrets.html
#
# Run "composer dump-env prod" to compile .env files for production use (requires symfony/flex >=1.2).
# https://symfony.com/doc/current/best_practices.html#use-environment-variables-for-infrastructure-configuration

###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=6639ee7c63b4c0ccbacb295990261ac3
###< symfony/framework-bundle ###

MYSQL_ROOT=root
MYSQL_DB=${dbName}
MYSQL_USER=user
MYSQL_PASS=password
PMA_HOST=mysql
PMA_USER=user
PMA_PASS=password

###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
DATABASE_URL="mysql://root:@127.0.0.1:3306/${dbName}?serverVersion=8.0.32&charset=utf8mb4"
# DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
###< doctrine/doctrine-bundle ###

###> symfony/messenger ###
# Choose one of the transports below
# MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages
# MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###

###> symfony/mailer ###
# MAILER_DSN=null://null
###< symfony/mailer ###`
            fs.writeFileSync('.env', env);
        console.log("env file created");

            console.log('Beginning creation of .env file for Docker');
            const envDock = `# In all environments, the following files are loaded if they exist,
# the latter taking precedence over the former:
#
#  * .env                contains default values for the environment variables needed by the app
#  * .env.local          uncommitted file with local overrides
#  * .env.$APP_ENV       committed environment-specific defaults
#  * .env.$APP_ENV.local uncommitted environment-specific overrides
#
# Real environment variables win over .env files.
#
# DO NOT DEFINE PRODUCTION SECRETS IN THIS FILE NOR IN ANY OTHER COMMITTED FILES.
# https://symfony.com/doc/current/configuration/secrets.html
#
# Run "composer dump-env prod" to compile .env files for production use (requires symfony/flex >=1.2).
# https://symfony.com/doc/current/best_practices.html#use-environment-variables-for-infrastructure-configuration

###> symfony/framework-bundle ###
APP_ENV=dev
APP_SECRET=6639ee7c63b4c0ccbacb295990261ac3
###< symfony/framework-bundle ###

MYSQL_ROOT=root
MYSQL_DB=${dbName}
MYSQL_USER=user
MYSQL_PASS=password
PMA_HOST=mysql
PMA_USER=user
PMA_PASS=password

###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
DATABASE_URL="mysql://\${PMA_USER}:\${PMA_PASS}@\${PMA_HOST}:3306/${dbName}?serverVersion=8.0.32&charset=utf8mb4"
# DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
###< doctrine/doctrine-bundle ###

###> symfony/messenger ###
# Choose one of the transports below
# MESSENGER_TRANSPORT_DSN=amqp://guest:guest@localhost:5672/%2f/messages
# MESSENGER_TRANSPORT_DSN=redis://localhost:6379/messages
MESSENGER_TRANSPORT_DSN=doctrine://default?auto_setup=0
###< symfony/messenger ###

###> symfony/mailer ###
# MAILER_DSN=null://null
###< symfony/mailer ###`
            fs.writeFileSync('.env.bak', envDock);
            console.log("env file created");


        execSync('git branch -m main');
        execSync('git add .');
        execSync('git commit -m "project setup automated by https://leerlandais.com"');

/*
            console.log("deleting unnecessary files");
            fs.unlink('compose.yaml', (err) => {
                if (err) throw err;
            });
            fs.unlink('compose.override.yaml', (err) => {
                if (err) throw err;
            });
*/
        if(gitRep) {
            execSync(`git remote add origin ${gitRep}`, {stdio : "inherit"});
            execSync('git push -u origin main', {stdio : "inherit"});
        }

        completed("Setup completed successfully!");

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }
                    }); // end git question
                }); // end phpmyadmin question
            }); // end mysql question
        }); // end nginx question
    }); // end db_name question
}); // end proj_name question

// pkg Source/symfo-docker.js --targets node18-win-x64 --output symfoDocker.exe

