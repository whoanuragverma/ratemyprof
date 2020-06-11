# RateMyProf

RateMyProf is an open source web app made with express, mongoDB and React where you can rate your professors. You can clone this repository and make up your own database of professors to get started.

## Installation

Clone this repository and run these [npm](https://nodejs.org/en/download/) commands to get started.

```bash
npm install
npm run dev
```

But before that make sure you set up the following in your environment variables.

## Environment Variables

Below are the required variables that must be set up before you fire up the project:

-   PORT = 5000 _*Optional*_
-   MONGODB_CRED = _Your mongoDB URI_
-   JWT_SECRET = _Anything Secret_
-   email = _Your Gmail address_
-   clientId, clientSecret, refresh_token provided by Google

Visit [OAuth Playground](https://developers.google.com/oauthplayground) for the last three variables. Get more help with the last step on [Medium](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
