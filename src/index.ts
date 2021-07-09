import express from "express";
import axios from "axios";
import { PORT, TELEGRAM_TOKEN, SERVER_URL } from "./utils/secrets";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const setTelegramHook = async () => {
    const res = await axios.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${SERVER_URL}/telegramWebhook`);
    console.log(res.data);
};

app.post(`/telegramWebhook`, async (req, res)=> {
    console.log(req.body);
    const message = req.body.message;
    if (!message) return res.send();

    const data = {
        chat_id: message.chat.id,
        text: message.text,
    };

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, data);
    return res.send();
});

app.listen(PORT, async () => {
    console.log(`App running on port ${PORT}`);
    await setTelegramHook();
});
