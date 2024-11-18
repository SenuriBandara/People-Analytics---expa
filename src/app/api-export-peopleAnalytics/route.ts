import {NextRequest, NextResponse} from "next/server";
import {parseData, parseFilters} from "@/utils/expa-parser-utils";
import {getData} from "@/utils/analytics-api-utils";
import {getOffices} from "@/utils/graphql-api-utils";
import {filterData} from "@/utils/filter-utils";
import {toCompareTable, toTable} from "@/utils/table-utils";
import {convert2DArrayToCSV, removeNaN} from "@/utils/csv-utils";
import {Filter, Office} from "@/types/types";

export async function GET(request: NextRequest) {
	const url = decodeURI(request.url);
	let csvString = await start(url);

	const response = new NextResponse(csvString);
	response.headers.set("Content-Type", "text/csv");
	response.headers.set("Content-Disposition", `attachment; filename="people-analytics.csv"`);
	return response;
}

async function start(url: string) {
	console.log(`Request received for ${url}`);
	
	const filter = parseFilters(url);
	console.log("Applying filters", filter);

	const offices = await getOffices();

	let table;
	if (filter.compare) {
		const [data, compareData] = await Promise.all([
			fetchParseAndFilterData(offices, filter),
			fetchParseAndFilterData(offices, {
				...filter,
				from: filter.compare.from,
				to: filter.compare.to,
			})
		]);

		table = toCompareTable(data, compareData, filter);
	} else {
		const data = await fetchParseAndFilterData(offices, filter);
		table = toTable(data, filter);
	}

	return removeNaN(convert2DArrayToCSV(table));
}

async function fetchParseAndFilterData(offices: Office[], filter: Filter,) {
	const data = await getData(filter);
	const parent = offices.find(office => office.id === filter.entity)?.name!;
	const parsedData = parseData(data, offices, parent);

	return filterData(parsedData, filter);
}
