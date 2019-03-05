import fetch from 'node-fetch';
import { MorningBriefing } from './models';

const getBriefingContent = (url: string): Promise<MorningBriefing> => {
  return fetch(url)
    .then<MorningBriefing>(res => {
      return res.json();
    })
    .then(briefing => {
      return briefing;
    });
};

export { getBriefingContent };
