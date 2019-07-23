/**
 * Class HTTP untuk request ke backend
 * @class HTTP
 */
export class HTTP {
  private fullURL: string;

  /**
   * Membuat instance dari class HTTP
   * @param baseURL base url server
   * @param port port server
   */
  constructor(baseURL: string, port: number) {
    this.fullURL = `${baseURL}${port === 80 ? '' : `:${port}`}/api`;
  }

  /**
   * HTTP GET ke endpoint
   * @param endpoint endpoint
   */
  public get(endpoint: string) {
    return fetch(this.fullURL + endpoint)
      .then((res: Response) => res.json())
      .then((data: any) => data);
  }
}