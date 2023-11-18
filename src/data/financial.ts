export interface IGetListIssueSnapPayload {
    role?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
    searchKey?: string;
}
export interface IIssueSnapPayload {
    accountId?: string | number;
    snap: number;
}