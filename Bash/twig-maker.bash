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
create_readme "$BASE_DIR/controller" \
              "$BASE_DIR/data" \
              "$BASE_DIR/model" \
              "$BASE_DIR/public" \
              "$BASE_DIR/public/images" \
              "$BASE_DIR/public/scripts" \
              "$BASE_DIR/public/styles" \
              "$BASE_DIR/view" \
              "$BASE_DIR/view/private" \
              "$BASE_DIR/view/public"


# Create the .gitignore
cat <<EOF > "$BASE_DIR/.gitignore"
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
EOF
cat <<EOC > "$BASE_DIR/config.php"
<?php
const PROJECT_DIRECTORY = __DIR__;
const PUB_DIR = __DIR__ . '/public/';
EOC
cat <<EOR > "$BASE_DIR/controller/routerController.php"
<?php
require_once PROJECT_DIRECTORY."/controller/publicController.php";
EOR
cat <<'EOP' > "$BASE_DIR/controller/publicController.php"
<?php
$route = $_GET['route'] ?? 'home';
switch ($route) {
  case 'home':
    echo $twig->render("publicView/public.index.html.twig");
    break;

  default:
    echo $twig->render("err404.html.twig");
}
EOP

cd "$BASE_DIR" && \



git init && \
git branch -m main && \
git add . && \
git commit -m "Folder Initialisation Complete - Leerlandais"
