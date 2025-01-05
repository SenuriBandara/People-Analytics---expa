import { NextRequest, NextResponse } from "next/server";
import { parseFilters } from "@/utils/expa-parser-utils";
import { getPeopleData } from "@/utils/analytics-api-utils";
import { parsePeopleData } from "@/utils/people-parser-utils";
import { detailedPeopleDataToTable, generateDetailedTables } from "@/utils/people-table-utils";
import { convert2DArrayToCSV, removeNaN } from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
  const url = decodeURI(request.url);
  console.log(`Request received for ${url}`);

  // Step 1: Parse filters from URL
  const filter = parseFilters(url);
  console.log("Applying filters", filter);

  // Step 2: Fetch and parse data
  const data = await getPeopleData(filter);
  const parsedData = parsePeopleData(data);

  // Step 3: Generate the main table and detailed tables
  const mainTable = detailedPeopleDataToTable(parsedData);
  const { skills, referrals, leadAssignments, backgrounds } = generateDetailedTables(parsedData);

  // Step 4: Combine all tables into a single CSV
  const combinedCsv = [
    convert2DArrayToCSV(mainTable),
    "\n\nSkills Details\n",
    convert2DArrayToCSV(skills),
    "\n\nReferrals Details\n",
    convert2DArrayToCSV(referrals),
    "\n\nLead Assignments Details\n",
    convert2DArrayToCSV(leadAssignments),
    "\n\nBackgrounds Details\n",
    convert2DArrayToCSV(backgrounds),
  ].join("");

  // Step 5: Return the response
  const response = new NextResponse(removeNaN(combinedCsv));
  response.headers.set("Content-Type", "text/csv");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="people-analytics.csv"`
  );
  return response;
}
