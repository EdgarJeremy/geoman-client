# geoman-client

`geoman-client` adalah modul untuk pengkoneksian client map dengan server GeoMan. Server yang dimaksud adalah server yang memiliki service backend GeoMan

## Daftar Isi
- [Instalasi](#instalasi)
- [Inisialisasi Map](#inisialisasi-map)
- [Data & Interaksi](#data-dan-interaksi)
  - [Wilayah](#wilayah)
    - [Mengambil Kecamatan](#mengambil-kecamatan)
    - [Mengambil Kelurahan](#mengambil-kelurahan)
    - [Mengambil Lingkungan](#mengambil-lingkungan)
    - [Mengambil Geometry](#mengambil-geometry)
    - [Mengarahkan Peta Ke Wilayah Tertentu](#mengarahkan-peta-ke-wilayah-tertentu)
    - [Menyematkan Event Ke Label Wilayah](#menyematkan-event-ke-label-wilayah)
  - [Basemap](#basemap)
    - [Mengambil Basemap](#mengambil-basemap)
    - [Menampilkan Basemap](#menampilkan-basemap)
    - [Menyembunyikan Basemap](#menyembunyikan-basemap)

---

## Instalasi
Menggunakan CDN

[geoman.min.js](https://unpkg.com/geoman-client@latest/dist/geoman.min.js)

```html
<script src="https://unpkg.com/geoman-client@latest/dist/geoman.min.js"></script>
```

Atau menggunakan package manager

NPM :

`npm install geoman-client`

Yarn :

`yarn add geoman-client`

---

## Inisialisasi Map
Class `GeoMan` akan tersedia di objek `window` jika menggunakan CDN. Jika menggunakan package manager, import class `GeoMan` dari modul `geoman-client`

```javascript
import GeoMan from 'geoman-client'; // ES6
// atau
const GeoMan = require('geoman-client'); // CommonJS
// atau
const GeoMan = window.GeoMan; // browser

const map = new GeoMan(
  'http://localhost', // host ke server GeoMan
  8080, // port ke server GeoMan
  {
    container: 'map', // id container di HTML
    center: [124.842624, 1.4794296], // koordinat tengah map [longitude, latitude]
    zoom: 15, // zoom map
  },
  GeoMan.Styles.LIGHT // tema map : DEFAULT, DARK, LIGHT, WORLD
);
```

---

## Data dan Interaksi
Ada 2 jenis data yang dapat diambil di server map GeoMan. Wilayah dan Basemap.

### Wilayah
Wilayah dibagi 3 tingkatan. Tingkat 1 (kecamatan) disebut `District`, tingkat 2 (kelurahan) disebut `Subdistrict` dan tingkat 3 (lingkungan/desa/rw) disebut `Neighbor`

#### Mengambil Kecamatan

```javascript
map.getDistricts(): Promise<District[]>
```

`getDistricts()` akan me-return promise yang akan resolve dengan nilai array yang berisi instance dari class `District`

#### Mengambil Kelurahan

```javascript
district.getSubdistricts(): Promise<Subdistrict[]>
```

`getSubdistricts()` merupakan method dari class `District`. Variabel `district` diatas adalah instance dari class `District`. Return dari method ini adalah promise yang akan resolve dengan nilai array yang berisi instance dari class `Subdistrict`

#### Mengambil Lingkungan

```javascript
subdistrict.getNeighbors(): Promise<Neighbor[]>
```

`getNeighbors()` merupakan method dari class `Subdistrict`. Variable `subdistrict` diatas adalah instance dari class `Subdistrict`. Return dari method ini adalah promise yang akan resolve dengan nilai array yang berisi instance dari class `Neighbor`

#### Mengambil Geometry
Instance class `District`, `Subdistrict`, dan `Neighbor` memiliki method yang sama untuk mengambil geometry dari wilayah terkait.

```javascript
region.getShape(): Feature
```

Disini, variabel `region` adalah instance dari class `District`, `Subdistrict` atau `Neighbor`. Method `getShape()` akan return object yang merupakan feature geojson


#### Mengarahkan Peta Ke Wilayah Tertentu
Instance class `District`, `Subdistrict`, dan `Neighbor` memiliki method yang sama untuk mengarahkan kamera map ke wilayah tersebut.

```javascript
region.focus(): void
```


### Basemap
Basemap adalah data pada peta. Data ini adalah hasil pengolahan internal dari pihak yang memiliki server GeoMan. Jalan, Bangunan, Lampu Merah, dll adalah contoh dari basemap.

#### Mengambil Basemap

```javascript
map.getBasemaps(): Basemap[]
```

Method `getBasemaps()` akan return array yang berisi instance dari class `Basemap`

#### Menampilkan Basemap

```javascript
basemap.show(): void
```

#### Menyembunyikan Basemap

```javascript
basemap.hide(): void
```

#### Menyematkan Event Ke Label Wilayah
Menyematkan fungsi yang akan dipanggil saat event pada parameter `ev` terjadi
```javascript
map.setRegionLabelEvent(ev: string, regionName: 'district' | 'subdistrict' | 'neighbor', cb: Function): void
```

Contoh
```javascript
map.setRegionLabelEvent('click', 'district', (feature) => {
  console.log(feature); // informasi wilayah yang diklik
});
```
