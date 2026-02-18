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

## Vimeo Access Token

The plugin requires a **personal access token** from Vimeo to call the API.

### How to get one

1. Go to [vimeo.com/settings/apps](https://vimeo.com/settings/apps) and click **Create an app**
2. Fill in the app name and description (e.g. "My CMS"), accept the terms, and click **Create app**
3. In the app page, go to the **Authentication** tab
4. Under **Generate an Access Token**, select the following scopes:
   - `public` — access public video data
   - `private` — access private/unlisted videos
   - `video_files` — access video file information
5. Click **Generate** and copy the token immediately (it is only shown once)

### Required scopes

| Scope | Why |
|---|---|
| `public` | Browse and list videos |
| `private` | Access private and unlisted videos |
| `video_files` | Read embed URLs and player data |

> A **free Vimeo account** is enough to get a token, but private video access requires a paid plan.

### Configuration

Set the token as an environment variable:

```bash
# .env
VIMEO_ACCESS_TOKEN=your_token_here
```

Or pass it directly in the plugin options (not recommended for production):

```ts
vimeoPlugin({ accessToken: "your_token_here" })
```

## Environment Variables

| Variable             | Description                     |
|----------------------|---------------------------------|
| `VIMEO_ACCESS_TOKEN` | Vimeo API personal access token |

## License

MIT
