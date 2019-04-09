import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import { Storage } from '@google-cloud/storage';
import { region, config } from 'firebase-functions';
import { Response } from 'express';
import { Locale, getLocale } from '../localeUtils';

const appConfig = config();

const googleCloudStorage = new Storage();
const cacheBucketName = 'gu-briefing-cache';
const fileLocation = '/tmp/briefing-content.json';

const generateBriefing = region('europe-west1').https.onRequest(
  (request, response) => {
    const locale: Locale = getLocale(request.query.locale);
    fetch(buildURL(locale))
      .then(res => {
        return res.json();
      })
      .then(briefing => {
        createAndUploadFile(briefing, response, locale);
      })
      .catch(e => {
        console.error(`Failed to create and upload briefing. Error: ${e}`);
        response.status(500).send('Could not upload file');
      });
  }
);

const buildURL = (locale: Locale) => {
  switch (locale) {
    case Locale.GB:
      return `${appConfig.newsapi.url}?locale=en-GB`;
    case Locale.AU:
      return `${appConfig.newsapi.url}?locale=en-AU`;
    case Locale.US:
      return `${appConfig.newsapi.url}?locale=en-US`;
  }
};

const createAndUploadFile = (
  briefing: string,
  response: Response,
  locale: Locale
) => {
  const writeStream = fs.createWriteStream(fileLocation);
  writeStream.write(JSON.stringify(briefing));
  writeStream.end();
  writeStream.on('finish', () => {
    googleUpload(locale)
      .then(_ => {
        fs.unlinkSync(fileLocation);
        response.status(200).send('Uploaded Briefing');
      })
      .catch(e => {
        console.error(`Could not upload file to Google Cloud. Error:${e}`);
        response
          .status(500)
          .send('Could not upload file to Google Cloud Service.');
      });
  });
  writeStream.on('error', () => {
    console.error('Could not write file.');
    response.status(500).send('Could not write to file.');
  });
};

const googleUpload = (locale: Locale) => {
  return googleCloudStorage.bucket(cacheBucketName).upload(fileLocation, {
    destination: getFileName(locale),
    public: true,
    metadata: { cacheControl: 'no-cache' },
  });
};

const getFileName = (locale: Locale) => {
  switch (locale) {
    case Locale.GB:
      return 'GB-briefing-content.json';
    case Locale.AU:
      return 'AU-briefing-content.json';
    case Locale.US:
      return 'US-briefing-content.json';
  }
};

export { generateBriefing };
