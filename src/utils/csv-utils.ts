import fs from "node:fs";

export function convert2DArrayToCSV(array: string[][]): string {
	return array.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
}


export function removeNaN(csvString: string): string {
	let csvString2 = csvString;
	csvString2 = csvString2 .replaceAll("NaN%", "-");
	csvString2 = csvString2.replaceAll("Infinity%", "-");
	return csvString2;
}
