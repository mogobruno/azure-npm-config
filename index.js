#!/usr/bin/env node

const homedir = require('os').homedir();
const fs = require('fs');

const CONFIG_PATH = `${homedir}/.azurenpmrc.js`;

const REQUIRED_PROPS = [
    'user',
    'email',
    'npm_host',
    'token'
]

const checkConfigValues = (config) => {
    REQUIRED_PROPS.forEach((prop) => {
        if (!config[prop]) {
            throw new Error(`Missing ${prop} in .azurenpmrc.js`);
        } else if (typeof config[prop] !== 'string') {
            throw new Error(`Prop ${prop} should be a string`);
        } else if (config[prop].length <= 0) {
            throw new Error(`Prop ${prop} can not be an empty string`);
        }
    });
    return config
}

const NPMRC_TEMPLATE = `
{scope}registry={npm_host}
always-auth=true
; begin auth token
//{npm_registry}:username={user}
//{npm_registry}:_password={token}
//{npm_registry}:email={email}
//{npm_uri}:username={user}
//{npm_uri}:_password={token}
//{npm_uri}:email={email}
; end auth token
`;

try {
    const azurenpmrc = checkConfigValues(require(CONFIG_PATH));
    const base64token = Buffer.from(azurenpmrc.token).toString('base64');
    const npmRegistry = azurenpmrc.npm_host.replace(/(http[s]?:\/\/)(.*)+/g, '$2');
    const npmUri = npmRegistry.replace('registry/', '');
    const scope = azurenpmrc.scope ? `@${azurenpmrc.scope}:` : '';

    const content = NPMRC_TEMPLATE
        .replace(/{user}/g, azurenpmrc.user)
        .replace(/{email}/g, azurenpmrc.email)
        .replace(/{npm_host}/g, azurenpmrc.npm_host)
        .replace(/{npm_registry}/g, npmRegistry)
        .replace(/{scope}/g, scope)
        .replace(/{npm_uri}/g, npmUri)
        .replace(/{token}/g, base64token)
        .trim();

    fs.writeFileSync('./.npmrc', content, () => {
        console.log('Your Azure Artifact .npmrc was created.');
    });
} catch(e) {
    console.error(e.message);
}