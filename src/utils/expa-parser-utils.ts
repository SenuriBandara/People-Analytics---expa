import {Filter, Office} from "@/types/types";

const STAGES = {
	OP: "openings",
	APP: "applied",
	ACH: "matched",
	ACC: "an_accepted",
	APD: "approved",
	RE: "realized",
	FI: "finished",
	CO: "completed"
}
const PRODUCTS = {
	GV: [7],
	GTa: [8],
	GTe: [9],
}
const TYPES = {
	INCOMING: "i",
	OUTGOING: "o"
}

const PRODUCTS_ORDER = ["iGV", "iGTa", "iGTe", "oGV", "oGTa", "oGTe"];
const STATUSES_ORDER = ["Open", "Applied", "Matched", "Accepted", "Approved", "Realized", "Finished", "Completed"];

export function parseFilters(url: string): Filter {
	const filter = {} as Filter;
	
	filter.entity = url.split("filters[entity]=")[1].split("&")[0];
	filter.from = url.split("filters[time_period][from]=")[1].split("&")[0];
	filter.to = url.split("filters[time_period][to]=")[1].split("&")[0];
	
	if (url.includes("filters[products]")) {
		const productParams = url.split("filters[products]=")[1].split("&")[0];
		const decoded = decodeURIComponent(productParams);
		filter.products = decoded.split(",");
		filter.products.sort(function (a,b){
			return PRODUCTS_ORDER.indexOf(a) - PRODUCTS_ORDER.indexOf(b)
		});
		
	} else {
		filter.products = PRODUCTS_ORDER;
	}
	
	if (url.includes("filters[status]")) {
		const statusParams = url.split("filters[status]=")[1].split("&")[0];
		const decoded = decodeURIComponent(statusParams);
		filter.statuses = decoded.split(",");
		filter.statuses.sort(function (a,b){
			return STATUSES_ORDER.indexOf(a) - STATUSES_ORDER.indexOf(b)
		});
		
	} else {
		filter.statuses = STATUSES_ORDER;
	}
	
	if (url.includes("filters[campaign_tag]")) {
		filter.campaignTag = parseInt(url.split("filters[campaign_tag]=")[1].split("&")[0]);
	}
	
	if (url.includes("filters[duration_type]")) {
		filter.durationType = url.split("filters[duration_type]=")[1].split("&")[0];
	}
	
	if (url.includes("filters[work_field]")) {
		filter.workField = url.split("filters[work_field]=")[1].split("&")[0];
	}
	
	if (url.includes("getPeople")) {
		filter.getPeople = url.split("getPeople=")[1].split("&")[0] === "true";
	} else {
		filter.getPeople = true;
	}
	
	if (url.includes("getApplications")) {
		filter.getApplications = url.split("getApplications=")[1].split("&")[0] === "true";
	} else {
		filter.getApplications = true;
	}

	return filter;
}

export function parseData(data: any, offices: Office[], parent: string) {
	const result = {};
	const parentData = {};
	//for each key in data
	for (const key in data) {
		//if key in number
		if (!isNaN(Number(key))) {
			const office = offices.find(office => office.id === key)?.name;
			if (!office) continue;
			
			console.log(`Processing data for ${office}`);
			const officeData = data[key];
			
			// @ts-ignore
			result[office] = parseOfficeData(officeData);
		} else {
			// @ts-ignore
			parentData[key] = data[key];
		}
	}
	
	//sort by key
	const ordered = Object.keys(result).sort().reduce(
		(obj: any, key) => {
			// @ts-ignore
			obj[key] = result[key];
			return obj;
		},
		{}
	);
	
	// @ts-ignore
	ordered[parent] = parseOfficeData(parentData);
	return ordered;
}

function parseOfficeData(officeData: any) {
	const result = {};
	
	for (const product in PRODUCTS) {
		for (const stage in STAGES) {
			for (const type in TYPES) {
				// @ts-ignore
				const value = officeData[`${TYPES[type]}_${STAGES[stage]}_${PRODUCTS[product]}`];
				if (value) {
					
					// @ts-ignore
					if (!result[TYPES[type] + product]) {
						// @ts-ignore
						result[TYPES[type] + product] = {};
					}
					
					// @ts-ignore
					result[TYPES[type] + product][stage] = {
						applications: value.doc_count,
						people: value.applicants.value
					};
				}
				
				if (stage == "OP") {
					// @ts-ignore
					const value = officeData[`open_${TYPES[type]}_programme_${PRODUCTS[product]}`];
					if (value) {
						// @ts-ignore
						if (!result[TYPES[type] + product]) {
							// @ts-ignore
							result[TYPES[type] + product] = {};
						}
						// @ts-ignore
						if (TYPES[type] == "o") {
							// @ts-ignore
							result[TYPES[type] + product][stage] = {
								people: value.doc_count
							};
						} else {
							// @ts-ignore
							result[TYPES[type] + product][stage] = {
								openings: value.doc_count
							};
							
						}
					}
				}
				
				// @ts-ignore
				result["oGX"] = {};
				// @ts-ignore
				result["iCX"] = {};
				
				// @ts-ignore
				result["oGX"]["OP"] = {
					people: officeData["open_ogx"].doc_count
				};
				
				// @ts-ignore
				result["iCX"]["OP"] = {
					openings: officeData["open_icx"].total_openings.value
				}
			}
		}
	}
	
	return result;
}
