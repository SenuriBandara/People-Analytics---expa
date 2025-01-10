import { NextRequest, NextResponse } from "next/server";
import { parseFilters } from "@/utils/expa-parser-utils";
import { getPositionData } from "@/utils/analytics-api-utils";
import { parsePositionData } from "@/utils/position-parser-utils";
import { detailedPositionDataToTable, generateDetailedPositionTables } from "@/utils/position-table-utils";
import { convert2DArrayToCSV, removeNaN } from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
  const url = decodeURI(request.url);
  console.log(`Request received for ${url}`);

  // Step 1: Parse filters from URL
  const filter = parseFilters(url);
  console.log("Applying filters", filter);

  // Step 2: Fetch and parse data
  const data = await getPositionData(filter);
  const parsedData = parsePositionData(data);

  // Step 3: Generate the main table and detailed tables
  const mainTable = detailedPositionDataToTable(parsedData);
  const { skills, categories, locations } = generateDetailedPositionTables(parsedData);

  // Step 4: Combine all tables into a single CSV
  const combinedCsv = [
    convert2DArrayToCSV(mainTable),
    "\n\nSkills Details\n",
    convert2DArrayToCSV(skills),
    "\n\nCategories Details\n",
    convert2DArrayToCSV(categories),
    "\n\nLocations Details\n",
    convert2DArrayToCSV(locations),
  ].join("");

  // Step 5: Return the response
  const response = new NextResponse(removeNaN(combinedCsv));
  response.headers.set("Content-Type", "text/csv");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="position-analytics.csv"`
  );
  return response;
}
