// In your parsePeopleData function, or wherever you parse the raw API response:
const PROGRAMME_MAPPING: Record<string, string> = {
  interested_in_programme_9: "interested_in_programme_GTe",
  interested_in_programme_8: "interested_in_programme_GTa",
  interested_in_programme_7: "interested_in_programme_GV",
};

export function parsePeopleData(data: any) {
  const result = {};
  for (const key in data.analytics) {
    // Replace the key if it exists in the mapping
    const mappedKey = PROGRAMME_MAPPING[key] || key;
    result[mappedKey] = data.analytics[key].doc_count;
  }
  return result;
}
