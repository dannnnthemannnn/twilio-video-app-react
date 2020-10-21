# Twilio Video React App

[![CircleCI](https://circleci.com/gh/twilio/twilio-video-app-react.svg?style=svg)](https://circleci.com/gh/twilio/twilio-video-app-react)

## What is it

This application demonstrates a multi-party video application built with [twilio-video.js](https://github.com/twilio/twilio-video.js) and [Create React App](https://github.com/facebook/create-react-app).

* Deploy to [Twilio Serverless](https://www.twilio.com/docs/runtime/functions-assets-api) in just a few minutes
* No other infrastructure is required
* No code changes are required before your first deploy
* There is no cost associated with deploying the app
* Go Rooms usage is free, however [standard usage charges](https://www.twilio.com/video/pricing) apply when using the app with all other Room types.

![App Preview](https://user-images.githubusercontent.com/12685223/94631109-cfca1c80-0284-11eb-8b72-c97276cf34e4.png)

## Prerequisites

You must have the following installed:

* [Node.js v10+](https://nodejs.org/en/download/)
* NPM v6+ (comes installed with newer Node versions)

## Install Dependencies

Run `npm install` to install all dependencies from NPM.

If you want to use `yarn` to install dependencies, first run the [yarn import](https://classic.yarnpkg.com/en/docs/cli/import/) command. This will ensure that yarn installs the package versions that are specified in `package-lock.json`.

## Install Twilio CLI

The app is deployed to Twilio using the Twilio CLI. Install twilio-cli with:

    $ npm install -g twilio-cli

Login to the Twilio CLI. You will be prompted for your Account SID and Auth Token, both of which you can find on the dashboard of your [Twilio console](https://twilio.com/console).

    $ twilio login

This app requires an additional plugin. Install the CLI plugin with:

    $ twilio plugins:install @twilio-labs/plugin-rtc

## Deploy the app to Twilio

Before deploying the app, make sure you are using the correct account on the Twilio CLI (using the command `twilio profiles:list` to check). 
The app is deployed to Twilio with a single command:

    $ npm run deploy:twilio-cli

This performs the following steps:

* Builds the React app in the `src` directory
* Generates a random code used to access the Video app
* Deploys the React app and token server function as a Twilio Serverless service.
* Prints the URL for the app and the passcode.

**NOTE:** The Twilio Function that provides access tokens via a passcode should *NOT* be used in a production environment. This token server supports seamlessly getting started with the collaboration app, and while convenient, the passcode is not secure enough for production environments. You should use an authentication provider to securely provide access tokens to your client applications. You can find more information about Programmable Video access tokens [in this tutorial](https://www.twilio.com/docs/video/tutorials/user-identity-access-tokens). **As a precaution, the passcode will expire after one week**. To generate a new passcode, redeploy the app:

    $ npm run deploy:twilio-cli -- --override

## View app details

View the URL and passcode for the Video app with

     $ twilio rtc:apps:video:view

## Delete the app

Delete the app with

    $ twilio rtc:apps:video:delete

This removes the Serverless app from Twilio. This will ensure that no further cost are incurred by the app.

## Troubleshooting The Twilio CLI

If any errors occur after running a [Twilio CLI RTC Plugin](https://github.com/twilio-labs/plugin-rtc) command, then try the following steps.

1. Run `twilio plugins:update` to update the rtc plugin to the latest version.
1. Run `twilio rtc:apps:video:delete` to delete any existing video apps.
1. Run `npm run deploy:twilio-cli` to deploy a new video app.

## App Behavior with Different Room Types

After running the command [to deploy a Twilio Access Token Server](https://github.com/twilio/twilio-video-app-android#deploy-twilio-access-token-server), the room type will be returned in the command line output. Each room type provides a different video experience. More details about these room types can be found [here](https://www.twilio.com/docs/video/tutorials/understanding-video-rooms). The rest of this section explains how these room types affect the behavior of the video app.

*Group* - The Group room type allows up to fifty participants to join a video room in the app. The Network Quality Level (NQL) indicators and dominant speaker are demonstrated with this room type. Also, the VP8 video codec with simulcast enabled along with a bandwidth profile are set by default in order to provide an optimal group video app experience.

*Small Group* - The Small Group room type provides an identical group video app experience except for a smaller limit of four participants.

*Peer-to-peer* - Although up to ten participants can join a room using the Peer-to-peer (P2P) room type, it is ideal for a one to one video experience. The NQL indicators, bandwidth profiles, and dominant speaker cannot be used with this room type. Thus, they are not demonstrated in the video app. Also, the VP8 video codec with simulcast disabled and 720p minimum video capturing dimensions are also set by default in order to provide an optimal one to one video app experience. If more than ten participants join a room with this room type, then the video app will present an error.

*Go* - The Go room type provides a similar Peer-to-peer video app experience except for a smaller limit of two participants. If more than two participants join a room with this room type, then the video app will present an error.

If the max number of participants is exceeded, then the video app will present an error for all room types.

## Features

The Video app has the following features:

- [x] Video conferencing with real-time video and audio
- [x] Enable/disable camera
- [x] Mute/unmute mic
- [x] Screen sharing
- [x] [Dominant speaker](https://www.twilio.com/docs/video/detecting-dominant-speaker) indicator
- [x] [Network quality](https://www.twilio.com/docs/video/using-network-quality-api) indicator
- [x] [Bandwidth Profile API](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api)

## Browser Support

See browser support table for [twilio-video.js SDK](https://github.com/twilio/twilio-video.js/tree/master/#browser-support).

## Deeper dive

### Running a local token server

This application requires an access token to connect to a Room. The included local token [server](server.js) provides the application with access tokens. Perform the following steps to setup the local token server:

- Create an account in the [Twilio Console](https://www.twilio.com/console).
- Click on 'Settings' and take note of your Account SID.
- Create a new API Key in the [API Keys Section](https://www.twilio.com/console/video/project/api-keys) under Programmable Video Tools in the Twilio Console. Take note of the SID and Secret of the new API key.
- Store your Account SID, API Key SID, and API Key Secret in a new file called `.env` in the root level of the application (example below).

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Now the local token server (see [server.js](server.js)) can dispense Access Tokens to connect to a Room.

### Running the App locally

Run the app locally with

    $ npm start

This will start the local token server and run the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to see the application in the browser.

The page will reload if you make changes to the source code in `src/`.
You will also see any linting errors in the console. Start the token server locally with

    $ npm run server

The token server runs on port 8081 and expects a `GET` request at the `/token` route with the following query parameters:

```
identity: string,  // the user's identity
roomName: string   // the room name
```

The response will be a token that can be used to connect to a room.

Try it out with this sample `curl` command:

`curl 'localhost:8081/token?identity=TestName&roomName=TestRoom'`

### Multiple Participants in a Room

If you want to see how the application behaves with multiple participants, you can simply open `localhost:3000` in multiple tabs in your browser and connect to the same room using different user names.

Additionally, if you would like to invite other participants to a room, each participant would need to have their own installation of this application and use the same room name and Account SID (the API Key and Secret can be different).

### Building

Build the React app with

    $ npm run build

This script will build the static assets for the application in the `build/` directory.

### Tests

This application has unit tests (using [Jest](https://jestjs.io/)) and E2E tests (using [Cypress](https://www.cypress.io/)). You can run the tests with the following scripts.

#### Unit Tests

Run unit tests with

    $ npm test

This will run all unit tests with Jest and output the results to the console.

#### E2E Tests

Run end to end tests with

    $ npm run cypress:open

This will open the Cypress test runner. When it's open, select a test file to run.

Note: Be sure to complete the 'Getting Started' section before running these tests. These Cypress tests will connect to real Twilio rooms, so you may be billed for any time that is used.

### Application Architecture

The state of this application (with a few exceptions) is managed by the [room object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/Room.html) that is supplied by the SDK. The `room` object contains all information about the room that the user is connected to. The class hierarchy of the `room` object can be viewed [here](https://www.twilio.com/docs/video/migrating-1x-2x#object-model).

One great way to learn about the room object is to explore it in the browser console. When you are connected to a room, the application will expose the room object as a window variable: `window.twilioRoom`.

Since the Twilio Video SDK manages the `room` object state, it can be used as the source of truth. It isn't necessary to use a tool like Redux to track the room state. The `room` object and most child properties are [event emitters](https://nodejs.org/api/events.html#events_class_eventemitter), which means that we can subscribe to these events to update React components as the room state changes.

[React hooks](https://reactjs.org/docs/hooks-intro.html) can be used to subscribe to events and trigger component re-renders. This application frequently uses the `useState` and `useEffect` hooks to subscribe to changes in room state. Here is a simple example:

```
import { useEffect, useState } from 'react';

export default function useDominantSpeaker(room) {
  const [dominantSpeaker, setDominantSpeaker] = useState(room.dominantSpeaker);

  useEffect(() => {
    room.on('dominantSpeakerChanged', setDominantSpeaker);
    return () => {
      room.off('dominantSpeakerChanged', setDominantSpeaker);
    };
  }, [room]);

  return dominantSpeaker;
}
```

In this hook, the `useEffect` hook is used to subscribe to the `dominantSpeakerChanged` event emitted by the `room` object. When this event is emitted, the `setDominantSpeaker` function is called which will update the `dominantSpeaker` variable and trigger a re-render of any components that are consuming this hook.

For more information on how React hooks can be used with the Twilio Video SDK, see this tutorial: https://www.twilio.com/blog/video-chat-react-hooks. To see all of the hooks used by this application, look in the `src/hooks` directory.

### Configuration

The `connect` function from the SDK accepts a [configuration object](https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions). The configuration object for this application can be found in [src/index.ts](https://github.com/twilio/twilio-video-app-react/blob/master/src/index.tsx#L20). In this object, we 1) enable dominant speaker detection, 2) enable the network quality API, and 3) supply various options to configure the [bandwidth profile](https://www.twilio.com/docs/video/tutorials/using-bandwidth-profile-api).

#### Track Priority Settings

This application dynamically changes the priority of remote video tracks to provide an optimal collaboration experience. Any video track that will be displayed in the main video area will have `track.setPriority('high')` called on it (see the [VideoTrack](https://github.com/twilio/twilio-video-app-react/blob/master/src/components/VideoTrack/VideoTrack.tsx#L25) component) when the component is mounted. This higher priority enables the track to be rendered at a high resolution. `track.setPriority(null)` is called when the component is unmounted so that the track's priority is set to its publish priority (low).

### Google Authentication using Firebase (optional)

This application can be configured to authenticate users before they use the app. Once users have signed into the app with their Google credentials, their Firebase ID Token will be included in the Authorization header of the HTTP request that is used to obtain an access token. The Firebase ID Token can then be [verified](https://firebase.google.com/docs/auth/admin/verify-id-tokens) by the server that dispenses access tokens for connecting to a room. 

See [.env.example](.env.example) for an explanation of the environment variables that must be set to enable Google authentication.

## Related

- [Twilio Video Android App](https://github.com/twilio/twilio-video-app-android)
- [Twilio Video iOS App](https://github.com/twilio/twilio-video-app-ios)
- [Twilio CLI RTC Plugin](https://github.com/twilio-labs/plugin-rtc)

## License

See the [LICENSE](LICENSE) file for details.

https://myjunto.app/home/twilio/index.html?title=America We Want To Be: Founding Aspiration&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2UyMTgzNDJlNDYyNGM2NjAzMmFhOTk4OTg2NDVmYzM1LTE2MDIyNjQ2NTQiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJEYW5ueSBGIiwidmlkZW8iOnsicm9vbSI6ImJ0dnU5S2k2U09aeGtSZ3hoeENCIn19LCJpYXQiOjE2MDIyNjQ2NTQsImV4cCI6MTYwMjI3OTA1NCwiaXNzIjoiU0tlMjE4MzQyZTQ2MjRjNjYwMzJhYTk5ODk4NjQ1ZmMzNSIsInN1YiI6IkFDOGU3YmI1YTUyMjMxMjA3NDdhYjgzNTM5OGM2ZTY2MzQifQ.mPWdaYd3xWG2BRgGXdJPqKODPSDhVyswJ79DK4fNERE&name=Danny F&auth-token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzNzA1ZmNmY2NjMTg4Njg2ZjhhZjkyYWJiZjAxYzRmMjZiZDVlODMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRGFubnkgRnJhbmtsaW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy02U0ZPWEMtcHZfUS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNuRlQwcEI3cWVmQ1ZTVnNXRkVXdWFXUU9iaXN3L3Bob3RvLmpwZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9qdW50b2NoYXQiLCJhdWQiOiJqdW50b2NoYXQiLCJhdXRoX3RpbWUiOjE2MDIxOTQ1MzIsInVzZXJfaWQiOiJsYm5KNUtNbU9kYTRjUFZpRjFyWlV0cjZwNEgzIiwic3ViIjoibGJuSjVLTW1PZGE0Y1BWaUYxclpVdHI2cDRIMyIsImlhdCI6MTYwMjI2NDY1NCwiZXhwIjoxNjAyMjY4MjU0LCJlbWFpbCI6ImRhbm55QG15anVudG8uYXBwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDM5ODE4MzQxNTY5MzQxNjEyNTUiXSwiZW1haWwiOlsiZGFubnlAbXlqdW50by5hcHAiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.m-ZBqK6t5BojLNYPHWmOpwd6GVl4b4jbK3GLaNR609nZ15d1eu5kstO4F0Vjj9-U7WP0kKPSVkFp99xZVGTxHgxD-PyJtPSXdPlaf9ohhc4qd8zNAdjPJ1-s6PF820Gkz22TWom35xLX6P3W72hIqYfsorqyV3ru80g_cx7ka3YObYsSIJWhbRpIH3JGAxha9s0X2EAYxbROH4n-I-zQPIjik00UGeZ_gg-qXPLvXaqbK_NGDf6jkUokT9LCHsXOwmg00TyyH50hdc_A5RoL8E3eQTUkueknAKnoRjufC2HMQS_lGBdQd_Q2ZC06d_Lrij5qsVPHYswxayBg2NMyLA