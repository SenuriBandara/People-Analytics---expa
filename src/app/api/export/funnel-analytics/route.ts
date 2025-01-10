import { NextRequest, NextResponse } from "next/server";
import { parseFunnelData } from "@/utils/funnel-parser-utils";
import { funnelDataToTable } from "@/utils/funnel-table-utils";
import { convert2DArrayToCSV, removeNaN } from "@/utils/csv-utils";

export async function GET(request: NextRequest) {
  try {
    // 1) Extract filters from query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // For example:
    const products = searchParams.get("filters[products]") || "iGTe";
    const entity = searchParams.get("filters[entity]") || "1559";
    const from = searchParams.get("filters[time_period][from]") || "2025-01-09";
    const to = searchParams.get("filters[time_period][to]") || "2025-01-09";
    const aiesecer = searchParams.get("filters[aiesecer]") === "true";

    // 2) Fetch data from GraphQL
    const rawData = await fetchFunnelData(products, entity, from, to, aiesecer);

    // 3) Parse the funnel data
    const parsedData = parseFunnelData(rawData);

    // 4) Convert data to table
    const table = funnelDataToTable(parsedData);

    // 5) Generate CSV
    let csvString = convert2DArrayToCSV(table);
    csvString = removeNaN(csvString);

    // 6) Return CSV as file download
    const response = new NextResponse(csvString);
    response.headers.set("Content-Type", "text/csv");
    response.headers.set("Content-Disposition", `attachment; filename="funnel-analytics.csv"`);
    return response;

  } catch (error: any) {
    console.error("Funnel Analytics Error:", error);
    return new NextResponse("An error occurred while generating funnel analytics CSV.", { status: 500 });
  }
}

// Helper function to fetch funnel data from GraphQL
async function fetchFunnelData(products: string, entity: string, from: string, to: string, aiesecer: boolean) {
  // This is an example GraphQL query based on the data you shared
  // Adjust it to match how EXPA queries the funnel
  const query = `
    query committees($perPage: Int, $sort: String) {
      committees(per_page: $perPage, sort: $sort) {
        data {
          id,
          name,
          tag,
          parent {
            id,
            name
          }
        }
      }
    }
  `;

  const response = await fetch("https://gis-api.aiesec.org/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "kPI-j1KKQ6ZmggMLMTnfTfg42l2ITjUphNjAHkjgiA8", // or process.env.EXPA_ACCESS_TOKEN
    },
    body: JSON.stringify({
      query,
      variables: {
        perPage: 100,
        sort: "+name",
        // Maybe add your filters if needed
      },
    }),
  });

  if (!response.ok) throw new Error("Failed to fetch funnel data from GraphQL");
  return response.json(); // Return the JSON body
}
