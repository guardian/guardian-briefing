# Guardian Briefing

This project contains two firebase functions.

- Guardian Briefing Function:
  This function powers the Guardian Briefing Action
- Snapshotter Function:
  This function runs hourly using Google Cloud Scheduler. It calls the [structured-news-api](https://github.com/guardian/structured-news-api) and uploads the JSON response to a Google Cloud Storage Bucket. This is so the Guardian Briefing Function can use this cached version of the SNAPI (structured news API) response.

  This is good because:

  1. It's faster
  2. It stops the audio file the briefing function uses being generated every time a user uses the Guardian Briefing.

## Setup

Using firebase cli tools:
Make sure you're logged in:

```
firebase login
```

This app requires local config. Once you're logged in run `firebase functions:config:get > ./functions/.runtimeconfig.json`

## Deploy:

```
yarn deploy
```
