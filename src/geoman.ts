import mapbox from 'mapbox-gl';
import Basemap, { IBasemapRawData } from './classes/Basemap';
import { HTTP } from './utils/http';
import { IDistrictRawData, District } from './classes/District';

export type GeoManMapStyle = 'DEFAULT' | 'DARK' | 'LIGHT' | 'WORLD';

/**
 * Class utama dari GeoMan
 * @class GeoMan
 */
export default class GeoMan {
  public map: mapbox.Map;
  public sources: string[] = [];
  public layers: string[] = [];
  public fullURL: string;
  private baseURL: string;
  private port: number;

  public static Styles: { [k: string]: GeoManMapStyle } = {
    DEFAULT: 'DEFAULT',
    DARK: 'DARK',
    LIGHT: 'LIGHT',
    WORLD: 'WORLD'
  }

  public http: HTTP;

  /**
   * Membuat instance dari class GeoMan
   * @param baseURL base url server geoman
   * @param port port server geoman
   * @param options map options
   * @param style style map GeoMan: DEFAULT | DARK | LIGHT | WORLD
   */
  constructor(baseURL: string, port: number, options: mapbox.MapboxOptions, style: GeoManMapStyle = 'DEFAULT') {
    this.baseURL = baseURL;
    this.port = port;
    this.fullURL = `${this.baseURL}${this.port === 80 ? '' : `:${this.port}`}`;
    this.http = new HTTP(this.baseURL, this.port);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css';
    document.head.appendChild(link);

    options.style = `${this.fullURL}/api/public/tclayer?port=${this.port}&style=${style.toLowerCase()}`;
    this.map = new mapbox.Map(options);
  }

  /**
   * Set callback saat style map sudah selesai di-load
   */
  public setReadyCallback(fn: (ev: any) => void) {
    this.map.on('style.load', fn);
  }

  /**
   * Tambah GeoJSON ke map
   * @param id string unik untuk menandai layer
   * @param data data geojson
   */
  public addGeoJSON(id: string, type: 'line' | 'symbol' | 'fill' | 'circle', data: mapbox.GeoJSONSourceOptions['data']): mapbox.Map {
    return this.map.addLayer({
      id,
      type,
      source: {
        type: 'geojson',
        data
      },
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
  public getBasemaps() {
    return this.http.get('/maps/basemaps')
      .then((data: IBasemapRawData[] ) => {
        return data.map((r: IBasemapRawData) => new Basemap(this, r));
      });
  }

  /**
   * Ambil daftar kecamatan
   */
  public getDistricts() {
    return this.http.get('/maps/districts')
      .then((data: IDistrictRawData[]) => {
        return data.map((r: IDistrictRawData) => new District(this, r));
      });
  }

  /**
   * Mengubah style map
   * @param style id style
   */
  public setStyle(style: GeoManMapStyle) {
    this.map.setStyle(`${this.fullURL}/api/public/tclayer?port=${this.port}&style=${style.toLowerCase()}`);
  }

}
