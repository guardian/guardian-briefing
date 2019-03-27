const getLocale = (locale: any) => {
  const supportedLocales: { [key: string]: Locale } = {
    'en-AU': Locale.AU,
    'en-CA': Locale.US,
    'en-GB': Locale.GB,
    'en-IN': Locale.GB,
    'en-SG': Locale.GB,
    'en-US': Locale.US,
  };

  const l: Locale = supportedLocales[locale];
  return typeof l === 'undefined' ? Locale.GB : l;
};

enum Locale {
  AU = 'en-AU',
  GB = 'en-GB',
  US = 'en-US',
}

export { Locale, getLocale };
