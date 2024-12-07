import {Filter, Office} from "@/types/types";

const STAGES = {
	OP: "openings",
	APP: "applied",
	ACH: "matched",
	ACC: "an_accepted",
	RRE: "remote_realized",
	APD: "approved",
	RE: "realized",
	FI: "finished",
	CO: "completed"
}
const PRODUCTS = {
	"GV (old)": [1],
	"GT": [2],
	"GE": [5],
	GV: [7],
	GTa: [8],
	GTe: [9],
}
const TYPES = {
	INCOMING: "i",
	OUTGOING: "o"
}

const PRODUCTS_ORDER = ["iGV (old)","iGV", "iGT", "iGE", "iGTa", "iGTe", "oGV (old)", "oGV", "oGT", "oGE", "oGTa", "oGTe"];
const STATUSES_ORDER = ["Open", "Applied", "Matched", "Accepted", "Approved", "Remote Realized", "Realized", "Finished", "Completed"];

export function parseFilters(url: string): Filter {
	const filter = {} as Filter;
  
	const urlParams = new URLSearchParams(url.split("?")[1]); // Extract query params
  
	// Parse the `entity` parameter
	filter.entity = urlParams.get("filters[entity]") || "";
  
	// Parse date range
	const signedUpFrom = urlParams.get("filters[signed_up_on][from]");
	const signedUpTo = urlParams.get("filters[signed_up_on][to]");
	const timePeriodFrom = urlParams.get("filters[time_period][from]");
	const timePeriodTo = urlParams.get("filters[time_period][to]");
  
	filter.from = signedUpFrom || timePeriodFrom || "";
	filter.to = signedUpTo || timePeriodTo || "";
  
	// Other filters can be added here if necessary
	if (urlParams.has("filters[products]")) {
	  const productParams = urlParams.get("filters[products]")!;
	  filter.products = decodeURIComponent(productParams).split(",");
	} else {
	  filter.products = [];
	}
  
	if (urlParams.has("filters[status]")) {
	  const statusParams = urlParams.get("filters[status]")!;
	  filter.statuses = decodeURIComponent(statusParams).split(",");
	} else {
	  filter.statuses = [];
	}
  
	if (urlParams.has("filters[campaign_tag]")) {
	  filter.campaignTag = parseInt(urlParams.get("filters[campaign_tag]")!);
	}
  
	if (urlParams.has("filters[duration_type]")) {
	  filter.durationType = urlParams.get("filters[duration_type]")!;
	}
  
	if (urlParams.has("filters[work_field]")) {
	  filter.workField = urlParams.get("filters[work_field]")!;
	}
  
	// Comparison filters
	if (urlParams.has("filters[compare_with][to]")) {
	  filter.compare = {
		to: urlParams.get("filters[compare_with][to]")!,
		from: urlParams.get("filters[compare_with][from]")!,
	  };
	}
  
	// Feature toggles
	filter.getPeople = urlParams.get("getPeople") === "true";
	filter.getApplications = urlParams.get("getApplications") === "true";
  
	return filter;
  }
  

export function parseData(data: any, offices: Office[], parent: string) {
	const result = {};
	const parentData = {};
	//for each key in data
	for (const key in data) {
		//if key is number
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
