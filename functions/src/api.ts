import fetch from 'node-fetch';
import { MorningBriefing } from './models';

const getSSML = (url: string): Promise<string> => {
  return fetch(url)
    .then<MorningBriefing[]>(res => {
      return res.json();
    })
    .then(briefing => {
      return briefing[0].ssml;
    });
};

export { getSSML };
