/*************************************************************
 *
 * Copyright (c) 2017 languor.fr
 *
 * @github L4ngu0r
 *
 *************************************************************/

const puppeteer = require('puppeteer'),
  {promisify} = require('util'),
  child_process = require('child_process'),
  exec = promisify(child_process.exec),
  semver = require('semver');

const LTS = '6';
const LAST = '8';

/**
 * Get the current version of Node on local machine
 * @returns {Promise.<*>}
 */
const getNodeVersion = async () => {
  return await exec('node --version');
};

/**
 * Return a results list of compare
 * @param current
 * @param local
 * @returns {{compareLt: *, compareEq: *}}
 */
const compareBloc = (current, local) => {
  const compareLt = semver.lt(current, local);
  const compareEq = semver.eq(current, local);

  return {
    compareLt: compareLt,
    compareEq: compareEq,
  }
};

/**
 * Principal compare process
 * @param current
 * @param local
 * @returns {*}
 */
const compareVersion = (current, local) => {
  const cleanCurrent = semver.clean(current);
  const cleanLocal = semver.clean(local);

  const regex = /^[0-9]?[0-9]/g;

  const matchLocal = cleanLocal.match(regex)[0];
  const matchCurrent = cleanCurrent.match(regex)[0];

  let res = null;
  if(LTS === matchLocal && LTS === matchCurrent) {
    res = compareBloc(cleanCurrent, cleanLocal)
  } else if(LAST === matchLocal && LAST === matchCurrent) {
    res = compareBloc(cleanCurrent, cleanLocal);
  } else {
    // we skip when the version is not installed on local
  }

  return res;
};

/**
 * Use puppeteer to launch Nodejs.org front page to get
 * the latest version.
 * @returns {Promise.<*>}
 */
const scrape = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  //page.on('console', console.log);

  await page.goto('http://nodejs.org/en');

  const result = await page.evaluate(() => {
      let data = [];
      let elements = document.querySelectorAll('.home-downloadblock > .home-downloadbutton');

      elements.forEach((elem) => {
        data.push(elem.getAttribute('data-version'));
      });

      return data;
    });

  browser.close();
  return result;
};


/**
 * Execution
 */
scrape()
  .then((value) => {
    getNodeVersion()
      .then((v) => {
        const currentVersion = v.stdout.replace('\n', '');
        console.log('currentVersion = ', currentVersion);
        value.forEach((version) => {
          console.log('Version ', version);
          console.log(compareVersion(version, currentVersion));
        });
      });
  })
  .catch((error) => {
    console.log(error);
  });