import { Request, Response } from "express";
import { newMessage } from "../services/notion";

export default async function(req: Request, res: Response) {
	const message = req.body.message;
	if (!message) return res.send();
	console.log(message)
	await newMessage(message.text)

	return res.send();
}