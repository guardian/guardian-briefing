import { region, config } from 'firebase-functions';
import {
  dialogflow,
  DialogflowConversation,
  SimpleResponse,
} from 'actions-on-google';
import { getSSML } from './api';

const appConfig = config();

const app = dialogflow<{}, {}>({
  debug: true,
});

const response = (conv: DialogflowConversation) => {
  const url: string = appConfig.newsapi.url;
  return getSSML(url).then(ssml => {
    const data = new SimpleResponse({ speech: ssml, text: "Today's Briefing" });
    conv.close(data);
  });
};

app.intent('welcome_intent', response);

exports.guardianBriefing = region('europe-west1').https.onRequest(app);
