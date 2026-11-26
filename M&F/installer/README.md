# M&F Installer Gateway

این Worker دروازه‌ی API بین داشبورد GitHub Pages و Cloudflare API است. این سرویس توکن کاربران را ذخیره یا لاگ نمی‌کند و فقط مسیرهای موردنیاز نصب‌کننده را عبور می‌دهد.

## اتصال GitHub به Cloudflare (فقط یک‌بار برای صاحب پروژه)

در Cloudflare Dashboard به Workers & Pages برو و Create application → Import a repository را انتخاب کن. مخزن `devyousef230-bot/SpeedTest` و شاخه `main` را انتخاب کن.

تنظیمات Build:
- Root directory: `M&F/installer`
- Build command: خالی / None
- Deploy command: `npx wrangler deploy`
- نام Worker: `mf-installer` (از wrangler.jsonc خوانده می‌شود)

بعد از ساخت پروژه، Cloudflare با هر Push به شاخه‌ی main این Worker را دوباره Deploy می‌کند. آدرس معمولاً `https://mf-installer.<YOUR-ACCOUNT-SUBDOMAIN>.workers.dev` است.

## اتصال داشبورد

در فایل `M&F/site/index.html` مقدار `INSTALLER_URL` را یک‌بار با آدرس واقعی Worker جایگزین کن. این کار تنظیم صاحب پروژه است؛ کاربران نهایی نیازی به واردکردن URL یا ساخت Proxy/Secret ندارند. سپس با هر Push، GitHub Pages نیز به‌روزرسانی می‌شود.

## امنیت

- فقط Origin رسمی داشبورد پذیرفته می‌شود.
- فقط متدها و مسیرهای لازم برای نصب پنل مجازند.
- هدر Authorization فقط به API رسمی Cloudflare ارسال می‌شود؛ در Worker ذخیره یا ثبت نمی‌شود.
- Origin/CORS به‌تنهایی احراز هویت نیست؛ بنابراین توکن‌ها باید محدود به حساب و مجوزهای لازم باشند. مسیرها به‌صورت allowlist محدود شده‌اند.
- این Worker توکن را در KV، Cache، Log یا Durable Object ذخیره نمی‌کند.

## نکته
این Gateway فقط ارتباط API را فراهم می‌کند. ساخت KV، آپلود Worker، تنظیم Binding و ثبت Secret توسط منطق نصب‌کننده‌ی داشبورد انجام می‌شود. فایل `M&F/worker.js` اصلی عمداً دست‌نخورده و خارج از این تغییرات است.
