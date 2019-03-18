interface MorningBriefing {
  ssml: string;
  audioFileLocation: string;
  content: Article[];
}

interface Article {
  headline: string;
  standfirst: string;
  source: string;
  podcast: string;
}

export { MorningBriefing, Article };
