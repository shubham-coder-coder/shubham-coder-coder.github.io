# Fieldwork portfolio

Repository: [shubham-coder-coder.github.io](https://github.com/shubham-coder-coder/shubham-coder-coder.github.io)

## Enable the site once

In the repository, open **Settings → Pages**. Set the source to **Deploy from a branch**, select **main** and **/(root)**, then save. The public website address is:

`https://shubham-coder-coder.github.io/`

## Add a project from any device

Sign in to GitHub, open the repository, and:

1. Open the `media/` folder and choose **Add file → Upload files**. Upload the photos, videos, audio, or PDFs for your project, then commit them to `main`.
2. Open `projects.json` and choose **Edit**. Add the project metadata and file paths to the `projects` list, then commit.
3. GitHub Pages automatically republishes after the commit. Refresh the site when deployment finishes.

The **Manage projects** and **Upload media** buttons on the website open those GitHub pages. Only you or a collaborator can commit changes; the public site itself is read-only.

## Project entry example

Use a relative path from the repository root for each media URL:

```json
{
  "id": "bench-power-supply",
  "title": "Bench power supply",
  "category": "circuits",
  "year": "2026",
  "description": "A short note about the design and what you learned.",
  "files": [
    {
      "name": "power-supply-board.jpg",
      "type": "image/jpeg",
      "url": "media/power-supply-board.jpg"
    },
    {
      "name": "test-run.mp4",
      "type": "video/mp4",
      "url": "media/test-run.mp4"
    }
  ]
}
```

Available category values are `circuits`, `photography`, `video`, and `other`. Replace or remove the three entries marked `"isExample": true` in `projects.json` when you are ready to show only your own projects. Keep the JSON commas and quotation marks valid.

## Change the site

Edit `index.html`, `styles.css`, or `app.js`, then commit the change to `main`. GitHub Pages publishes the updated site automatically.

## Public files

This is a public repository and a public website. Any media and project details committed here can be viewed or downloaded by anyone. Do not commit private files or personal information.

