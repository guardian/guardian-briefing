import { region, config } from 'firebase-functions';
import {
  dialogflow,
  DialogflowConversation,
  SimpleResponse,
  Response,
} from 'actions-on-google';
import { getBriefingContent } from './api';
import { buildListFromArticles } from './richResponseBuilder';
import { Locale, getLocale } from '../localeUtils';

const appConfig = config();

const app = dialogflow<{}, {}>({
  debug: true,
});

const response = (conv: DialogflowConversation) => {
  const locale: Locale = getLocale(conv.user.locale);
  const url: string = getURL(locale);
  return getBriefingContent(url).then(briefing => {
    const data = new SimpleResponse({
      speech: ssmlGen(briefing.audioFileLocation),
      text:
        'The news you need to start your day. An experiment from the Voice Lab.',
    });
    if (canDisplayCarousel(conv)) {
      const responses: Response[] = [
        data,
        buildListFromArticles(briefing.content),
      ];
      conv.close(...responses);
    } else {
      conv.close(data);
    }
  });
};

const getURL = (locale: Locale) => {
  switch (locale) {
    case Locale.GB:
      return appConfig.briefing.ukcontent;
    case Locale.AU:
      return appConfig.briefing.aucontent;
    case Locale.US:
      return appConfig.briefing.uscontent;
  }
};

const canDisplayCarousel = (conv: DialogflowConversation) => {
  return (
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT') &&
    conv.surface.capabilities.has('actions.capability.WEB_BROWSER')
  );
};

const ssmlGen = (audioLink: string) => {
  return "<speak><audio src='" + audioLink + "'/></speak>";
};

app.intent('welcome_intent', response);

const guardianBriefing = region('europe-west1').https.onRequest(app);

export { guardianBriefing };
