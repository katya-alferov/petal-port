# מדריך: העלאת Petalport ל-Google Play

הכל מוכן במאגר: פרויקט אנדרואיד (Trusted Web Activity) שפותח את המשחק מ-GitHub Pages במסך מלא, בנייה אוטומטית של הקובץ לחנות, אייקונים, תמונת נושא, 8 צילומי מסך, טקסטים לדף החנות ([play/listing.md](play/listing.md)) ודף מדיניות פרטיות.
מה שנשאר הם צעדים שרק בעלת החשבון יכולה לעשות. הסדר חשוב.

**עלות:** 25$ פעם אחת (חשבון מפתחת ב-Google Play). שאר הדברים חינמיים.
**זמן:** כשבועיים וחצי בגלל בדיקה סגורה חובה של 14 יום לחשבונות אישיים חדשים.

## פרטים קבועים (לא משנים אחרי ההעלאה הראשונה)

| | |
| --- | --- |
| שם החבילה (Package name) | `io.github.katya_alferov.petalport` |
| כתובת המשחק | https://katya-alferov.github.io/petal-port/ |
| מדיניות פרטיות | https://katya-alferov.github.io/petal-port/privacy.html |
| טביעת מפתח ההעלאה (SHA-256) | `ED:7D:4B:22:78:61:71:8E:C7:A7:7A:51:E7:28:2B:3A:E3:56:8C:B5:8C:8B:E7:98:8D:83:2C:B2:05:B4:59:18` |

מפתח ההעלאה עצמו והסיסמה שלו שמורים בתיקיית הפרויקט הפרטית (`petalport/android-signing/`), לא במאגר הציבורי. במאגר יש רק עותק מוצפן שלו. כדאי לשמור גיבוי של התיקייה הזו.

## שלב 1: פתיחת חשבון מפתחת (רק את)

1. כדאי לפתוח קודם כתובת Gmail חדשה למשחק. הכתובת תופיע בפומבי בדף החנות.
2. נכנסים ל-https://play.google.com/console/signup עם הכתובת הזו.
3. בוחרים **Personal** (חשבון אישי, לא ארגון).
4. ממלאים פרטים, משלמים 25$ ומאמתים זהות (תעודה מזהה). גוגל מבקשת גם לאמת מספר טלפון, ולפעמים גישה לטלפון אנדרואיד דרך אפליקציית Play Console.
5. האימות יכול לקחת כמה ימים. בינתיים אפשר להמשיך לשלב 2.

## שלב 2: יצירת קובץ האפליקציה (AAB)

1. פותחים את https://github.com/katya-alferov/petal-port/settings/secrets/actions/new
2. ב-**Name** כותבים בדיוק: `ANDROID_KEY_PASSWORD`
3. ב-**Secret** מדביקים את הסיסמה מהקובץ `petalport/android-signing/password.txt` בתיקיית הפרויקט, ולוחצים **Add secret**.
4. אחרי שהשינויים שלי ממוזגים ל-main: נכנסים ל-https://github.com/katya-alferov/petal-port/actions/workflows/android.yml, לוחצים **Run workflow** ואז שוב **Run workflow**.
5. אחרי כ-5 דקות, בתוך הריצה שהסתיימה (וי ירוק), למטה תחת **Artifacts**, מורידים את `petalport-android`. בתוכו `petalport.aab` (לחנות) ו-`petalport.apk` (להתקנה ישירה לבדיקה).

אפשר גם לבקש ממני לעשות את סעיף 4 ולצרף לך את הקובץ.

## שלב 3: יצירת האפליקציה ב-Play Console

1. **Create app**: שם `Petalport`, שפה English (United States), **Game**, **Free**, מסמנים את ההצהרות.
2. **Store listing**: מעתיקים את הטקסטים מ-[play/listing.md](play/listing.md) ומעלים את התמונות מהתיקייה `store/play/`. אפשר להוסיף תרגום לעברית.

## שלב 4: App content (הטפסים של גוגל)

ב-Play Console תחת **Policy and programs → App content**. אלה התשובות הנכונות למשחק כפי שהוא היום:

