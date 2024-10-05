https://github.com/Leerlandais/source_code.git


read -p "Copy the URL of YOUR fork here: " FORK_DIR
PROJ_NAME=$(basename "$FORK_DIR" .git)
echo 'The project will be called:' $PROJ_NAME && \
read -p "Enter the database name: " DB_NAME


echo 'Cloning the repository' && \
git clone "$FORK_DIR" && \
echo 'Cloning Complete' && \
cd "$PROJ_NAME" && \

UPSTR_URL="https://github.com/Leerlandais/$PROJ_NAME.git"
echo "Adding Upstream address as :" $UPSTR_URL && \
git remote add upstream "$UPSTR_URL" && \
echo "Upstream Remote Added"
