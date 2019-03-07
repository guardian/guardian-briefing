import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import { Storage } from '@google-cloud/storage';
import { region, config } from 'firebase-functions';
import { Response } from 'express';

const appConfig = config();

const googleCloudStorage = new Storage();
const cacheBucketName = 'gu-briefing-cache';
const snapshotBucketName = 'gu-briefing-snapshots';
const fileLocation = '/tmp/briefing-content.json';

const generateBriefing = region('europe-west1').https.onRequest(
  (request, response) => {
    fetch(appConfig.newsapi.url)
      .then(res => {
        return res.json();
      })
      .then(briefing => {
        createAndUploadFile(briefing, response);
      })
      .catch(e => {
        console.error(`Failed to create and upload briefing. Error: ${e}`);
        response.status(500).send('Could not upload file');
      });
  }
);

const createAndUploadFile = (briefing: string, response: Response) => {
  const writeStream = fs.createWriteStream(fileLocation);
  writeStream.write(JSON.stringify(briefing));
  writeStream.end();
  writeStream.on('finish', () => {
    googleUpload()
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

const googleUpload = () => {
  return googleCloudStorage
    .bucket(cacheBucketName)
    .upload(fileLocation, { public: true })
    .then(_ => {
      return googleCloudStorage
        .bucket(snapshotBucketName)
        .upload(fileLocation, {
          destination: `${new Date().toString()}-briefing`,
        });
    });
};

export { generateBriefing };
