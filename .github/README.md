
# Telenotion

Bi-directional sync with notion and telegram with additional features.
## Screenshots



  
## Features

- Send messages from telegram to notion.
- Send messages from notion to telegram.
- Bi-directional message edit, and delete. [WIP]
- Group Support [WIP]

  
## Requirements

- **Telegram Bot:** Create a bot using [Bot Father](t.me/botfather).
- **Notion account:** Create a account on [Notion](notion.so)
- **Nodejs**
- **Redis**
- **ngrok:** Download [ngrok](ngrok.com). (Telegram requires a publicly accessible endpoint to set Webhook.)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SERVER_URL` : ngrok url

`TELEGRAM_TOKEN`: use the token provided by bot father for your bot.

`NOTION_TOKEN` : Generate a token from https://www.notion.so/my-integrations

`NOTION_DATABASE` : UUID of your database. 

  
## Run Locally

Clone the project

```bash
  git clone https://github.com/sinmrinal/telenotion.git
```

Go to the project directory

```bash
  cd telenotion
```

Install dependencies

```bash
  npm install
```

Start ngrok on seprate shell and use same port from which your are running project.

```bash
./path/to/ngrok/file http PORT
```

Start the dev server

```bash
  npm run serve
```

  
## Feedback

If you have any feedback, please reach out to me at [mrinal_singh@outlook.com](mailto:mrinal_singh@outlook.com)

  