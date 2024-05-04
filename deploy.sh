#!/bin/bash

set -e # Stop if any error occurs

echo -e "\nPushing local changes to the main branch..."
git push

echo -e "\nSwitching to gh-pages branch..."
git checkout gh-pages

echo -e "\nMerging main into gh-pages..."
git merge main -m "Merge main into gh-pages"

echo -e "\nCleaning and building new changes..."
make clean && make build

echo -e "\nCreating build directory..."
rm -rf build
mkdir -p build
cp *.html build/
cp -r js/ build/ 
cp -r lib/ build/

echo -e "\nAdding all changes to git..."
git add .

echo -e "\nChecking for changes to commit..."
git diff --staged --quiet || (echo -e "Committing changes..." && git commit -m "Automated deployment: $(date)")

echo -e "\nPushing changes to gh-pages..."
git push origin gh-pages

echo -e "\nSwitching back to main branch..."
git checkout main

echo -e "\nDeployment complete."