| טופס | תשובה |
| --- | --- |
| Privacy policy | https://katya-alferov.github.io/petal-port/privacy.html |
| App access | All functionality is available without special access |
| Ads | No, my app does not contain ads |
| Content rating | ממלאים את השאלון (קטגוריה: Game). אין אלימות, פחד, מין, שפה גסה, הימורים, סמים, תוכן משתמשים, צ'אט או רכישות. הדירוג הצפוי: Everyone / PEGI 3 |
| Target audience | גילאים **6–8, 9–12, 13–15**. "Could your app appeal to children?" Yes. זה מכניס את המשחק לתוכנית Families, וזה בסדר: הוא בנוי לזה |
| Data safety | **No**, the app does not collect or share any user data. (אין חשבונות, אין פרסומות, אין אנליטיקה) |
| Advertising ID | No |
| Government / Financial / Health / News | No / None |

**חשוב:** אם בעתיד נפעיל שמירה בענן עם כינוי וסיסמה (Supabase), צריך לעדכן את Data safety ואת דף הפרטיות **לפני** שמשחררים את זה.

## שלב 5: בדיקה סגורה (חובה, 14 יום)

חשבונות אישיים חדשים חייבים בדיקה סגורה עם **12 בודקים לפחות** שמחזיקים את האפליקציה מותקנת **14 יום ברציפות** לפני פרסום לכולם.

1. **Test and release → Testing → Closed testing → Create track**.
2. **Testers**: יוצרים רשימה עם 12 כתובות Gmail או יותר (מבוגרים: משפחה, חברים). חשבונות ילדים של Family Link לרוב לא יכולים להצטרף לבדיקות.
3. **Create release**: מעלים את `petalport.aab`. ב-Release name אפשר לכתוב `0.2.0`.
4. שולחים לבודקים את קישור ההצטרפות (**Copy link**). כל אחד לוחץ "Become a tester" ומתקין מהחנות.
5. אחרי 14 יום: **Apply for production** וממלאים את השאלון הקצר על הבדיקה.

## שלב 6: חיבור האתר לאפליקציה (כדי שלא תופיע שורת כתובת)

עד שהשלב הזה נעשה, האפליקציה עובדת, אבל מראה למעלה פס דפדפן קטן. כדי להעלים אותו, האתר צריך "להצהיר" שהאפליקציה שלו.

1. אחרי ההעלאה הראשונה: **Test and release → App integrity → Play app signing** (בגרסאות מסוימות: **Setup → App signing**). מעתיקים את ה-**SHA-256** של **App signing key certificate** (זה מפתח של גוגל, שונה ממפתח ההעלאה).
2. פותחים מאגר חדש ב-GitHub: https://github.com/new
   - Repository name בדיוק: `katya-alferov.github.io`
   - Public, ולסמן **Add a README file**. **Create repository**.
3. במאגר החדש: **Add file → Create new file**, שם הקובץ: `.nojekyll` (ריק). **Commit**.
4. שוב **Add file → Create new file**, שם הקובץ: `.well-known/assetlinks.json`, ומדביקים את התוכן של [assetlinks.json](assetlinks.json) מהמאגר הזה, אחרי שמוסיפים את הטביעה מסעיף 1 כשורה שנייה ברשימה:
   ```json
   "sha256_cert_fingerprints": [
     "ED:7D:4B:22:78:61:71:8E:C7:A7:7A:51:E7:28:2B:3A:E3:56:8C:B5:8C:8B:E7:98:8D:83:2C:B2:05:B4:59:18",
     "כאן הטביעה מגוגל"
   ]
   ```
5. **Settings → Pages**: Source = Deploy from a branch, Branch = `main`, `/ (root)`. **Save**.
6. אחרי כמה דקות בודקים שנפתח: https://katya-alferov.github.io/.well-known/assetlinks.json

אפשר גם לשלוח לי את הטביעה מסעיף 1 ולהוסיף את המאגר החדש לפרויקט, ואני אכין את הקבצים. המשחק בכתובת /petal-port/ ממשיך לעבוד כרגיל.

## שלב 7: פרסום

אחרי אישור ה-production: **Production → Create release**, מעלים את אותו AAB (או חדש), **Review release → Start rollout**. בדיקת גוגל למשחקי ילדים לוקחת לרוב כמה ימים עד שבוע.

## עדכונים בעתיד

- **שינויים במשחק** (תוכן, בגדים, מקומות): מתעדכנים לבד באפליקציה דרך האתר. לא צריך להעלות שום דבר לחנות.
- **שינויים באפליקציה עצמה** (אייקון, שם, צבעים): מעלים את `versionCode` ב-`android/app/build.gradle` באחד, מריצים את שלב 2 ומעלים AAB חדש.
- גוגל דורשת פעם בשנה בערך לעדכן את `targetSdk` לגרסת אנדרואיד חדשה. זה שינוי של שורה אחת ובנייה מחדש.
