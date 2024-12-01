export function peopleDataToTable(data: any): string[][] {
    const headers = ["Status", "Count"];
    const rows = [headers];
  
    for (const status in data) {
      rows.push([status, data[status].toString()]);
    }
  
    return rows;
  }
  