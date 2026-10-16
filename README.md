# Descuentos · Mamá al Día

Cupones para bebés y mujeres, y panoramas para familias con niños pequeños en Chile (Santiago y regiones), que muestra la app **Mamá al Día** (https://mama-al-dia-31837.web.app).

- `deals.json`: cupones para bebés y mujeres. Los actualiza todos los días una rutina de Claude en la nube.
- `panoramas.json`: panoramas y cafeterías con juegos por edad, en Santiago y regiones. Se actualizan todos los días con otra rutina.
- `check-deals.mjs` y `check-panoramas.mjs`: validan el formato y quitan lo vencido.

La información se obtiene de páginas públicas; revisa siempre las condiciones en el sitio de cada tienda.

## Sección Descubre (web)

- `docs/`: la sección Descubre rediseñada, publicada con GitHub Pages en https://hemixx.github.io/mama-al-dia-descuentos/. Lee `deals.json` y `panoramas.json` en vivo desde GitHub y trae una copia incluida por si no hay conexión. Se puede agregar a la pantalla de inicio del celular.
- `prototipos/descubre.html`: la plantilla de esa página, con los datos como marcadores `/*__DEALS__*/` y `/*__PANOS__*/`.
