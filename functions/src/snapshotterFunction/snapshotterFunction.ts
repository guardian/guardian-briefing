import fetch from 'node-fetch';
import * as fs from 'fs-extra';
import { Storage } from '@google-cloud/storage';
import { region, config } from 'firebase-functions';

const appConfig = config();

const generateBriefing = region('europe-west1').https.onRequest(
  (request, response) => {
    fetch(appConfig.newsapi.url)
      .then(res => {
        return res.json();
      })
      .then(briefing => {
        return new Promise<string>((resolve, reject) => {
          const googleCloudStorage = new Storage();
          const fileLocation = '/tmp/briefing-content.json';
          const bucketName = 'gu-briefing-cache';
          const writeStream = fs.createWriteStream(fileLocation);
          writeStream.write(JSON.stringify(briefing));
          writeStream.end();
          writeStream.on('finish', () => {
            googleCloudStorage
              .bucket(bucketName)
              .upload(fileLocation, { public: true })
              .then(_ => {
                fs.unlinkSync(fileLocation);
              });
            resolve('File Uploaded Successfully');
          });
          writeStream.on('error', reject);
        });
      })
      .then(_ => response.status(200).send('Uploaded Briefing'))
      .catch(_ => response.status(500).send('Upload Failed'));
  }
);

export { generateBriefing };
