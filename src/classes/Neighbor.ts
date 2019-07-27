import GeoMan from "../geoman";
import { District, IDistrictRawData } from "./District";
import { Subdistrict, ISubdistrictRawData } from "./Subdistrict";
import * as turf from '@turf/turf';

export interface INeighborRawData {
  id: number;
  name: string;
  properties: {[k: string]: string};
  created_at: string;
  updated_at: string;
  district_id: number;
  subdistrict_id: number;
  bbox:[number, number, number, number];

  subdistrict: ISubdistrictRawData;
  district: IDistrictRawData;
}

/**
 * Class Neighbor yang menyimpan data kecamatan
 * @class Neighbor
 */
export class Neighbor {

  public id: number;
  public name: string;
  public properties: {[k: string]: string};
  public created_at: string;
  public updated_at: string;
  public district_id: number;
  public subdistrict_id: number;
  public bbox: [number, number, number, number];

  public district: District;
  public subdistrict: Subdistrict;

  private geoman: GeoMan;

  /**
   * Membuat instance dari class Neighbor
   * @param geoman instance class GeoMan
   * @param rawData data json raw dari backend
   */
  constructor(geoman: GeoMan, district: District, subdistrict: Subdistrict, rawData: INeighborRawData) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.properties = rawData.properties;
    this.created_at = rawData.created_at;
    this.updated_at = rawData.updated_at;
    this.district_id = rawData.district_id;
    this.subdistrict_id = rawData.subdistrict_id;
    this.bbox = rawData.bbox;

    this.district = district;
    this.subdistrict = subdistrict;

    this.geoman = geoman;
  }

  /**
   * Arahkan map ke lingkungan ini
   */
  public focus() {
    this.geoman.map.fitBounds(this.bbox);
    
    if(this.geoman.map.getLayer('region-lay')) {
      this.geoman.map.removeLayer('region-lay');
      this.geoman.map.removeSource('region-lay');
    }
    return this.getShape().then((shape) => {
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
   * Ambil bentuk (geometry) dari kelurahan ini
   */
  public getShape() {
    return this.geoman.http.get(`/maps/districts/${this.district.id}/subdistricts/${this.subdistrict.id}/neighbors/${this.id}`)
      .then((data: any) => data.geometry);
  }

}