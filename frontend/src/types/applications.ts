export interface Application {
    id: string;
    company: string;
    role: string;
    status: 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    date_added: string;
    url: string;
    match_score: number;
}
