import {NextRequest, NextResponse} from "next/server";
import {parseData, parseFilters} from "@/utils/expa-parser-utils";
import {getData} from "@/utils/analytics-api-utils";
import {getOffices} from "@/utils/graphql-api-utils";
import {filterData} from "@/utils/filter-utils";
import {toTable} from "@/utils/table-utils";
import {convert2DArrayToCSV} from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
	const url = decodeURI(request.url);
	const csvString = await start(url);
	
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
	
	const table = toTable(filteredData, filter);
	return convert2DArrayToCSV(table);
}

