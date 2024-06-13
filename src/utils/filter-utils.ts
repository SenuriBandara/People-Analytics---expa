import {Filter} from "@/types/types";

export const STAGES_MAP = {
	"OP": "Open",
	"APP": "Applied",
	"ACH": "Matched",
	"ACC": "Accepted",
	"APD": "Approved",
	"RE": "Realized",
	"FI": "Finished",
	"CO": "Completed"
}

export function filterData(data: any, filter: Filter) {
	const result = {};
	
	for (const key in data) {
		const officeData = data[key];
		
		for (const product in officeData) {
			if (filter.products.length != 0 && !filter.products.includes(product)) continue;
			
			// @ts-ignore
			if (!result[key]) {
				// @ts-ignore
				result[key] = {};
			}
			
			// @ts-ignore
			result[key][product] = {};
			
			for (const stage in officeData[product]) {
				// @ts-ignore
				const mappedStage = STAGES_MAP[stage];
				if (filter.statuses.length != 0 && !filter.statuses.includes(mappedStage)) continue;
				
				// @ts-ignore
				result[key][product][stage] = officeData[product][stage];
			}
		}
	}
	
	return result;
}
