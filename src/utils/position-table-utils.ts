export function detailedPositionDataToTable(data: Record<string, any>): string[][] {
    const headers = ["Stage", "Count", "Skills", "Categories", "Locations"];
    const rows = [headers];
  
    for (const stage in data) {
      const entry = data[stage];
  
      rows.push([
        stage,
        entry.count?.toString() || "0",
        entry.skills || "None",
        entry.categories || "None",
        entry.locations || "None",
      ]);
    }
  
    return rows;
  }
  
  export function generateDetailedPositionTables(data: Record<string, any>): Record<string, string[][]> {
    const skillsTable: string[][] = [["Skill", "Count"]];
    const categoriesTable: string[][] = [["Category", "Count"]];
    const locationsTable: string[][] = [["Location", "Count"]];
  
    const addToTable = (table: string[][], items: string) => {
      if (!items) return;
  
      const countMap: Record<string, number> = {};
  
      items.split(", ").forEach((item) => {
        const match = item.match(/^(.*) \((\d+)\)$/);
        if (match) {
          const key = match[1].trim();
          const count = parseInt(match[2], 10);
          countMap[key] = (countMap[key] || 0) + count;
        }
      });
  
      for (const [key, count] of Object.entries(countMap)) {
        table.push([key, count.toString()]);
      }
    };
  
    for (const stage in data) {
      const entry = data[stage];
  
      addToTable(skillsTable, entry.skills);
      addToTable(categoriesTable, entry.categories);
      addToTable(locationsTable, entry.locations);
    }
  
    return {
      skills: skillsTable,
      categories: categoriesTable,
      locations: locationsTable,
    };
  }
  