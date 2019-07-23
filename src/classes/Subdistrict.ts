import GeoMan from "../geoman";
import { District } from "./District";
import { INeighborRawData, Neighbor } from "./Neighbor";

export interface ISubdistrictRawData {
  id: number;
  name: string;
  properties: {[k: string]: string};
  created_at: string;
  updated_at: string;
  district_id: number;
  bbox:[number, number, number, number];
}

/**
 * Class Subdistrict yang menyimpan data kecamatan
 * @class Subdistrict
 */
export class Subdistrict {

  public id: number;
  public name: string;
  public properties: {[k: string]: string};
  public created_at: string;
  public updated_at: string;
  public district_id: number;
  public bbox: [number, number, number, number];

  public district: District;

  private geoman: GeoMan;

  /**
   * Membuat instance dari class Subdistrict
   * @param geoman instance class GeoMan
   * @param rawData data json raw dari backend
   */
  constructor(geoman: GeoMan, district: District, rawData: ISubdistrictRawData) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.properties = rawData.properties;
    this.created_at = rawData.created_at;
    this.updated_at = rawData.updated_at;
    this.district_id = rawData.district_id;
    this.bbox = rawData.bbox;

    this.district = district;

    this.geoman = geoman;
  }

  /**
   * Arahkan map ke kelurahan ini
   */
  public focus() {
    this.geoman.map.fitBounds(this.bbox);
  }

  /**
   * Ambil daftar lingkungan di kelurahan ini
   */
  public getNeighbors() {
    return this.geoman.http.get(`/maps/districts/${this.district.id}/subdistricts/${this.id}/neighbors`)
      .then((data:  INeighborRawData[]) => {
        return data.map((r: INeighborRawData) => new Neighbor(this.geoman, this.district, this, r));
      });
  }

}