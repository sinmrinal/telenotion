import express from "express";
import axios from "axios";
import { PORT, SERVER_URL, TELEGRAM_API_BASE, TELEGRAM_TOKEN } from "./utils/secrets";
import telegramWebhook from "./routes/telegramWebhook";
import "./services/notion";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const setTelegramHook = async () => {
	const res = await axios.get(`${TELEGRAM_API_BASE}${TELEGRAM_TOKEN}/setWebhook?url=${SERVER_URL}/telegramWebhook`);
	console.log(res.data);
};

app.post(`/telegramWebhook`, telegramWebhook);

app.listen(PORT, async () => {
	console.log(`App running on port ${PORT}`);
	await setTelegramHook()
	// console.log(await getPageID(undefined))
});
