import {Filter} from "@/types/types";
import {STAGES_MAP} from "./filter-utils";

export function toTable(data: any, filter: Filter): string[][] {
	//get keys as array
	const offices = Object.keys(data);
	const products = filter.products;
	const statuses = filter.statuses;
	
	const header1 = [""];
	const header2 = [""];
	const header3 = ["Entity"];
	for (const product of products) {
		for (let status of statuses) {
			if (status === "Matched") status = "Accepted by Host";
			
			if (status === "Open") {
				header1.push(...[product]);
				header2.push(...[status]);
				if (product.includes("o")) header3.push(...["People"]);
				else header3.push(...["Openings"]);
			} else {
				if (filter.getApplications) {
					header1.push(product);
					header2.push(status);
					header3.push("Applications");
				}
				if (filter.getPeople) {
					header1.push(product);
					header2.push(status);
					header3.push("People");
				}
			}
		}
		
	}
	
	const headerRows = [header1, header2, header3];
	const valueRows = [];
	
	for (const office of offices) {
		const row = [office];
		for (const product of products) {
			for (const status of statuses) {
				let mappedStatus = ""
				for (const key in STAGES_MAP) {
					// @ts-ignore
					if (STAGES_MAP[key] === status) {
						mappedStatus = key;
						break;
					}
				}
				
				
				if (mappedStatus === "OP") {
					
					if (product.includes("o")) {
						const people = data[office][product][mappedStatus].people;
						row.push(people);
					} else {
						const openings = data[office][product][mappedStatus].openings;
						row.push(openings);
					}
				} else {
					if (filter.getApplications) row.push(data[office][product][mappedStatus].applications);
					if (filter.getPeople) row.push(data[office][product][mappedStatus].people);
				}
			}
		}
		valueRows.push(row);
	}

	return headerRows.concat(valueRows);
}