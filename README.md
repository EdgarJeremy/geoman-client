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
    center: [longitude, latitude], // koordinat tengah map
    zoom: 15, // zoom map
  }
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