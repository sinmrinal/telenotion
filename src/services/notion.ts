import { Client } from "@notionhq/client";
import { NOTION_DATABASE, NOTION_TOKEN } from "../utils/secrets";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { InputPropertyValueMap } from "@notionhq/client/build/src/api-endpoints";
import { publish } from "../utils/pubsub";

const notion = new Client({
	auth: NOTION_TOKEN
});

let currentPages: any = {};

const getPageID = async (cursor: undefined | object = undefined) => {
	let idArray: any = {};
	let payload: RequestParameters;
	if (cursor == undefined) {
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
	const current_pages: any = await notion.request(payload);
	for (const page of current_pages.results) {
		if (page.last_edited_time) {
			idArray[page.id] = page.last_edited_time;
		} else {
			idArray[page.id] = page.created_time;
		}
	}
	if (current_pages.has_more) {
		const remaining = await getPageID(current_pages.next_cursor);
		idArray = { ...idArray, ...remaining };
	}
	return idArray;
};


export const detectChangesInDatabase = async () => {
	console.log("looking for changes....")
	const newIDs = await getPageID();
	// console.log(newIDs)
	for (const [key, value] of Object.entries(newIDs)) {
		if (key in currentPages) {
			if (value !== currentPages[key]) {
				console.log("change found, publishing..."+ JSON.stringify({ id: key, status: "updated" }))
				publish.publish("pageID", JSON.stringify({ id: key, status: "updated" }));
				currentPages[key] = value;
			}
		} else {
			currentPages[key] = value;
			console.log("new message found, publishing..."+ JSON.stringify({ id: key, status: "updated" }))
			publish.publish("pageID", JSON.stringify({ id: key, status: "new" }));
		}
	}
};

setInterval(detectChangesInDatabase, 2000);


export const newMessage = async (message: string) => {
	return await notion.pages.create({
		parent: { database_id: NOTION_DATABASE! },
		properties: { message: { type: "rich_text", rich_text: [{ type: "text", text: { content: message } }] } }
	});
};
export const updateMessage = async (page_id: string, messageObject: InputPropertyValueMap) => {
	return await notion.pages.update({page_id:page_id, properties: messageObject})
}

export const retrieveMessage = async (page_id: string) => {
	return await notion.pages.retrieve({ page_id: page_id });
};

(async () => {
	currentPages = await getPageID();
	// for (const [key, _] of Object.entries(currentPages)) {
	// 	console.log(JSON.stringify(await retrieveMessage(key)));
	// }
})();