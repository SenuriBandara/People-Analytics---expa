export function parsePositionData(data: any) {
    const result: Record<string, any> = {};
  
    console.log("Starting to parse Position Analytics data...");
  
    for (const key in data.analytics) {
      const analytics = data.analytics[key];
      console.log(`Processing ${key}`);
  
      // Extracting and formatting data
      const docCount = analytics.doc_count || 0;
      const skills = formatListField(analytics.skills);
      const categories = formatListField(analytics.categories);
      const locations = formatListField(analytics.locations);
  
      console.log("Parsed Fields:");
      console.log(`- docCount: ${docCount}`);
      console.log(`- skills: ${skills}`);
      console.log(`- categories: ${categories}`);
      console.log(`- locations: ${locations}`);
  
      // Assign to result
      result[key] = {
        count: docCount,
        skills,
        categories,
        locations,
      };
    }
  
    console.log("Final Parsed Result:", result);
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
  