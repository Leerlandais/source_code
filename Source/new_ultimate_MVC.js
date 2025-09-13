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
        rl.question("MariaDb or Mysql : (default: 3307 (Maria)) ", function(dbPortal) {
            const dbPort = dbPortal || 3307;
            rl.question("Enter Git Repository URL to automatically create remote address (default: no) ", function(git) {
                const gitRep = git || false;


                try {
                    // Create all directories under the project name
                    fs.mkdirSync(`${projName}`);
                    fs.mkdirSync(`${projName}/Controllers`);
                    fs.mkdirSync(`${projName}/Controllers/Abstract`);
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
                        `${projName}/view/public`
                    ]);

                    const extIndex = `<?php
    header("Location: public");
    die();
            `;
                    fs.writeFileSync(`${projName}/index.php`, extIndex);

                    const gitIgnore = `.idea/
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
                    const baseTwig = `<\!DOCTYPE html>
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
{% block dumpZone %}{% endblock %}
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
                    const cfgFile = `<?php
const DB_DRIVER = "mysql";
const DB_HOST = "localhost";
const DB_LOGIN = "root";
const DB_PWD = "";
const DB_NAME = "${dbName}";
const DB_PORT = ${dbPort};
const DB_CHARSET = "utf8mb4";
const PROJECT_DIRECTORY = __DIR__;
const PUB_DIR = '/public/';
const IMG_DIR = '/public/images';
`;

                    fs.writeFileSync(`${projName}/config.php`, cfgFile);


                    const pubIndex = `<?php
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

// // Prod version
// $twig = new Environment($loader, [
//    'cache' => '../cache/Twig',
//    'debug' => false,
// ]);
// // no DebugExtension online

$twig->addGlobal('PUB_DIR', PUB_DIR);
$twig->addGlobal('PROJ_DIR', PROJECT_DIRECTORY);
$twig->addGlobal('IMG_DIR', IMG_DIR);

$db = \\Controllers\\DbConnectionController::DbConnection();
require_once PROJECT_DIRECTORY . '/Controllers/RouteController.php';
$db = null;`;
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

                    const DbConnection = `<?php

namespace Controllers;

use Exception;
use model\\MyPDO;
use PDO;

class DbConnectionController extends Abstract\\AbstractController
{
 public static function dbConnection(): MyPDO
 {
     try {
         $db = MyPDO::getInstance(DB_DRIVER . ":host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=" . DB_CHARSET,
             DB_LOGIN,
             DB_PWD);
         $db->setAttribute(MyPDO::ATTR_ERRMODE, MyPDO::ERRMODE_EXCEPTION);
         $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
     }catch (Exception $e){
         $this->exceptionManager->handleExceptionInANiceWay($e->getCode(), $e->getMessage());
     }
     return $db;
 }
}`
                    fs.writeFileSync(`${projName}/Controllers/DbConnectionController.php`, DbConnection);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }

                try {
                    const absMan = `<?php

namespace model\\Abstract;

use model\\MyPDO;
use Twig\\Environment;

abstract class AbstractManager
{
    protected MyPDO $db;
    protected Environment $twig;

    public function __construct(MyPDO $db, Environment $twig)
    {
        $this->db = $db;
        $this->twig = $twig;
    }
        public function insertAnything(array $data): bool
    {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        $stmt = $this->db->prepare("INSERT INTO \`DB_NAME\` ($columns) VALUES ($placeholders)");
        $stmt->execute($data);
        if ($stmt->rowCount() === 0) return false;
        return true;

    }
        public function updateAnything(int $id, array $data): bool
    {
        $dataSet = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($data)));
        $stmt = $this->db->prepare("UPDATE \`DB_NAME\` SET $dataSet WHERE \`FIELD_ID_NAME\` = :id");
        $stmt->execute(array_merge($data, ["id" => $id]));
        if ($stmt->rowCount() === 0) return false;
        return true;
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
        return htmlspecialchars(strip_tags(trim($cleanThis)), ENT_QUOTES);
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
trait TraitIntTest
{
    protected function verifyInt ($testThis, $min = 0, $max = PHP_INT_MAX) : bool{
        if ($testThis < $min || $testThis > $max) return false;
        return true;
    }
}`;

                    fs.writeFileSync(`${projName}/model/Trait/TraitIntTest.php`, int);

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

namespace model\\Manager;

use model\\MyPDO;
use Twig\\Environment;

class RouteManager
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

                $params = $_GET ?? [];
        if (!empty($params)) {
            $controller->$method($params);
        } else {
            $controller->$method(null);
        }
    }
}
`
                    fs.writeFileSync(`${projName}/model/Manager/RouteManager.php`, router);

                    const routes = `<?php
namespace Controllers;
use    model\\Manager\\RouteManager;


$router = new RouteManager($twig,$db);

// Register routes
$router->registerRoute('home', HomeController::class, 'index');

// Handle request
$route = $_GET['route'] ?? 'home'; // use the usual method to set the default page
$router->handleRequest($route);`

                    fs.writeFileSync(`${projName}/Controllers/RouteController.php`, routes);

                    const homeCont = `<?php

namespace Controllers;

use Controllers\\Abstract\\AbstractController;

class HomeController extends AbstractController{

    public function index($getParams) {
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

namespace Controllers\\Abstract;

use model\\Manager\\ExceptionManager;
use model\\MyPDO;
use Twig\\Environment;
use model\\Trait\\TraitLaundryRoom, model\\Trait\\TraitStringTest, model\\Trait\\TraitIntTest;


// Have moved my sanisation to here. Previously it was in AbstractMapping

abstract class AbstractController
{
    use TraitLaundryRoom, TraitStringTest, TraitIntTest;
    protected $twig;
    protected MyPDO $db;
    protected ExceptionManager $exceptionManager;
    public function __construct(Environment $twig, MyPDO $db)
    {
        $this->twig = $twig;
        $this->db = $db;
        $this->exceptionManager = new ExceptionManager($db, $twig);
    }

    protected function parsePostData(array $postData): array
    /*
     * Receives an array containing all $_POST data sent by the form
     * Each entry is made up of key:value
     * The key shows what type of input was expected (int, string, etc)
     * These are then separated and returned as, for example :
     * "user_email" = ["type" => "email","value" => "lee@leerlandais.com"]
     */
    {
        $result = [];
        foreach ($postData as $key => $value) {
            if (str_contains($key, ':')) {
                list($type, $name) = explode(':', $key, 2);
            } else {
                $type = 'str';
                $name = $key;
            }

            $result[$name] = ["type" =>$type,"value" => $value];
        }
        return $result;
    }

    protected function testAndClean(array $cleanThis, $origin): string|int|null
    {
        /*
         * Receives an array of data, normally generated by the parsePostData function
         * Switches through the 'type' of data received (email, string, int, etc)
         * Tests if data conforms to expected type (int or string)
         * Performs necessary sanitisation for data using my usual TraitLaundryRoom
         * Returns the sanitised data
         */
        if(empty($cleanThis)) return null;
        switch($cleanThis["type"]) {
            case "int":
                if(!$this->verifyInt($cleanThis["value"])) {
                    $this->exceptionManager->handleExceptionInANiceWay(__FUNCTION__, $cleanThis, $origin);
                    die();
                }
                return $this->intClean($cleanThis["value"]);
            case "str":
            case "phone":
                if(!$this->verifyString($cleanThis["value"])) {
                    $this->exceptionManager->handleExceptionInANiceWay(__FUNCTION__, $cleanThis, $origin);
                    die();
                }
                if($this->findTheNeedles($cleanThis["value"])) {
                    $this->exceptionManager->handlePossibleInjectionAttempt(__FUNCTION__, $cleanThis, $origin);
                }
                return $this->standardClean($cleanThis["value"]);
            case "json":
                if(!$this->verifyString($cleanThis["value"])) {
                    $this->exceptionManager->handleExceptionInANiceWay(__FUNCTION__, $cleanThis, $origin);
                    die();
                }
                if($this->findTheNeedles($cleanThis["value"])) {
                    $this->exceptionManager->handlePossibleInjectionAttempt(__FUNCTION__, $cleanThis, $origin);
                }
                return $this->jsonClean($cleanThis["value"]);
            case "email":
                if(!$this->verifyString($cleanThis["value"])) {
                    $this->exceptionManager->handleExceptionInANiceWay(__FUNCTION__, $cleanThis, $origin);
                }
                if($this->findTheNeedles($cleanThis["value"])) {
                    $this->exceptionManager->handlePossibleInjectionAttempt(__FUNCTION__, $cleanThis, $origin);
                }
                return $this->emailClean($cleanThis["value"]);
            case "password":
                if(!$this->verifyString($cleanThis["value"])) {
                    $this->exceptionManager->handleExceptionInANiceWay(__FUNCTION__, $cleanThis, $origin);
                }
                if($this->findTheNeedles($cleanThis["value"])) {
                    $this->exceptionManager->handlePossibleInjectionAttempt(__FUNCTION__, $cleanThis, $origin);
                }
                return $this->simpleTrim($cleanThis["value"]);
        }

        return $cleanThis["value"];
    }
}
`
                    fs.writeFileSync(`${projName}/Controllers/Abstract/AbstractController.php`, absCont);

                } catch (error) {
                    console.log(`Error occurred: ${error.message}`);
                }
                const exceptionManager = `<?php

namespace model\\Manager;

use model\\Abstract\\AbstractManager;

class ExceptionManager extends AbstractManager
{
    public function handleExceptionInANiceWay(string $functionName, array $data, string $origin = null)
    {
        echo "Input error caused by :";
        die(var_dump(["function" => $functionName, "data" => $data, "origin" => $origin]));
    }

    public function handlePossibleInjectionAttempt(string $functionName, array $data, string $origin = null)
    {
        echo "Possible Injection Attempt: ";
        die(var_dump(["function" => $functionName, "data" => $data, "origin" => $origin]));
    }
}`;
                fs.writeFileSync(`${projName}/model/manager/ExceptionManager.php`, exceptionManager);
                try{

                }catch(error){
                    console.log(`Error occurred: ${error.message}`);
                }


                try {
                    process.chdir(`${projName}`);
                    let composerAvailable = false;
                    try {
                        execSync('composer --version', { stdio: 'ignore' });
                        composerAvailable = true;
                    } catch {
                        console.log('Composer not found. Skipping Twig installation.');
                    }

                    if (composerAvailable) {
                        execSync(`composer require "twig/twig:^3.0"`, { stdio: 'inherit' });
                    }
                    execSync(`git init`, {stdio: 'inherit'});
                    execSync(`git branch -m main`, {stdio: 'inherit'});
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

// pkg Source/new_ultimate_MVC.js --targets node18-win-x64 --output NEWER_Ultimate_MVC_Creator.exe