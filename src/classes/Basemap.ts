import GeoMan from '../geoman.js';

export interface IBasemapRawData {
  id: number;
  name: string;
  fields: Array<{k: string}>;
  type: 'Point' | 'LineString' | 'Polygon';
  description?: string;
  color: string;
}

/**
 * Class Basemap yang menyimpan data basemap
 * @class Basemap
 */
export default class Basemap implements IBasemapRawData {
  public id: number;
  public name: string;
  public fields: Array<{k: string}>;
  public type: 'Point' | 'LineString' | 'Polygon';
  public description?: string;
  public color: string;

  private geoman: GeoMan;

  /**
   * Membuat instance dari class Basemap
   * @param geoman instance class GeoMan
   * @param rawData data json raw dari backend
   */
  constructor(geoman: GeoMan, rawData: IBasemapRawData) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.fields = rawData.fields;
    this.type = rawData.type;
    this.description = rawData.description;
    this.color = rawData.color;

    this.geoman = geoman;
  }

  /**
   * Tampilkan basemap di map
   */
  public show() {
    const sourceID: string = `basemap-source-${this.id}`;
    const layerID: string = `basemap-layer-${this.id}`;
    if(!this.geoman.map.getSource(sourceID)) {
      this.geoman.map.addSource(sourceID, {
        type: 'vector',
        tiles: [`${this.geoman.fullURL}/api/maps/basemaps/${this.id}/shapes?x={x}&y={y}&z={z}`]
      });
      this.geoman.sources.push(sourceID);
    }
    
    if(!this.geoman.map.getLayer(layerID)) {
      this.geoman.map.addLayer({
        'id': layerID,
        'type': this.type === 'Point' ? 'circle' : (this.type === 'LineString' ? 'line' : 'fill'),
        'source': sourceID,
        'source-layer': 'basemap',
        'paint': this.getPaintStyle(),
      }, 'tc-basemap-layer-neighbor-label');
      this.geoman.layers.push(layerID);
    } else {
      this.geoman.map.setLayoutProperty(layerID, 'visibility', 'visible');
    }
  }

  /**
   * Sembunyikan basemap dari map
   */
  public hide() {
    const layerID: string = `basemap-layer-${this.id}`;
    if(this.geoman.map.getLayer(layerID)) {
      this.geoman.map.setLayoutProperty(layerID, 'visibility', 'none');
    }
  }

  /**
   * Set opacity dari basemap
   * @param opacity nilai opacity
   */
  public setOpacity(opacity: number) {
    const layerID: string = `basemap-layer-${this.id}`;
    if(this.geoman.map.getLayer(layerID)) {
      this.geoman.map.setPaintProperty(
        layerID,
        (this.type === 'Point' ? 'circle-opacity' : (
          this.type === 'LineString' ? 'line-opacity' : 'fill-opacity'
        )),
        opacity
      );
    }
  }

  /**
   * Memilih object `paint` untuk style layer
   */
  private getPaintStyle() {
    switch(this.type) {
      case 'Point':
        return {
          'circle-color': this.color,
          'circle-radius': 4
        } 
        break;
      case 'LineString':
        return {
          'line-color': this.color,
          'line-width': 3
        }
        break;
      default:
        return {
          'fill-color': this.color,
          'fill-outline-color': this.color
        }
        break;
    }
  }
}