export function parsePeopleData(data: any) {
    const result = {};
  
    for (const key in data.analytics) {
      const categoryData = data.analytics[key];
      result[key] = categoryData.doc_count;
    }
  
    return result;
  }
  