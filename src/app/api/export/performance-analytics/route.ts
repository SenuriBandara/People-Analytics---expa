import {NextRequest, NextResponse} from "next/server";
import {parseData, parseFilters} from "@/utils/expa-parser-utils";
import {getData} from "@/utils/analytics-api-utils";
import {getOffices} from "@/utils/graphql-api-utils";
import {filterData} from "@/utils/filter-utils";
import {toCompareTable, toTable} from "@/utils/table-utils";
import {convert2DArrayToCSV, removeNaN} from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
	const url = decodeURI(request.url);
	let csvString = await start(url);

	const response = new NextResponse(csvString);
	response.headers.set("Content-Type", "text/csv");
	response.headers.set("Content-Disposition", `attachment; filename="performance-analytics.csv"`);
	return response;
}

async function start(url: string) {
	console.log(`Request received for ${url}`);
	
	const filter = parseFilters(url);
	console.log("Applying filters", filter);
	
	const data = await getData(filter);

	const offices = await getOffices();
	
	const parent = offices.find(office => office.id === filter.entity)?.name!;
	const parsedData = parseData(data, offices, parent);

	const filteredData = filterData(parsedData, filter);

	let compareFilteredData;
	if (filter.compare) {
		const compareData = await getData({
			...filter,
			from: filter.compare.from,
			to: filter.compare.to,
		});
		const compareParsedData = parseData(compareData, offices, parent);
		compareFilteredData = filterData(compareParsedData, filter);
	}

	let table;
	if (filter.compare) {
		table = toCompareTable(filteredData, compareFilteredData, filter);
	} else {
		table = toTable(filteredData, filter);
	}


	return removeNaN(convert2DArrayToCSV(table));
}

