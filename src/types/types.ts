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
	compare?: {
		from: string;
		to: string;
	}
	backgrounds?: string; // or string[] if you expect multiple
	department?: string;
	role?: string;
	status?: string; 
}

export type Office = {
	id: string;
	name: string;
}

