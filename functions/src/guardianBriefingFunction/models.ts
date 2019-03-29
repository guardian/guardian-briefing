interface MorningBriefing {
  audioFileLocation: [string] | [string, string];
  content: Article[];
}

interface Article {
  headline: string;
  standfirst: string;
  source: string;
  podcast: string;
}

export { MorningBriefing, Article };
