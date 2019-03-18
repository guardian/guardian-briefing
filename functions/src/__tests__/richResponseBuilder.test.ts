import { buildListFromArticles } from '../guardianBriefingFunction/richResponseBuilder';

import { Article } from '../guardianBriefingFunction/models';
import { BrowseCarousel, BrowseCarouselItem } from 'actions-on-google';

describe('buildListFromArticles', () => {
  test('should construct a Google Assistant list item from list of Articles', () => {
    const articles: Article[] = [
      {
        headline: 'headline1',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline2',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline3',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline4',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline5',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
    ];

    const expectedList = new BrowseCarousel({
      items: [
        new BrowseCarouselItem({
          title: 'headline1',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline2',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline3',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline4',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline5',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
      ],
    });
    expect(buildListFromArticles(articles)).toEqual(expectedList);
  });

  test('should replace headline with Today in Focus if Article is a today in focus podcast', () => {
    const articles: Article[] = [
      {
        headline: 'headline1',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline2',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'todayinfocus',
      },
      {
        headline: 'headline3',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline4',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
      {
        headline: 'headline5',
        standfirst: 'standfirst',
        source: 'theguardian.com',
        podcast: 'none',
      },
    ];

    const expectedList = new BrowseCarousel({
      items: [
        new BrowseCarouselItem({
          title: 'headline1',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'Today in Focus',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline3',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline4',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
        new BrowseCarouselItem({
          title: 'headline5',
          description: 'standfirst',
          url: 'theguardian.com',
        }),
      ],
    });
    expect(buildListFromArticles(articles)).toEqual(expectedList);
  });
});
