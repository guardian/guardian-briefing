import { region, config } from 'firebase-functions';
import {
  dialogflow,
  DialogflowConversation,
  SimpleResponse,
} from 'actions-on-google';
import { getBriefingContent } from './api';

const appConfig = config();

const app = dialogflow<{}, {}>({
  debug: true,
});

const response = (conv: DialogflowConversation) => {
  const url: string = appConfig.briefing.content;
  return getBriefingContent(url).then(briefing => {
    const data = new SimpleResponse({
      speech: ssmlGen(briefing.audioFileLocation),
      text: "Today's Briefing",
    });
    conv.close(data);
  });
};

const ssmlGen = (audioLink: string) => {
  return "<speak><audio src='" + audioLink + "'/></speak>";
};

app.intent('welcome_intent', response);

const guardianBriefing = region('europe-west1').https.onRequest(app);

export { guardianBriefing };
