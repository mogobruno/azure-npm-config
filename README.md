# Azure NPM Config

This project is meant to help Mac and Linux users to keep their projects with Azure Artifact up to date with PAT tokens.

## How to install

```bash
$ npm i -g azure-npm-config
```

## How to use

On Azure side create a PAT with Packages read and write permissions, then in your local machine create a .azurenomrc.js on you user home folder with following content

```javascript
module.exports = {
    "scope": "mycompany",
    "user": "username",
    "email": "email@email.com",
    "npm_host": "https://azure.npm/path/registry/",
    "token": "PAT_TOKEN_HERE"
}
```

After it just run on your project folder

```bash
$ anpm
```

it should create .npmrc based on your azure config

