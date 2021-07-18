import axios from "axios";
import log from "../utils/log";
import { TELEGRAM_API_BASE, TELEGRAM_TOKEN } from "../utils/secrets";


class Telegram {

	static async sendMessage(chat_id: number | string, type: string, payload: string) {
		let data, url;
		if (type === "photo") {
			url = "/sendPhoto";
			data = { chat_id, photo: payload };
		} else if (type === "document") {
			url = "/sendDocument";
			data = { chat_id, document: payload };
		} else if (type === "text") {
			url = "/sendMessage";
			data = { chat_id, text: payload };
		}
		const res = await axios.post(TELEGRAM_API_BASE + TELEGRAM_TOKEN! + url, data);
		if (res.status === 200) {
			return res.data.result;
		} else {
			log.error("TELEGRAM: Unable to send message");
			return;
		}
	}

	static async editMessage(chat_id: number, message_id: number, text: string) {
		const res = await axios.post(TELEGRAM_API_BASE + TELEGRAM_TOKEN! + "/editMessageText", {
			chat_id,
			message_id,
			text
		});
		if (res.status === 200)
			return res.data.result;
		else {
			log.error("TELEGRAM: Unable to edit message.");
			return;
		}
	}

	static async deleteMessage(chat_id: number, message_id: number) {
		const res = await axios.post(TELEGRAM_API_BASE + TELEGRAM_TOKEN! + "/deleteMessage", { chat_id, message_id });
		return res.status === 200;
	}
}

export default Telegram;