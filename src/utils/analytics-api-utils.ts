import {Filter} from "@/types/types";

const EXPA_ANALYTICS_ENDPOINT = "https://analytics.api.aiesec.org/";
const PERFORMANCE_ANALYTICS = "v2/applications/analyze.json";

export async function getData(filter: Filter) {
	const url = constructUrl(filter);
	console.log(`Fetching data from ${url}`);
	
	const response = await fetch(url);
	return response.json();
}

function constructUrl(filter: Filter) {
	let url = `${EXPA_ANALYTICS_ENDPOINT}${PERFORMANCE_ANALYTICS}?access_token=${process.env.EXPA_ACCESS_TOKEN}&start_date=${filter.from}&end_date=${filter.to}&performance_v3%5Boffice_id%5D=${filter.entity}`;
	
	if (filter.campaignTag) {
		url += `&performance_v3%5Bcampaign_filter%5D=${filter.campaignTag}`;
	}
	
	if (filter.durationType) {
		url += `&performance_v3%5Bduration_types%5D[]=${filter.durationType}`;
	}
	
	if (filter.workField) {
		url += `&performance_v3%5Bsub_product_ids%5D[]=${filter.workField}`;
	}

	return url;
}

const PEOPLE_ANALYTICS = "v2/applications/analyze.json";

export async function getPeopleData(filter: Filter) {
  const url = constructPeopleAnalyticsUrl(filter);
  console.log(`Fetching people data from ${url}`);

  const response = await fetch(url);
  return response.json();
}

function constructPeopleAnalyticsUrl(filter: Filter) {
  let url = `${EXPA_ANALYTICS_ENDPOINT}${PEOPLE_ANALYTICS}?access_token=${process.env.EXPA_ACCESS_TOKEN}&start_date=${filter.from}&end_date=${filter.to}&people_analytics%5Boffice_id%5D=${filter.entity}`;

  // Add additional filters if needed

  return url;
}
const POSITION_ANALYTICS = "v2/applications/analyze.json";

export async function getPositionData(filter: Filter) {
  const url = constructPositionAnalyticsUrl(filter);
  console.log(`Fetching position data from ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    throw new Error("Failed to fetch position data.");
  }

  const jsonData = await response.json();
  console.log("Fetched Position Data:", jsonData);
  return jsonData;
}

export async function getPositionData(filter: Filter) {
  const url = constructPositionAnalyticsUrl(filter);
  console.log(`Fetching position data from ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    throw new Error("Failed to fetch position data.");
  }

  const jsonData = await response.json();

  // Log the full JSON response
  console.log("Full Fetched Position Data:", JSON.stringify(jsonData, null, 2));

  // Log top-level keys to understand the structure
  console.log("Top-level keys in fetched data:", Object.keys(jsonData));

  return jsonData;
}

function constructPositionAnalyticsUrl(filter: Filter): string {
  const url = new URL(`${EXPA_ANALYTICS_ENDPOINT}${POSITION_ANALYTICS}`);

  // Required params
  url.searchParams.append("access_token", process.env.EXPA_ACCESS_TOKEN || "");
  if (filter.entity) {
    url.searchParams.append("position[office_id]", filter.entity);
  }

  // Additional filters
  if (filter.role) {
    url.searchParams.append("position[role_ids][]", filter.role);
  }
  if (filter.department) {
    url.searchParams.append("position[department_ids][]", filter.department);
  }
  if (filter.backgrounds) {
    url.searchParams.append("position[background_ids][]", filter.backgrounds);
  }
  if (filter.status) {
    url.searchParams.append("position[statuses][]", filter.status);
  }

  // Log the constructed URL
  console.log("Constructed URL:", url.toString());

  return url.toString();
}

// Parsing Function with Detailed Logging
export function parsePositionData(data: any) {
  console.log("Starting Position Data Parsing...");

  const result: Record<string, any> = {};

  // Log incoming data
  console.log("Raw Position Data:", JSON.stringify(data, null, 2));

  // Assuming the structure is iterable, parse keys
  for (const key in data) {
    const value = data[key];

    console.log(`Processing Key: ${key}`);
    console.log("Value at Key:", JSON.stringify(value, null, 2));

    if (typeof value === "object" && value !== null) {
      // Example of parsing a nested object
      result[key] = {
        docCount: value.doc_count || 0,
        applicants: value.applicants?.value || 0,
      };

      console.log("Parsed Entry:", result[key]);
    } else {
      console.log(`Skipping Key: ${key}, Value is not an object`);
    }
  }

  console.log("Final Parsed Position Data:", JSON.stringify(result, null, 2));
  return result;
}
