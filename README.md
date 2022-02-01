## Quasar App
---

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Build the app for production
```bash
npm run build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

### For window use docker
```bash
docker run --rm -p 8080:8080 -v `pwd`:/app -it node:16.3.0-alpine sh

cd /app

yarn

npm run dev

```
