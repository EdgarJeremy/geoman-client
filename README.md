## geoman-client

### Persiapan
Tambahkan script geoman di bagian `script` HTML

[geoman.min.js](https://unpkg.com/geoman-client@latest/dist/geoman.min.js)
```html
<script src="https://unpkg.com/geoman-client@latest/dist/geoman.min.js"></script>
```

### Inisialisasi
```javascript
const map = new GeoMap(
  'http://localhost', // host ke server geoman
  8080, // port ke server geoman
  {
    container: 'map', // container di HTML
    center: [124.842624, 1.4794296], // koordinat tengah map [longitude, latitude]
    zoom: 15, // zoom map
  },
  GeoMap.Styles.DARK // tema map : DEFAULT, DARK, LIGHT
);
```

### Mendapatkan daftar basemap
```javascript
const basemaps = await map.getAvailableBasemaps();
```

### Menampilkan dan menyembunyikan basemap
```javascript
const basemaps = await map.getAvailableBasemaps();
basemaps[0].show(); // menampilkan
basemaps[1].hide(); // menyembunyikan
```