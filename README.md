# Adonis Redirect Bug

**Update:** *This only seems to be a problem in Chrome*

This repo demonstrates a bug that seems to cause the session to be reset after redirecting
from the handler for an ally oauth callback.

I'm using Google as the provider in repo. I haven't tested with the other providers.

## Reproducing the bug

To test this for yourself, clone this repository to your computer:

```sh
$ git clone https://github.com/SidneyNemzer/adonis-redirect-bug.git
$ cd adonis-redirect-bug
$ npm i
$ adonis migration:run
```

You'll need to set up the Google client id and secret in .env

Now you can start the server (`adonis serve --dev`) and open [localhost:3333](http://localhost:3333) to view
the login screen. Click "Login with Google" and select an account. You should be
redirected back to `/check-auth` where "You are not logged in" is displayed.

Notice that the logs from the server show the client was given a new session.

## Possible Solutions

* Use a client-side redirect

Open the file `start/routes`. Comment out line 55 and uncomment line 57.

Visit the index page again and try the Google login. Upon being redirected, you should
see "You are logged in as <name>".
  
* Set `sameSite: false` in `config/session.js`

## How this repo was created

1. Create a new adonis app (`adonis new adonis-redirect-bug`)
2. Install SQLite adapter (`npm i sqlite3`)
3. Install @adonisjs/ally (`adonis install @adonisjs/ally`)
4. Register ally provider
5. Modify user migration for use with social logins
6. Run migrations (`adonis migration:run`)
7. Create .env from .env.example and set Google client id/secret
8. Set up routes in `start/routes.js` (note the handlers are inline -- I originally discovered this bug when using a controller so I don't believe this is related to controllers)
9. Create a few views and modify welcome view
