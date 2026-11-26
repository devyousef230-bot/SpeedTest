# M&F — Cloudflare Deployer

این پوشه شامل داشبورد GitHub Pages، دروازه API مرکزی و تنظیمات Worker اصلی پنل است.

## راه‌اندازی یک‌باره توسط صاحب پروژه

1. مخزن `devyousef230-bot/SpeedTest` را در Cloudflare Workers & Pages به‌عنوان Git repository متصل کن.
2. برای پروژه‌ی Installer، Root directory را `M&F/installer` بگذار، Build command را خالی بگذار و Deploy command را `npx wrangler deploy` تنظیم کن.
3. پس از اولین Deploy، آدرس Worker با نام `mf-installer` را بردار.
4. در فایل `M&F/site/index.html` مقدار `INSTALLER_URL` را با آدرس واقعی Worker جایگزین کن و تغییر را Push کن.
5. GitHub Pages پوشه‌ی `M&F/site` را منتشر می‌کند. از این پس با هر Push، پروژه‌های متصل به Git به‌صورت خودکار Deploy می‌شوند.

این تنظیمات فقط برای صاحب پروژه است. کاربران نهایی فقط Cloudflare API Token خود را در داشبورد وارد می‌کنند؛ نیازی به Proxy URL، Bridge Key یا ساخت Worker واسطه ندارند.

## تجربه‌ی کاربر نهایی

1. Cloudflare API Token را وارد می‌کند.
2. حساب Cloudflare را انتخاب می‌کند.
3. نام Worker و اطلاعات مدیر را مشخص می‌کند.
4. داشبورد KV با نام `MF_PANEL_DB` را پیدا یا ایجاد می‌کند.
5. کد `M&F/worker.js` را در Worker انتخابی Deploy می‌کند، Binding به نام `DB` را متصل می‌کند و `ADMIN_PASS` را به‌صورت Secret ثبت می‌کند.

## فایل Worker اصلی

فایل `M&F/worker.js` عمداً توسط این تغییرات خوانده یا ویرایش نشده است. فایل نهایی را خودت با همین نام در پوشه‌ی `M&F` قرار بده. داشبورد آن را از GitHub Pages می‌خواند؛ تا زمانی که فایل اضافه نشده باشد، فقط KV آماده می‌شود و هیچ کد آزمایشی Deploy نخواهد شد.

## تنظیمات مورد انتظار Worker اصلی

| مورد | مقدار |
|---|---|
| KV Namespace | `MF_PANEL_DB` |
| Worker binding | `DB` |
| دسترسی در کد | `env.DB` |
| رمز مدیر | `ADMIN_PASS` به‌صورت Secret |
| نام مدیر | `ADMIN_USER`، پیش‌فرض `admin` |
| مسیر خصوصی | `SECRET_PATH`، اختیاری |
| پراکسی سراسری | `PROXYIP`، اختیاری |

## امنیت

- API Token و رمز مدیر در مرورگر ذخیره دائمی نمی‌شوند و با قطع اتصال/بستن صفحه از حافظه صفحه پاک می‌شوند.
- Installer توکن را ذخیره یا لاگ نمی‌کند و فقط API مسیرهای لازم را عبور می‌دهد.
- از API Token با دسترسی‌های حداقلی و فقط برای حساب موردنظر استفاده کن.
- `ADMIN_PASS` هرگز در Wrangler vars یا فایل تنظیمات قرار نمی‌گیرد؛ به‌صورت Secret ثبت می‌شود.
- `SECRET_PATH` جایگزین احراز هویت نیست.
