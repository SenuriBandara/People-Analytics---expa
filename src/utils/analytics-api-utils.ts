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