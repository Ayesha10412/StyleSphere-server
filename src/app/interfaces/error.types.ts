export interface TErrorSources {
  path: string;
  message: string;
}
export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: TErrorSources[];
}
export interface IQuery {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  searchTerm?: string;
  [key: string]: string | undefined; // for filters like role, isActive
}