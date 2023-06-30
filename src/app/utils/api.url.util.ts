const apiUrl = 'https://dummyjson.com';

export function makeApiUrl(urlPath: string): string {
    return apiUrl + urlPath;
}
