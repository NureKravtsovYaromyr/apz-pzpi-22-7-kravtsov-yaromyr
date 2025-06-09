export interface IPaginationResponse<I>{
    data: I,
    limit: number,
    total: number,
    page:number
}