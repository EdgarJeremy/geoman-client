import GeoMan from "../geoman";
import { ISubdistrictRawData, Subdistrict } from "./Subdistrict";

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

}