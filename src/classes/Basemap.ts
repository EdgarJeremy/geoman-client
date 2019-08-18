import mapbox from 'mapbox-gl';
import GeoMan from '../geoman.js';

export interface IBasemapRawData {
  id: number;
  name: string;
  fields: Array<{ k: string }>;
  type: 'Point' | 'LineString' | 'Polygon';
  description?: string;
  color: string;
}

export interface ICustomLayerStyle {
  main_color?: string | string[];
  main_size: number | string[];
  border_color?: string | string[];
  border_size: number | string[];
}

/**
 * Class Basemap yang menyimpan data basemap
 * @class Basemap
 */
export default class Basemap implements IBasemapRawData {
  public id: number;
  public name: string;
  public fields: Array<{ k: string }>;
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
  public show(options?: ICustomLayerStyle) {
    const sourceID: string = `basemap-source-${this.id}`;
    const layerID: string = `basemap-layer-${this.id}`;
    if (!this.geoman.map.getSource(sourceID)) {
      this.geoman.map.addSource(sourceID, {
        type: 'vector',
        tiles: [`${this.geoman.fullURL}/api/maps/basemaps/${this.id}/shapes?x={x}&y={y}&z={z}`]
      });
      this.geoman.sources.push(sourceID);
    }

    if (!this.geoman.map.getLayer(layerID)) {
      this.geoman.map.addLayer({
        'id': layerID,
        'type': this.type === 'Point' ? 'circle' : (this.type === 'LineString' ? 'line' : 'fill'),
        'source': sourceID,
        'source-layer': 'basemap',
        'paint': this.getPaintStyle(options ? options : { main_size: 1, border_size: 1 }),
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
    if (this.geoman.map.getLayer(layerID)) {
      this.geoman.map.setLayoutProperty(layerID, 'visibility', 'none');
    }
  }

  /**
   * Set opacity dari basemap
   * @param opacity nilai opacity
   */
  public setOpacity(opacity: number) {
    const layerID: string = `basemap-layer-${this.id}`;
    if (this.geoman.map.getLayer(layerID)) {
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
   * Set paint style layer
   * @param options options
   * @param options.main_color warna utama
   * @param options.main_size ukuran utama. 
   * @param options.border_color warna border
   * @param options.border_size ukuran border
   */
  public setStyle(options: ICustomLayerStyle) {
    const layerID: string = `basemap-layer-${this.id}`;
    if (this.geoman.map.getLayer(layerID)) {
      switch (this.type) {
        case 'Point':
          this.geoman.map.setPaintProperty(layerID, 'circle-color', options.main_color ? options.main_color : this.color);
          this.geoman.map.setPaintProperty(layerID, 'circle-radius', options.main_size);
          this.geoman.map.setPaintProperty(layerID, 'circle-stroke-color', options.border_color ? options.border_color : this.color);
          this.geoman.map.setPaintProperty(layerID, 'circle-stroke-width', options.border_size);
          break;
        case 'LineString':
          this.geoman.map.setPaintProperty(layerID, 'line-color', options.main_color ? options.main_color : this.color);
          this.geoman.map.setPaintProperty(layerID, 'line-width', options.main_size);
          break;
        default:
          this.geoman.map.setPaintProperty(layerID, 'fill-color', options.main_color ? options.main_color : this.color);
          this.geoman.map.setPaintProperty(layerID, 'fill-outline-color', options.border_color ? options.border_color : this.color);
          break;
      }
    }
  }

  /**
   * Set event ke layer
   * @param ev nama event
   * @param cb callback
   */
  public on(ev: 'touchcancel' | 'touchend' | 'touchstart' | 'click' | 'contextmenu' | 'dblclick' | 'mousemove' | 'mouseup' | 'mousedown' | 'mouseout' | 'mouseover' | 'mouseenter' | 'mouseleave', cb: (feature: mapbox.MapboxGeoJSONFeature | null, ev: (mapbox.MapTouchEvent & {
    features?: mapbox.MapboxGeoJSONFeature[] | undefined;
  } & mapbox.EventData) | (mapbox.MapMouseEvent & {
    features?: mapbox.MapboxGeoJSONFeature[] | undefined;
  } & mapbox.EventData)) => void) {
    const layerName: string = `basemap-layer-${this.id}`;
    this.geoman.map.on(ev, layerName, (d) => cb(d.features ? d.features[0] : null, d));
    this.geoman.map.on('mouseenter', layerName, (e) => {
      this.geoman.map.getCanvas().style.cursor = 'pointer';
    });
    this.geoman.map.on('mouseleave', layerName, (e) => {
      this.geoman.map.getCanvas().style.cursor = '';
    });
  }

  /**
   * Memilih object `paint` untuk style layer
   * @param options options
   * @param options.main_color warna utama
   * @param options.main_size ukuran utama. 
   * @param options.border_color warna border
   * @param options.border_size ukuran border
   */
  private getPaintStyle(options: ICustomLayerStyle) {
    switch (this.type) {
      case 'Point':
        return {
          'circle-color': options.main_color ? options.main_color : this.color,
          'circle-radius': options.main_size,
          'circle-stroke-color': options.border_color ? options.border_color : this.color,
          'circle-stroke-width': options.border_size,
        }
        break;
      case 'LineString':
        return {
          'line-color': options.main_color ? options.main_color : this.color,
          'line-width': options.main_size
        }
        break;
      default:
        return {
          'fill-color': options.main_color ? options.main_color : this.color,
          'fill-outline-color': options.border_color ? options.border_color : this.color
        }
        break;
    }
  }
}