import {
  region,
  //  config
} from 'firebase-functions';
import {
  dialogflow,
  DialogflowConversation,
  SimpleResponse,
} from 'actions-on-google';
import { getBriefingContent } from './api';

// const appConfig = config();

const app = dialogflow<{}, {}>({
  debug: true,
});

const response = (conv: DialogflowConversation) => {
  // const url: string = appConfig.newsapi.url;
  const url: string =
    'https://storage.googleapis.com/gu-briefing-audio/structuredNewsApi.json';
  return getBriefingContent(url).then(briefing => {
    const data = new SimpleResponse({
      speech:
        "<speak><audio src='" +
        briefing.audioFileLocation.replace('"', '') +
        "'/></speak>",
      text: "Today's Briefing",
    });
    conv.close(data);
  });
};

app.intent('welcome_intent', response);

const guardianBriefing = region('europe-west1').https.onRequest(app);

module.exports = {
  guardianBriefing,
};
