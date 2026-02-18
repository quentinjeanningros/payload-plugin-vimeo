# payload-plugin-vimeo

A [PayloadCMS](https://payloadcms.com) 3.x plugin for managing Vimeo videos directly from the admin panel.

## Features

- Browse your Vimeo library (folders, pagination)
- Select videos and store metadata (ID, embed URL, thumbnail, duration, etc.)
- Configure embed options (autoplay, loop, muted, background mode, DNT)
- Auto-generated iframe embed HTML stored on the document

## Installation

```bash
npm install payload-plugin-vimeo
# or
bun add payload-plugin-vimeo
```

## Usage

```ts
// payload.config.ts
import { vimeoPlugin } from "payload-plugin-vimeo";

export default buildConfig({
  plugins: [
    vimeoPlugin({
      accessToken: process.env.VIMEO_ACCESS_TOKEN,
    }),
  ],
  // ...
});
```

## Environment Variables

| Variable             | Description                     |
|----------------------|---------------------------------|
| `VIMEO_ACCESS_TOKEN` | Vimeo API personal access token |

You can also pass `accessToken` directly to the plugin options.

## License

MIT
