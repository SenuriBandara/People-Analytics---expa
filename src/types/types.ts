export type Filter = {
	entity: string;
	from: string;
	to: string;
	age: number;
	person_profile.selected_programmes: string[];
	languages : string[];
	skills : string[];
	referral_type : string[];
	is_aiesecer : Boolean;
	lc_alignment : string;
	nationalities : string[];
	campaignTag?: number;
		}
}

export type Office = {
	id: string;
	name: string;
}
