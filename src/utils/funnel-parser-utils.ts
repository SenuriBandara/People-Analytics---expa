// funnel-parser-utils.ts

export interface FunnelCommittee {
    id: string;
    name: string;
    tag: string;
    parentName?: string; // e.g. "Germany"
  }
  
  export function parseFunnelData(data: any) {
    const analytics = data.analytics || {};
    
    return {
        finished_count: {
            doc_count: analytics.finished_count?.doc_count || 0,
            applicants: analytics.finished_count?.applicants?.value || 0,
        },
        matched_count: {
            doc_count: analytics.matched_count?.doc_count || 0,
            applicants: analytics.matched_count?.applicants?.value || 0,
        },
        realized_count: {
            doc_count: analytics.realized_count?.doc_count || 0,
            applicants: analytics.realized_count?.applicants?.value || 0,
        },
        completed_count: {
            doc_count: analytics.completed_count?.doc_count || 0,
            applicants: analytics.completed_count?.applicants?.value || 0,
        },
        approved_count: {
            doc_count: analytics.approved_count?.doc_count || 0,
            applicants: analytics.approved_count?.applicants?.value || 0,
        },
        applied_count: {
            doc_count: analytics.applied_count?.doc_count || 0,
            applicants: analytics.applied_count?.applicants?.value || 0,
        },
        timings: {
            sign_up_to_applied: analytics.sign_up_to_applied_time || 0,
            applied_to_matched: analytics.applied_to_matched_time || 0,
            matched_to_approved: analytics.matched_to_approved_time || 0,
            approved_to_realized: analytics.approved_to_realized_time || 0,
            realized_to_finished: analytics.realized_to_finished_time || 0,
            finished_to_completed: analytics.finished_to_completed_time || 0,
        },
    };
}
