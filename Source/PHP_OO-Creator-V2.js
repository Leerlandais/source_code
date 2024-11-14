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

rl.question("Enter the project name : ", function(projName) {
    rl.question("Enter the database name (DB_NAME): ", function(dbName) {
        rl.question("MariaDb or Mysql : (default: 3306) ", function(dbPortal) {
            const dbPort = dbPortal || 3306;
            rl.question("Enter Git Repository URL to automatically create remote address (default: no) ", function(git) {
                const gitRep = git || false;


                try {
                    // Create all directories under the project name
                //    fs.mkdirSync(`${projName}`);
                    fs.mkdirSync(`${projName}/Controllers`);
                    fs.mkdirSync(`${projName}/data`);
                    fs.mkdirSync(`${projName}/model`);
                    fs.mkdirSync(`${projName}/model/Abstract`);
                    fs.mkdirSync(`${projName}/model/Interface`);
                    fs.mkdirSync(`${projName}/model/Manager`);
                    fs.mkdirSync(`${projName}/model/Mapping`);
                    fs.mkdirSync(`${projName}/model/Trait`);
                    fs.mkdirSync(`${projName}/public`);
                    fs.mkdirSync(`${projName}/view`);
                    fs.mkdirSync(`${projName}/public/images`);
                    fs.mkdirSync(`${projName}/public/scripts`);
                    fs.mkdirSync(`${projName}/public/styles`);
                    fs.mkdirSync(`${projName}/view/private`);
                    fs.mkdirSync(`${projName}/view/public`);
                    fs.mkdirSync(`${projName}/routing`);

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
                        `${projName}/Controllers`,
                        `${projName}/data`,
                        `${projName}/model`,
                        `${projName}/model/Abstract`,
                        `${projName}/model/Interface`,
                        `${projName}/model/Manager`,
                        `${projName}/model/Mapping`,
                        `${projName}/model/Trait`,
                        `${projName}/public`,
                        `${projName}/public/images`,
                        `${projName}/public/scripts`,
                        `${projName}/public/styles`,
                        `${projName}/view`,
                        `${projName}/view/private`,
                        `${projName}/view/public`,
                        `${projName}/routing`
                    ]);

                    const extIndex = `
            <?php
            header("Location: public");
            die();
            `;
                    fs.writeFileSync(`${projName}/index.php`, extIndex);

                    const gitIgnore = `
.idea/
config.php
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
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

                try {

                    // ...base.twig
                    const baseTwig = `
<\!DOCTYPE html>
<html lang="{% block lang %}fr{% endblock %}">
<head>
    {% block head %}
        {% block meta %}
        {% endblock %}
        <title>{% block title %}Title{% endblock %}</title>
        {% block stylesheet %}{% endblock %}
    {% endblock %}
</head>
<body class={% block bodyClass %}{% endblock %}>{% block body %}

{% block navBar %}
    {% block connectBtn %} {% endblock %}
{% endblock %}

{% block content %}
    {% block hero %}
        {% block heroText %}{% endblock %}
        {% block heroImg  %}{% endblock %}
    {% endblock %}

    {% block sectionOne %}{% endblock %} {# Change these names as needed #}
    {% block sectionTwo %}{% endblock %}
    {% block sectionThree %}{% endblock %}


{% endblock %}

{% block footer %}{% endblock %}

{% block javascript %}{% endblock %}

</body> {% endblock %}
</html>`;
                    fs.writeFileSync(`${projName}/view/base.html.twig`, baseTwig);

                    // template.twig
                    const tempTwig = `{% extends 'base.html.twig' %}   
        `;
                    fs.writeFileSync(`${projName}/view/template.html.twig`, tempTwig);

                    // homepage.twig
                    const homeTwig = `{% extends 'template.html.twig' %}   
{% block hero %}If you can see this, all is good{% endblock %}
        `;
                    fs.writeFileSync(`${projName}/view/public/public.index.html.twig`, homeTwig);


                } catch (error) {
                    console.error(`Error occurred: ${error.message}`);
                }

                try {
                    const cfgFile = `
    <?php
const DB_DRIVER = "mysql";
const DB_HOST = "localhost";
const DB_LOGIN = "root";
const DB_PWD = "";
const DB_NAME = "${dbName}";
const DB_PORT = ${dbPort};
const DB_CHARSET = "utf8mb4";

const PROJECT_DIRECTORY = __DIR__;
const PUB_DIR = __DIR__ . '/public/';
`;

                    fs.writeFileSync(`${projName}/config.php`, cfgFile);


                    const pubIndex = `
<?php
session_start();

if (isset($_SESSION["activity"]) && time() - $_SESSION["activity"] > 1800) {
    session_unset();
    session_destroy();
    header("location: ./");
    exit();
}
$_SESSION["activity"] = time();

if (isset($_SESSION["errorMessage"])) {
    $errorMessage = $_SESSION["errorMessage"];
    unset($_SESSION["errorMessage"]);
}else {
    $errorMessage = "";
}

use Twig\\Loader\\FilesystemLoader;
use Twig\\Environment;
use model\\MyPDO;

require_once "../config.php";

spl_autoload_register(function ($class) {
  $class = str_replace('\\\\', '/', $class);
  require PROJECT_DIRECTORY.'/' .$class . '.php';
});

require_once PROJECT_DIRECTORY.'/vendor/autoload.php';

$loader = new FilesystemLoader(PROJECT_DIRECTORY.'/view/');

// Dev version
$twig = new Environment($loader, [
  'debug' => true,
]);
$twig->addExtension(new \\Twig\\Extension\\DebugExtension());
/*
$twig->addGlobal('PUBLIC_DIR', PUB_DIR);
$twig->addGlobal('PROJECT_DIR', PROJECT_DIRECTORY);
*/
/*
// Prod version
$twig = new Environment($loader, [
   'cache' => '../cache/Twig',
   'debug' => false,
]);
// no DebugExtension online
*/


try {
   $db = MyPDO::getInstance(DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=" . DB_CHARSET,
       DB_LOGIN,
       DB_PWD);
   $db->setAttribute(MyPDO::ATTR_ERRMODE, MyPDO::ERRMODE_EXCEPTION);
   $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
}catch (Exception $e){
   die($e->getMessage());
}

require_once PROJECT_DIRECTORY . '/Routing/Routes.php';
 $db = null;   
        `;
                    fs.writeFileSync(`${projName}/public/index.php`, pubIndex);

                    const pdo = `<?php

namespace model;

use PDO;
use Exception;
use PDOStatement;

class MyPDO extends PDO
{

    private static ?MyPDO $instance = null;

    private function __construct($dsn, $username = null, $password = null, $options = null)
    {
        parent::__construct($dsn, $username, $password, $options);
    }

    public static function getInstance($dsn, $username = null, $password = null, $options = null): MyPDO
    {
        if (self::$instance === null) {
            try {
                self::$instance = new MyPDO($dsn, $username, $password, $options);
            } catch (Exception $e) {
                die("Erreur de connexion : " . $e->getMessage());
            }
        }
        return self::$instance;
    }


}`;
                    fs.writeFileSync(`${projName}/model/MyPDO.php`, pdo);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }

                try {
                    const absMan = `<?php

namespace model\\Abstract;
use model\\MyPDO;

abstract class AbstractManager {
    protected MyPDO $db;

    public function __construct(MyPDO $db) {
        $this->db = $db;
    }
}`;
                    fs.writeFileSync(`${projName}/model/Abstract/AbstractManager.php`, absMan);

                    const absMap = `<?php

namespace model\\Abstract;
abstract class AbstractMapping
{

    public function __construct(array $tab)
    {

        $this->hydrate($tab);
    }

    protected function hydrate(array $assoc): void
    {
        foreach ($assoc as $key => $value) {
            $tab = explode("_", $key);
            $majuscule = array_map('ucfirst',$tab);
            $newNameCamelCase = implode($majuscule);
            $methodeName = "set" . $newNameCamelCase;

            if (method_exists($this, $methodeName)) {
                $this->$methodeName($value);
            }
        }
    }

}`

                    fs.writeFileSync(`${projName}/model/Abstract/AbstractMapping.php`, absMap);


                    const laundry = `<?php

namespace model\\Trait;


Trait TraitLaundryRoom {


   protected function standardClean($cleanThis): string
    {
        return htmlspecialchars(strip_tags(trim($cleanThis)));
    }

   protected function simpleTrim($trimThis): string
    {
        return trim($trimThis);
    }

   protected function urlClean($cleanThisUrl): string
    {
        return filter_var($cleanThisUrl, FILTER_SANITIZE_URL);
    }

   protected function intClean($cleanThisInt): int
    {
        $cleanedInt = filter_var($cleanThisInt, FILTER_SANITIZE_NUMBER_INT,
            FILTER_FLAG_ALLOW_FRACTION
        );
        $cleanedInt = intval($cleanedInt);
        return $cleanedInt;
    }

   protected function floatClean($cleanThisFloat): float
    {
        $cleanedFloat = filter_var($cleanThisFloat, FILTER_SANITIZE_NUMBER_FLOAT,
            FILTER_FLAG_ALLOW_FRACTION,
        );
        $cleanedFloat = floatval($cleanedFloat);
        return $cleanedFloat;
    }

   protected function emailClean($cleanThisEmail): string
    {
        return filter_var($cleanThisEmail, FILTER_SANITIZE_EMAIL);
    }

   protected function findTheNeedles($hay): bool
    {
        $needles = ["<script>",
            "<iframe>",
            "<object>",
            "<embed>",
            "<form>",
            "<input>",
            "<textarea>",
            "<select>",
            "<button>",
            "<link>",
            "<meta>",
            "<style>",
            "<svg>",
            "<base>",
            "<applet>",
            "script",
            "'click'",
            '"click"',
            "onclick",
            "onload",
            'onerror',
            'src'];

        foreach ($needles as $needle) {
            if (str_contains($hay, $needle)) {
                return true;
            }
        }
        return false;
    }
}`;
                    fs.writeFileSync(`${projName}/model/Trait/TraitLaundryRoom.php`, laundry);

         const int = `<?php

namespace model\\Trait;

trait TraitTestInt
{
    protected function verifyInt ($testThis, $min = 0, $max = PHP_INT_MAX) : bool{
        if ($testThis < $min || $testThis > $max) return false;
        return true;
    }
}`;

                    fs.writeFileSync(`${projName}/model/Trait/TraitIntegerTest.php`, int);

                    const str = `<?php

namespace model\\Trait;

trait TraitStringTest
{
    protected function verifyString (?string $testThis) : bool {
        if (empty($testThis)) return false;
        return true;
    }
}`;

                    fs.writeFileSync(`${projName}/model/Trait/TraitStringTest.php`, str);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }

                try {
                const router = `<?php

namespace Routing;

use model\\MyPDO;
use Twig\\Environment;

class Router
{
    private array $routes = [];
    private Environment $twig;

    private MyPDO $db;

    public function __construct(Environment $twig, MyPDO $db)
    {
        $this->twig = $twig;

        $this->db = $db;
    }

    public function registerRoute(string $routeName, string $controllerClass, string $methodName): void
    {
        $this->routes[$routeName] = [
            'controller' => $controllerClass,
            'method' => $methodName
        ];
    }

    public function handleRequest($route): void
    {
        if (!isset($this->routes[$route])) {
            $route = '404';
        }

        $controllerClass = $this->routes[$route]['controller'];
        $method = $this->routes[$route]['method'];

        $controller = new $controllerClass($this->twig, $this->db);

        $controller->$method();
    }
}
`
                    fs.writeFileSync(`${projName}/routing/Router.php`, router);

                const routes = `<?php



use Controllers\\HomeController;

use Routing\\Router;

$router = new Router($twig,$db);

// Register routes
$router->registerRoute('home', HomeController::class, 'index');

// Handle request
$route = $_GET['route'] ?? 'home'; // use the usual method to set the default page
$router->handleRequest($route);`

                    fs.writeFileSync(`${projName}/routing/Routes.php`, routes);

                const homeCont = `<?php

namespace Controllers;

class HomeController extends AbstractController{

    public function index() {
    global $sessionRole, $errorMessage;


        echo $this->twig->render("public/public.index.html.twig", [
            'sessionRole' => $sessionRole,
            'errorMessage' => $errorMessage,

        ]);
    }


}
`;
                fs.writeFileSync(`${projName}/Controllers/HomeController.php`, homeCont);

                const absCont = `<?php

namespace Controllers;


use model\\MyPDO;
use Twig\\Environment;

// As with Manager and Mapping, the Controllers have lots of shared needs, so Abstract to keep it DRY

abstract class AbstractController
{
    protected $twig;

    protected MyPDO $db;
    public function __construct(Environment $twig, MyPDO $db)
    {
        $this->twig = $twig;

        $this->db = $db;
    }
}
`
                    fs.writeFileSync(`${projName}/Controllers/AbstractController.php`, absCont);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }


                try {
                    process.chdir(`${projName}`);
                    execSync(`composer require "twig/twig:^3.0"`, {stdio: 'inherit'});
                    // add git and create the glory commit
                  //  execSync(`git init`, {stdio: 'inherit'});
                  //  execSync(`git branch -m main`, {stdio: 'inherit'});
                    execSync(`git add .`, {stdio: 'inherit'});
                    execSync(`git commit -m "Setup completed by Leerlandais"`, {stdio: 'inherit'});
                    if (gitRep) {
                        execSync(`git remote add origin ${gitRep}`, {stdio: "inherit"});
                        execSync('git push -u origin main', {stdio: "inherit"});
                    }


                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }

                completed(" - All done!");

            });
        });
    });
});

// pkg Source/PHP_OO-Creator-V2.js --targets node18-win-x64 --output ObjectProjMaker-V2.exe