const PROGRAMME_MAPPING: Record<string, string> = {
  interested_in_programme_9: "interested_in_programme_GTe",
  interested_in_programme_8: "interested_in_programme_GTa",
  interested_in_programme_7: "interested_in_programme_GV",
};

export function parsePeopleData(data: any) {
  const result: Record<string, any> = {};

  for (const key in data.analytics) {
    const mappedKey = PROGRAMME_MAPPING[key] || key;
    const analytics = data.analytics[key];

    // Extracting and formatting data
    const docCount = analytics.doc_count || 0;
    const skills = formatListField(analytics.skills);
    const referral = formatListField(analytics.referral);
    const leadAssignment = formatListField(analytics.lead_assignment);
    const backgrounds = formatListField(analytics.backgrounds);

    // Assign to result
    result[mappedKey] = {
      count: docCount,
      skills,
      referral,
      lead_assignment: leadAssignment,
      backgrounds,
    };
  }

  return result;
}


// Helper function to format list fields
function formatListField(field: any): string {
  if (!field || !Array.isArray(field.buckets)) {
    console.log("Field is missing or invalid:", field);
    return ""; // Handle missing or empty fields
  }

  const formatted = field.buckets
    .map((bucket: any) => `${bucket.key} (${bucket.doc_count})`)
    .join(", ");
  console.log("Formatted List Field:", formatted);
  return formatted;
}
