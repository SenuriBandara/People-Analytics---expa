export function detailedPeopleDataToTable(data: Record<string, any>): string[][] {
  // Define headers for the CSV structure
  const headers = [
    "Stage",
    "Count",
    "Skills",
    "Referrals",
    "Lead Assignments",
    "Backgrounds",
  ];
  const rows = [headers];

  // Iterate through each stage in the data
  for (const stage in data) {
    const entry = data[stage];

    // Format fields to display items on new lines within a single cell
    const formattedSkills = entry.skills
      ? entry.skills.split(", ").join(";\n ")
      : "None";
    const formattedReferrals = entry.referral
      ? entry.referral.split(", ").join(";\n ")
      : "None";
    const formattedBackgrounds = entry.backgrounds
      ? entry.backgrounds.split(", ").join(";\n ")
      : "None";
    const leadAssignments = entry.lead_assignment || "None";

    // Add the row for the current stage
    rows.push([
      stage, // Stage name
      entry.count?.toString() || "0", // Count
      formattedSkills, // Skills formatted with new lines
      formattedReferrals, // Referrals formatted with new lines
      leadAssignments, // Lead assignments
      formattedBackgrounds, // Backgrounds formatted with new lines
    ]);
  }

  return rows;
}
export function generateDetailedTables(data: Record<string, any>): Record<string, string[][]> {
  // Initialize tables
  const skillsTable: string[][] = [["Skill", "Count"]];
  const referralsTable: string[][] = [["Referral Source", "Count"]];
  const leadAssignmentsTable: string[][] = [["Lead Assignment", "Count"]];
  const backgroundsTable: string[][] = [["Background", "Count"]];

  const addToTable = (table: string[][], items: string) => {
    if (!items) return;

    // Parse items and aggregate counts
    const countMap: Record<string, number> = {};

    items.split(", ").forEach((item) => {
      const match = item.match(/^(.*) \((\d+)\)$/);
      if (match) {
        const key = match[1].trim();
        const count = parseInt(match[2], 10);
        countMap[key] = (countMap[key] || 0) + count;
      }
    });

    // Push aggregated results to the table
    for (const [key, count] of Object.entries(countMap)) {
      table.push([key, count.toString()]);
    }
  };

  // Populate the tables
  for (const stage in data) {
    const entry = data[stage];

    addToTable(skillsTable, entry.skills);
    addToTable(referralsTable, entry.referral);
    addToTable(leadAssignmentsTable, entry.lead_assignment);
    addToTable(backgroundsTable, entry.backgrounds);
  }

  return {
    skills: skillsTable,
    referrals: referralsTable,
    leadAssignments: leadAssignmentsTable,
    backgrounds: backgroundsTable,
  };
}
