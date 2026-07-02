import type { Link } from "./link";

export interface Pagination {
    total: number;
    page: number;
    perPage: number;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    pagination?: Pagination;
};

export interface ApiLinkResponse extends ApiResponse {
    data?: Link
}
export interface ApiLinkListResponse extends ApiResponse {
    data?: Link[]
}