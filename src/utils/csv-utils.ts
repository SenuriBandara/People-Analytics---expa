import fs from "node:fs";

export function convert2DArrayToCSV(array: string[][]): string {
	return array.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
}

export function writeCSVToFile(array: string[][], filename: string): void {
	const csvString = convert2DArrayToCSV(array);
	fs.writeFileSync(filename, csvString);
}

