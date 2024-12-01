import { NextRequest, NextResponse } from "next/server";
import { parseFilters } from "@/utils/expa-parser-utils";
import { getPeopleData } from "@/utils/analytics-api-utils";
import { parsePeopleData } from "@/utils/people-parser-utils";
import { peopleDataToTable } from "@/utils/people-table-utils";
import { convert2DArrayToCSV, removeNaN } from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
  const url = decodeURI(request.url);
  let csvString = await start(url);

  const response = new NextResponse(csvString);
  response.headers.set("Content-Type", "text/csv");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="people-analytics.csv"`
  );
  return response;
}

async function start(url: string) {
  console.log(`Request received for ${url}`);

  const filter = parseFilters(url);
  console.log("Applying filters", filter);

  const data = await getPeopleData(filter);
  const parsedData = parsePeopleData(data);
  const table = peopleDataToTable(parsedData);

  return removeNaN(convert2DArrayToCSV(table));
}
