# payload-plugin-vimeo

A [PayloadCMS](https://payloadcms.com) 3.x plugin for managing Vimeo videos directly from the admin panel.

## Features

- Browse your Vimeo library (folders, pagination, grid/list view)
- Upload videos directly to Vimeo from the admin panel (with progress bar and auto-select on completion)
- Select videos and store metadata (ID, embed URL, thumbnail, duration, etc.)
- Configure embed options (autoplay, loop, muted, background mode, DNT)
- Auto-generated iframe embed HTML stored on the document
- Open the current video in Vimeo from both the field view and the browser drawer

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

1. Go to [developer.vimeo.com](https://developer.vimeo.com/) and click **Create an app**
2. Fill in the app name and description (e.g. "My CMS"), accept the terms, and click **Create app**
3. In the app page, go to the **Authentication** tab
4. Under **Generate an Access Token**, select the following scopes:
   - `public` — access public video data
   - `private` — access private/unlisted videos
   - `video_files` — access video file information
   - `upload` — upload new videos _(required for the upload feature)_
5. Click **Generate** and copy the token immediately (it is only shown once)

### Required scopes

| Scope | Required for | Plan |
|---|---|---|
| `public` | Browsing and listing videos | Free |
| `private` | Accessing private and unlisted videos | Paid |
| `video_files` | Reading embed URLs and player data | Free |
| `upload` | Uploading videos directly from the admin panel | Paid |

> **Note:** The `upload` scope and uploading videos both require a **paid Vimeo plan** (Starter or above). If your token does not have the `upload` scope the upload button will return an error.

> If you already have a token without the `upload` scope, you must **generate a new one** — existing tokens cannot be edited to add scopes.

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
