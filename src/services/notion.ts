import { Client } from "@notionhq/client";
import { createClient } from "redis";
import { NOTION_DATABASE, NOTION_TOKEN } from "../utils/secrets";
import {
	PagesCreateResponse,
	PagesRetrieveResponse,
	PagesUpdateResponse
} from "@notionhq/client/build/src/api-endpoints";
import Telegram from "./telegram";


const notion = new Client({
	auth: NOTION_TOKEN
});
//@ts-ignore
const redisClient = createClient();

class Notion {

	static currentPages: any = {};

	static async getPageID(cursor: undefined | object = undefined) {
		let idArray: any = {};
		let payload: any;
		if (cursor === undefined) {
			payload = {
				path: "databases/" + NOTION_DATABASE + "/query",
				method: "post"
			};
		} else {
			payload = {
				path: "databases/" + NOTION_DATABASE + "/query",
				method: "post",
				body: {
					"start_cursor": cursor
				}
			};
		}
		const currPage: any = await notion.request(payload);
		for (const page of currPage.results) {
			if (page.last_edited_time) {
				idArray[page.id] = page.last_edited_time;
			} else {
				idArray[page.id] = page.created_time;
			}
		}
		if (currPage.has_more) {
			const remaining = await Notion.getPageID(currPage.next_cursor);
			idArray = { ...idArray, ...remaining };
		}
		return idArray;
	};

	static async detectChangeInDatabase() {
		try {
			const newIDs = await Notion.getPageID()
			for (const key of Object.keys(newIDs)) {
				if (key in Notion.currentPages && newIDs[key] !== Notion.currentPages[key]){
					Notion.currentPages[key] = newIDs[key]
					const { properties } = await Notion.retrieveMessage(key)
					//@ts-ignore
					console.log(properties.message)
					//@ts-ignore
					await Telegram.editMessage(properties.chat_id.number, properties.message_id.number, properties.message.rich_text["0"].text.content)
				}
				else if (!(key in Notion.currentPages)){
					Notion.currentPages[key] = newIDs[key]
					const page : PagesRetrieveResponse = await Notion.retrieveMessage(key)
					//@ts-ignore
					const res = await Telegram.sendMessage(527182735, "text", page.properties.message.rich_text["0"].text.content)
					await Notion.updateMessage(key, res.from.id, res.message_id, res.text);
				}
			}
		} catch (e) {
			console.log(e)
		}
	};

	static async sendMessage(chat_id: number, message_id: number, message: string) {
		try {
			const res: PagesCreateResponse = await notion.pages.create({
				parent: { database_id: NOTION_DATABASE! },
				properties: {
					chat_id: {type: "number", number: chat_id},
					message_id: {type: "number", number: message_id},
					message: { type: "rich_text", rich_text: [{ type: "text", text: { content: message } }] } }
			});
			Notion.currentPages[res.id] = res.last_edited_time;
			return true;
		} catch (e) {
			return false
		}
	};

	static async updateMessage(page_id: string, chat_id: number, message_id: number, message: string) {
		try {
			const res: PagesUpdateResponse = await notion.pages.update({
				page_id: page_id,
				properties: {
					chat_id: {type: "number", number: chat_id},
					message_id: {type: "number", number: message_id},
					message: { type: "rich_text", rich_text: [{ type: "text", text: { content: message } }] }
				}})
			Notion.currentPages[res.id] = res.last_edited_time;
			return true;
		} catch (e) {
			return false
		}
	}

	static async retrieveMessage(page_id: string) {
		// try {
			return await notion.pages.retrieve({ page_id: page_id });
		// } catch (e) {
		// 	return false
		// }
	};

	// static async findMessage(message_id: number){
		// try{
		// 	const {results}: SearchResponse = await notion.search({query: "message_id"})
		// 	for (const result: Page of results){
		// 		if (result.properties.message_id === message_id){
		//
		// 		}
		// 	}
		// }
	// }
}


export default Notion;