export type Filter = {
	entity: string;
	from: string;
	to: string;
	products: string[];
	statuses: string[];
	campaignTag?: number;
	durationType?: string;
	workField?: string;
	getPeople: boolean;
	getApplications: boolean;
}

export type Office = {
	id: string;
	name: string;
}

