# Starboard Stats
Starboard Stats is a backend API server that allows you to fetch data stored by [Starboard](https://github.com/Rushnett/starboard) when **database support is turned on**. All sorts of API routes are provided to serve interesting and unique data to your users.

This repository is a work-in-progress and will often have application-breaking changes.

## Getting Started
### Requirements
- NodeJS 16.6.0+
- MariaDB
- [Starboard](https://github.com/Rushnett/starboard) bot

### Setup
This application requires that you have a working setup of my [Starboard](https://github.com/Rushnett/starboard) bot with database support turned on. Once that is set up, you can start setting up the Starboard API.

The only thing that really needs to be done is to create a `config.js` file in the config folder. You can see an example config file in that folder called [config.js.example](config/config.js.example).

| PROP | TYPE| INFO |
|--|--|--|
| **name** | String | the name you want for this application. |
| **port** | String | the port you want this application to run on. |
| | | |
| **discord** | Object | optional Discord object settings. Set any of these values to authenticate your routes through your Discord server. |
| **discord/client_id** | String | your bot's client ID. |
| **discord/client_secret** | String | your bot's OAuth2 client secret. |
| **discord/client_token** | String | the bot's token it uses to login. |
| **discord/guild_id** | String | the Discord server/guild id you want to confirm a user is in. |
| | | |
| **sql** | Object | required info to connect to your sql server. |
| **sql/dialect** | String | the sql dialect you want sequelize to use. I recommend keeping this as mariadb unless you know what you are doing. |
| **sql/db** | String | database name. |
| **sql/hostname** | String | server ip/hostname to connect to. |
| **sql/port** | String | server port to listen on. |
| **sql/username** | String | database user. |
| **sql/password** | String | database password. |

### Running the project
Use `npm install` to download dependencies. Finally, you can run the server with `npm start`. It will create any additional files if necessary. I recommend using pm2 for continuous uptime.

## Authentication
When you set up Discord authentication, the API will need a bearer token in the request headers for all routes. This bearer token is either a JWT formed from the user's Discord OAuth2 fragment identifier via `/auth/authorize` or just your Discord bot's `client_token`.

For information on OAuth2, see the [Discord Developer portal](https://discord.com/developers/applications), select your application, and go to the OAuth2 page. The only scope needed is the `identify` scope (all this will fetch is their Discord ID and username). Otherwise, you can simply use your client token if you are using your own bot to interface the API.

## Documentation
When the server is running, you can find documentation on the route `/api-docs` served from [apidocs.json](docs/apidocs.json). You can also check out my production server's documentation at https://smugpi.rushnett.com/api-docs/.

## Examples
I am working on providing production ready examples that you can use with this API. If you want me to mention an example of yours feel free to send a pr.
