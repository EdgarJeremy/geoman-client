import mapbox from 'mapbox-gl';
import Basemap, { IBasemapRawData } from './classes/Basemap';

/**
 * Class GeoMan
 */
export default class GeoMan {
  public map: mapbox.Map;
  public sources: string[] = [];
  public layers: string[] = [];
  public fullURL: string;
  private baseURL: string;
  private port: number;
  private avaiableBasemaps: Basemap[] = [];

  /**
   * Membuat instance dari class GeoMan
   * @param baseURL base url server geoman
   * @param port port server geoman
   * @param options map options
   */
  constructor(baseURL: string, port: number, options: mapbox.MapboxOptions) {
    this.baseURL = baseURL;
    this.port = port;
    this.fullURL = `${this.baseURL}${this.port === 80 ? '' : `:${this.port}`}`;
    options.style = `${this.fullURL}/api/public/tclayer?port=${this.port}`;
    this.map = new mapbox.Map(options);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css';
    document.head.appendChild(link);
  }

  /**
   * Tambah GeoJSON ke map
   * @param id string unik untuk menandai layer
   * @param data data geojson
   */
  public addGeoJSON(id: string, data: mapbox.GeoJSONSourceOptions['data']): mapbox.Map {
    return this.map.addLayer({
      id,
      source: {
        type: 'geojson',
        data
      }
    });
  }

  /**
   * Hapus layer GeoJSON dari map
   * @param id id layer untuk dihapus
   */
  public removeGeoJSON(id: string): mapbox.Map {
    return this.map.removeLayer(id);
  }

  /**
   * Ambil daftar basemap publik
   */
  public getAvailableBasemaps() {
    return fetch(`${this.fullURL}/api/basemaps?attributes=id,name,fields,type,description,color&limit=-1`)
      .then((res: Response) => res.json())
      .then((data: any) => data.data)
      .then((data: any) => {
        this.avaiableBasemaps = data.rows.map((r: IBasemapRawData) => new Basemap(this, r));
        return this.avaiableBasemaps;
      });
  }

}
