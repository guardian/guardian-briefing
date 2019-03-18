import { Article } from './models';
import { BrowseCarousel, BrowseCarouselItem } from 'actions-on-google';

const buildListFromArticles = (articles: Article[]) => {
  const listItems = articles.map(article => {
    return buildListItem(article);
  });
  return new BrowseCarousel({
    items: listItems,
  });
};

const buildListItem = (article: Article) => {
  const title =
    article.podcast.toLowerCase() === 'todayinfocus'
      ? 'Today in Focus'
      : article.headline;
  return new BrowseCarouselItem({
    title,
    url: article.source,
    description: article.standfirst,
  });
};

export { buildListFromArticles };
