# Guardian Briefing

This project contains two firebase functions.

- Guardian Briefing Function:
  This function powers the Guardian Briefing Action
- Snapshotter Function:
  This function runs hourly using Google Cloud Scheduler. It calls the [structured-news-api](https://github.com/guardian/structured-news-api) and uploads the JSON response to a Google Cloud Storage Bucket. This is so the Guardian Briefing Function can use this cached version of the SNAPI (structured news API) response. It also uploads a timestamped copy to a snapshot bucket so that there is a record of previous briefings.

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

The app also requires a service account ID.

1. Go to the Google Cloud Console for the project
2. Go to IAM & Admin
3. Go to Service Accounts
4. Select the file-upload account and select 'create key'. This will download a key onto your machine.
5. In terminal type `export GOOGLE_APPLICATION_CREDENTIALS=path_to_json_file_containing_key`

## Run locally

1. From inside the `functions` directory run `yarn serve`

## Deploy:

From inside the `functions` directory run `yarn deploy`
