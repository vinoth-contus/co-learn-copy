#!/bin/bash
#src: https://gist.github.com/vnoitkumar/cdb31ea6b245e2d7b836c5be607a2030
#Ref: https://marmelab.com/blog/2015/12/17/react-directory-structure.html

read -p "Enter the Module name (eg: UserProfile): " moduleName

if [ -z "$moduleName" ]; then
    echo "Module Name required."
    exit
fi

if [ $1 ]
then
  cd $1
else
  mkdir -p src
  cd src
fi

dashCase=$(echo $moduleName        \
     | sed 's/\(.\)\([A-Z]\)/\1-\2/g' \
     | tr '[:upper:]' '[:lower:]')

camelCase=$(echo $moduleName | sed 's/^[A-Z]/\L&/')  # Error in this Line

mkdir $dashCase
cd $dashCase

touch "${moduleName}Action.js"
touch "${moduleName}Constant.js"
touch "${moduleName}Container.js"
touch "${moduleName}Component.jsx"
touch "${moduleName}-spec.js"
touch "${camelCase}Reducer.js"
touch "${camelCase}.scss"

printf "import React, { Component } from 'react';
import './$camelCase.scss';

class $moduleName extends Component {
  render() {
    return (
      <h1>
        $moduleName
      </h1>
    );
  }
}

export default $moduleName;

" > "${moduleName}Component.jsx"
