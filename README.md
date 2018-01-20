## Node version notifier

Check if you have the latest version of Node (LTS or latest)

#### How it works

Using puppeteer, we scrape [NodeJS Website](nodejs.org) to get the differents versions.
We execute the command on the local machine :

```javascript
node --version
```
With [semver](https://www.npmjs.com/package/semver) we compare the results and show a notification with [node-notifier](https://www.npmjs.com/package/node-notifier).

## How to use

Clone the repo and then

```javascript
npm i 
```

To check version :

```javascript
npm start
```
