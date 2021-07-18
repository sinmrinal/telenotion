import { Request, Response } from "express";
import Notion from "../services/notion";


export default async function(req: Request, res: Response) {
	if (req.body.message) {
		await Notion.sendMessage(req.body.message.from.id, req.body.message.message_id, req.body.message.text)
	} else if(req.body.edited_message) {
		// Notion.searchMessage()
		// await Notion.updateMessage("", req.body.edited_message.from.id, req.body.edited_message.message_id, req.body.edited_message.text)
	}
	return res.send();
}
