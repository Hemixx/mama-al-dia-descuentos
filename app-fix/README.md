# Arreglo de fuentes e íconos de Mamá al Día

La app publicada en Firebase (`mama-al-dia-31837.web.app`) es un build web de Expo.
Firebase no subió la carpeta `assets/node_modules/` (su configuración por defecto
ignora `**/node_modules/**`), así que 40 de los 46 archivos que pide la app
(tipografías Fraunces y Plus Jakarta Sans, íconos Ionicons e imágenes de expo-router)
responden con la página de inicio. Por eso se ve en Times y con cuadrados en vez de íconos.

Esta carpeta contiene esos archivos reconstruidos desde npm, con el mismo nombre
(el nombre lleva el MD5 del contenido; se verificó que coinciden):

- @expo-google-fonts/fraunces 0.4.1
- @expo-google-fonts/plus-jakarta-sans 0.4.2
- @expo/vector-icons 15.1.1 (Ionicons)
- expo-router 6.0.24 y @react-navigation/elements 2.9.45 (imágenes)

Publicada en Vercel con `Root Directory = app-fix`, sirve estos archivos y reenvía
todo lo demás a la app de Firebase (`vercel.json`).

Arreglo definitivo en Firebase: en `firebase.json` quitar `"**/node_modules/**"` de
`hosting.ignore` y volver a hacer `firebase deploy`.
