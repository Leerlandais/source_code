# CREATES A STANDARD MVC FOLDER SETUP COMPLETE WITH ENTRY INDEX.PHP AND .GITIGNORE

read -p "Enter the project name: " BASE_DIR

# Use default name 'MyProject' if no input is given
BASE_DIR=${BASE_DIR:-MyProject}

# Create the main project directory
mkdir -p "$BASE_DIR"

# Create external folders
mkdir -p "$BASE_DIR/controller"
mkdir -p "$BASE_DIR/data"
mkdir -p "$BASE_DIR/model"
mkdir -p "$BASE_DIR/public"
mkdir -p "$BASE_DIR/view"

# Create internal folders inside the 'public' folder
mkdir -p "$BASE_DIR/public/images"
mkdir -p "$BASE_DIR/public/scripts"
mkdir -p "$BASE_DIR/public/styles"

# Create internal folders inside the 'view' folder
mkdir -p "$BASE_DIR/view/private"
mkdir -p "$BASE_DIR/view/public"

# Create external index.php with tidy formatting
echo -e "<?php\nheader(\"Location: public\");\ndie();" > "$BASE_DIR/index.php"


# Function to create README.md placeholder if a folder is empty
create_readme() {
    for folder in "$@"; do
        if [ -d "$folder" ] && [ -z "$(ls -A "$folder")" ]; then
    echo "# Placeholder for $(basename "$folder")" > "$folder/README.md"
    fi
    done
}

# Call the function for all created folders
create_readme "$BASE_DIR/data" \
              "$BASE_DIR/model" \
              "$BASE_DIR/public" \
              "$BASE_DIR/public/images" \
              "$BASE_DIR/public/scripts" \
              "$BASE_DIR/public/styles" \
              "$BASE_DIR/view/private"


# Create the .gitignore
cat <<EOGIT > "$BASE_DIR/.gitignore"
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
EOGIT

# Create the config file
cat <<EOCON > "$BASE_DIR/config.php"
<?php
const PROJECT_DIRECTORY = __DIR__;
const PUB_DIR = __DIR__ . '/public/';
EOCON

# Create the routeCont - not really necessary but included to allow easier expansion
cat <<EORTE > "$BASE_DIR/controller/routerController.php"
<?php
require_once PROJECT_DIRECTORY."/controller/publicController.php";
EORTE

# Create the pubCont
cat <<'EOPUB' > "$BASE_DIR/controller/publicController.php"
<?php
$route = $_GET['route'] ?? 'home';
switch ($route) {
  case 'home':
    echo $twig->render("public/public.index.html.twig");
    break;

  default:
    echo $twig->render("err404.html.twig");
}
EOPUB

# Create an empty base.twig (comment just to add a placeholder)
cat <<'EOBASE' > "$BASE_DIR/view/base.html.twig"
{# The Base Twig #}
EOBASE

# Create the template and add the extend from base.twig
cat <<'EOTEMP' > "$BASE_DIR/view/template.html.twig"
{% extends 'base.html.twig' %}
EOTEMP

# Create the homepageTwig in the public folder and add the extend from template.twig
cat <<'EOHOME' > "$BASE_DIR/view/public/public.index.html.twig"
{% extends 'template.html.twig' %}
EOHOME

# Create the really large index.php to take care of loading Twig etc
cat <<'EOINDEX' > "$BASE_DIR/public/index.php"
<?php
use Twig\Loader\FilesystemLoader;
use Twig\Environment;

require_once "../config.php";

spl_autoload_register(function ($class) {
  $class = str_replace('\\', '/', $class);
  require PROJECT_DIRECTORY.'/' .$class . '.php';
});

require_once PROJECT_DIRECTORY.'/vendor/autoload.php';

$loader = new FilesystemLoader(PROJECT_DIRECTORY.'/view/');

// Dev version
$twig = new Environment($loader, [
  'debug' => true,
]);
$twig->addExtension(new \Twig\Extension\DebugExtension());

$twig->addGlobal('PUBLIC_DIR', PUB_DIR);
$twig->addGlobal('PROJECT_DIR', PROJECT_DIRECTORY);

/*
// Prod version
$twig = new Environment($loader, [
   'cache' => '../cache/Twig',
   'debug' => false,
]);
// no DebugExtension online
*/


/* NO DB FOR THIS PROJECT (AT THE CURRENT TIME)
try {
   $db = MyPDO::getInstance(DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=" . DB_CHARSET,
       DB_LOGIN,
       DB_PWD);
   $db->setAttribute(MyPDO::ATTR_ERRMODE, MyPDO::ERRMODE_EXCEPTION);
   $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
}catch (Exception $e){
   die($e->getMessage());
}

*/
require_once PROJECT_DIRECTORY.'/controller/routerController.php';

// $db = null;
EOINDEX

cd "$BASE_DIR" && \

composer require "twig/twig:^3.0"

git init && \
git branch -m main && \
git add . && \
git commit -m "Folder Initialisation Complete - Leerlandais"
