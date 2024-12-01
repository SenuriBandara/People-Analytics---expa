import {Office} from "@/types/types";

const GRAPHQL_ENDPOINT = "https://gis-api.aiesec.org/graphql";

export async function getOffices(): Promise<Office[]> {
	console.log("Fetching offices");
	
	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `${process.env.EXPA_ACCESS_TOKEN}`
		},
		body: JSON.stringify({
			operationName: "committees",
			query:
				`query committees($perPage: Int, $sort: String) {
					committees(per_page: $perPage, sort: $sort) {
						data {
							id,
							name,
						}
					}
				}
			`,
			variables: {
				"perPage": 2000,
				"sort": "+name"
			}
		})
	});
	
	const responseJson = await response.json();
	try {
		return responseJson.data.committees.data;
	} catch (error) {
		console.error("Failed to fetch offices", error);
		console.log("Response", responseJson);
		throw error;
	}
}
