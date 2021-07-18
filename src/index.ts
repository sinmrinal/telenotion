import express from "express";
import axios from "axios";
import { PORT, SERVER_URL, TELEGRAM_API_BASE, TELEGRAM_TOKEN } from "./utils/secrets";
import telegramWebhook from "./controllers/telegram";
import Notion from "./services/notion";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const setNotionHook = async () => {
	try {
		Notion.currentPages = await Notion.getPageID();
		console.log(Notion.currentPages);
		setInterval(Notion.detectChangeInDatabase, 5000);
		console.log("Done.")
	} catch (e) {
		console.log("Failed.")
	}
}

const setTelegramHook = async () => {
	try {
		const res = await axios.get(TELEGRAM_API_BASE! + TELEGRAM_TOKEN! + "/setWebhook?url=" + SERVER_URL! + "/telegramWebhook");
		if (res.data.ok)
			console.log("Done.");
		else {
			console.log("Failed.")
		}
	} catch (e) {
		console.log("Failed.")
	}
};

app.post(`/telegramWebhook`, telegramWebhook);

app.listen(PORT, async () => {
	process.stdout.write("Setting up webhook for Telegram... ")
	await setTelegramHook()
	process.stdout.write("Setting up webhook for Notion... ")
	await setNotionHook()
	console.log(`Server running on port ${PORT}`);
});
