# AI Toborzás Böngésző Kiterjesztés

## Áttekintés

Az **AI Toborzás** egy böngésző kiterjesztés, amely megkönnyíti a toborzási folyamatok automatizálását mesterséges intelligencia segítségével. A kiterjesztés lehetővé teszi, hogy gyorsan és hatékonyan hozzon létre hirdetéseket, és kezelje a toborzási tartalmakat közvetlenül a böngészőből.

## Főbb Funkciók

- **Automatizált hirdetésgenerálás:** AI segítségével percek alatt elkészítheti hirdetéseit.
- **Kép és szöveg kezelése:** Könnyedén letöltheti a generált képeket és másolhatja a szövegeket.
- **Integráció toborzási platformokkal:** Zökkenőmentesen működik együtt a Qdiák és Directus rendszerekkel.
- **Felhasználóbarát felület:** Egyszerű és intuitív kezelőfelület a hatékony munkavégzéshez.

## Telepítés

1. **Kiterjesztés letöltése:**
   - Töltse le a kiterjesztés legújabb verzióját a hivatalos forrásból vagy a [GitHub](#) oldalról.

2. **Telepítés a böngészőben:**
   - Nyissa meg a böngésző kiterjesztéskezelő oldalát (pl. Chrome esetén `chrome://extensions/`).
   - Kapcsolja be a **Fejlesztői módot** a jobb felső sarokban.
   - Kattintson a **Kitömörített bővítmény betöltése** gombra.
   - Válassza ki a kiterjesztés mappáját, amely tartalmazza a `manifest.json` fájlt.

3. **Engedélyek jóváhagyása:**
   - A böngésző kérheti a szükséges engedélyek megadását. Kattintson az **Engedélyezés** gombra.

## Használat

1. **Navigálás a toborzási oldalra:**
   - Látogasson el a toborzási platformra, például a Qdiák vagy Directus webhelyére.

2. **AI gomb megjelenése:**
   - A kiterjesztés automatikusan felismeri a releváns oldalakat, és megjelenít egy varázspálca ikont a fejléchez.

3. **Hirdetés generálása:**
   - Kattintson a varázspálca ikonra a hirdetés generálásának elindításához.
   - A kiterjesztés lekéri a szükséges adatokat, és megjelenít egy modális ablakot a generált tartalommal.

4. **Tartalom kezelése:**
   - A modális ablakban megtekintheti a hirdetési szöveget és a kapcsolódó képet.
   - Használja a **Szöveg másolása** gombot a szöveg vágólapra másolásához.
   - Kattintson a **Kép letöltése** gombra a kép mentéséhez.

5. **Modális ablak bezárása:**
   - A **Bezárás** gombra kattintva visszatérhet az oldalhoz, és folytathatja a munkát.

## Beállítások és Testreszabás

- **Naplózás engedélyezése:** A `content.js` fájlban beállíthatja, mely funkciók naplózzanak a hibakeresés megkönnyítése érdekében.
- **Stílusok testreszabása:** Az inline stílusokat a `content.js` fájlban módosíthatja igényei szerint.
- **URL minták szerkesztése:** A `manifest.json` fájlban frissítheti a kiterjesztés által figyelt URL mintákat.

## Hibajelentés és Támogatás

- **Hibajelentés:** Ha problémát tapasztal, kérjük, jelezze azt a fejlesztőnek vagy nyisson egy hibajegyet a [GitHub](#) oldalon.
- **Dokumentáció:** További információkért és útmutatókért tekintse meg a mellékelt dokumentációt vagy a projekt weboldalát.

## Fejlesztés és Hozzájárulás

- **Forráskód:** A kiterjesztés nyílt forráskódú, és elérhető a [GitHub](#) oldalon.
- **Hozzájárulás:** Szívesen fogadjuk a közösség hozzájárulásait. Kérjük, küldje el javaslatait és módosításait pull request formájában.

## Licenc

Ez a projekt az [MIT licenc](LICENSE) alatt áll.

## Verziótörténet

- **3.1 Verzió:**
  - Naplózási funkciók újra bevezetése a `content.js` fájlban a hibakereséshez.
  - Egyszerűsített `background.js` a telepítési üzenet megjelenítésére.
  - URL kezelés és gomb megjelenítés optimalizálása.
  - Hibajavítások és teljesítményjavítások.

- **3.0 Verzió:**
  - Első stabil kiadás új funkciókkal az AI-alapú toborzáshoz.
  - Felhasználói felület fejlesztése és alapvető funkciók bevezetése.

## Köszönjük, hogy használja az AI Toborzás kiterjesztést!

Ha bármilyen kérdése van vagy segítségre van szüksége, kérjük, forduljon hozzánk bizalommal.
