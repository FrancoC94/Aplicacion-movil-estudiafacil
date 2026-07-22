# Fuentes Poppins

Aquí van los archivos reales de la fuente Poppins:
- Poppins-Regular.ttf
- Poppins-Bold.ttf
- Poppins-Light.ttf

Descárgalos gratis desde Google Fonts: https://fonts.google.com/specimen/Poppins

Luego, para cargarlas en la app, usa expo-font en App.js, por ejemplo:

```js
import { useFonts } from "expo-font";

const [fontsLoaded] = useFonts({
  "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
});
```

No se incluyen los .ttf reales en este scaffold para no distribuir archivos binarios rotos o con licencias sin verificar.
