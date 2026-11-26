# M&F Cloudflare API Bridge

این Worker یک واسط محدود برای رفع CORS داشبورد GitHub Pages است.

## Deploy یک‌باره

1. Cloudflare Dashboard را باز کن و وارد **Workers & Pages** شو.
2. یک Worker جدید با نام `mf-cf-api-bridge` بساز.
3. محتوای فایل `worker.js` همین پوشه را در ادیتور Worker قرار بده و Deploy کن.
4. در تنظیمات Worker به بخش **Settings → Variables and Secrets** برو و یک Secret با نام دقیق `BRIDGE_KEY` بساز. یک مقدار تصادفی و قوی انتخاب کن و آن را نگه دار.\n5. آدرس HTTPS آن، معمولاً `https://mf-cf-api-bridge.<subdomain>.workers.dev`، را کپی کن.
6. در داشبورد M&F، آدرس Worker و همان مقدار `BRIDGE_KEY` را در کادرهای مربوط وارد کن؛ سپس API Token را وارد کن.

یا با Wrangler از همین پوشه:
```bash
npx wrangler deploy
```

## امنیت و محدودیت

- فقط Origin دقیق `https://devyousef230-bot.github.io` مجاز است.
- فقط مسیرهای موردنیاز داشبورد و متدهای GET/POST/PUT عبور داده می‌شوند.
- هدر Authorization فقط برای درخواست به API رسمی Cloudflare فوروارد می‌شود و در کد لاگ نمی‌شود.\n- هر درخواست باید کلید محرمانه `X-MF-Bridge-Key` را نیز داشته باشد؛ مقدار آن فقط در Secret با نام `BRIDGE_KEY` در تنظیمات Worker نگهداری شود.
- این واسط توکن را ذخیره نمی‌کند.
- URL واسط را عمومی فرض کن؛ محدودیت Origin به‌تنهایی احراز هویت نیست. امنیت اصلی همچنان بر عهده API Token و دسترسی‌های محدود آن است.
- هیچ تغییری در `M&F/worker.js` اصلی پنل ایجاد نمی‌شود.
