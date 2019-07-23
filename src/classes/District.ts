import GeoMan from "../geoman";
import { ISubdistrictRawData, Subdistrict } from "./Subdistrict";
import * as turf from '@turf/turf';

export interface IDistrictRawData {
  id: number;
  name: string;
  properties: {[k: string]: string};
  created_at: string;
  updated_at: string;
  bbox:[number, number, number, number];
}

/**
 * Class District yang menyimpan data kecamatan
 * @class District
 */
export class District {

  public id: number;
  public name: string;
  public properties: {[k: string]: string};
  public created_at: string;
  public updated_at: string;
  public bbox: [number, number, number, number];
  
  private geoman: GeoMan;

  /**
   * Membuat instance dari class District
   * @param geoman instance class GeoMan
   * @param rawData data json raw dari backend
   */
  constructor(geoman: GeoMan, rawData: IDistrictRawData) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.properties = rawData.properties;
    this.created_at = rawData.created_at;
    this.updated_at = rawData.updated_at;
    this.bbox = rawData.bbox;

    this.geoman = geoman;
  }

  /**
   * Arahkan map ke kecamatan ini
   */
  public focus() {
    this.geoman.map.fitBounds(this.bbox);
    
    if(this.geoman.map.getLayer('region-lay')) {
      this.geoman.map.removeLayer('region-lay');
      this.geoman.map.removeSource('region-lay');
    }
    this.getShape().then((shape) => {
      const earth = turf.polygon([[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]]);
      const lay: any = turf.difference(earth, shape);
      this.geoman.map.addLayer({
        id: 'region-lay',
        type: 'fill',
        source: {
          type: 'geojson',
          data: lay
        },
        paint: {
          'fill-color': 'rgba(0,0,0,.6)'
        }
      });
    });
  }

  /**
   * Ambil daftar kelurahan dibawah kecamatan ini
   */
  public getSubdistricts() {
    return this.geoman.http.get(`/maps/districts/${this.id}/subdistricts`)
      .then((data: ISubdistrictRawData[]) => {
        return data.map((r: ISubdistrictRawData) => new Subdistrict(this.geoman, this, r));
      });
  }

  /**
   * Ambil bentuk (geometry) dari kecamatan ini
   */
  public getShape() {
    return this.geoman.http.get(`/maps/districts/${this.id}`)
      .then((data: any) => data.geometry);
  }

}