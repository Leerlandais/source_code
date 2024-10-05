
read -p "Enter the Project Name: " PROJ_NAME
read -p "Copy the URL of YOUR fork here: " FORK_DIR
read -p "Enter the database name: " DB_NAME

git clone "$FORK_DIR" && \
cd "$PROJ_NAME" && \
echo "$DB_NAME"

