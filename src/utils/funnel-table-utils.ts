export function funnelDataToTable(data: any): string[][] {
    const headers = ["Key", "Document Count", "Applicants Count", "Meta"];
    const rows = [headers];

    // Iterate through each key in the parsed data
    for (const key in data) {
        const item = data[key];

        // Check for nested objects
        if (typeof item === "object" && item !== null) {
            rows.push([
                key,
                item.doc_count?.toString() || "0",
                item.applicants?.toString() || "0",
                JSON.stringify(item.meta) || "",
            ]);
        } else {
            rows.push([key, item.toString(), "", ""]);
        }
    }

    return rows;
}
