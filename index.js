#!/usr/bin/env node

const homedir = require('os').homedir();
const fs = require('fs');

const NPMRC_TEMPLATE = `
{scope}:registry={npm_host}
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
    const azurenpmrc = require(`${homedir}/.azurenpmrc.js`);
    const base64token = Buffer.from(azurenpmrc.token).toString('base64');
    const npmRegistry = azurenpmrc.npm_host.replace(/(http[s]?:\/\/)(.*)+/g, '$2');
    const npmUri = npmRegistry.replace('registry/', '');

    const content = NPMRC_TEMPLATE
        .replace(/{scope}/g, azurenpmrc.scope)
        .replace(/{user}/g, azurenpmrc.user)
        .replace(/{email}/g, azurenpmrc.email)
        .replace(/{npm_host}/g, azurenpmrc.npm_host)
        .replace(/{npm_registry}/g, npmRegistry)
        .replace(/{npm_uri}/g, npmUri)
        .replace(/{token}/g, base64token)
        .trim();

    fs.writeFileSync('./.npmrc', content, () => {
        console.log('Your Azure Artifact .npmrc was created.');
    });
} catch(e) {
    console.error(e.message);
}