# Poobi World

A little universe for two — a private-ish site with Photos, Stories, Thoughts,
Milestones & Achievements, Videos, a Book Shelf, and a Gaming Vault.

Live at: **https://pvp-7.github.io/poobi-world/**

## Adding content — no coding required

Every section reads from a JSON file in `/content`. To add something, open the
matching file on GitHub (click it, then the pencil/edit icon), add an entry in
the same shape as the others, and commit. The site updates automatically —
nothing else to touch.

| Section | File | Fields |
|---|---|---|
| Photos | `content/photos.json` | `image` (URL or path), `caption`, `date` |
| Stories | `content/stories.json` | `title`, `date`, `body` |
| Thoughts | `content/thoughts.json` | `text`, `date` |
| Milestones & Achievements | `content/milestones.json` | `date`, `title`, `description` |
| Videos | `content/videos.json` | `title`, `embedUrl` (e.g. a YouTube embed link) |
| Book Shelf | `content/books.json` | `title`, `status` (e.g. "reading", "finished", "want to read") |
| Gaming Vault | `content/games.json` | `title`, `status` (e.g. "cleared", "in progress"), `note` |

### Example — adding a photo

```json
[
  {
    "image": "https://your-image-host.com/photo.jpg",
    "caption": "The one from the rooftop",
    "date": "March 2026"
  }
]
```

Each file is a JSON array — add a new `{ ... }` entry, separated by commas,
inside the square brackets. To host your own photos, upload them into an
`assets/photos/` folder in this repo and reference them like
`"image": "assets/photos/rooftop.jpg"`.

## About the password

The site is gated with a password (set in `js/app.js`, the `PLAIN_PASSWORD`
constant) so casual visitors can't just stumble onto it. Being honest about
what this does and doesn't do: this is a **static site**, so the check happens
in the visitor's browser. Anyone who really wants to can view the page source
or read the files directly in this GitHub repo and see the password or the
content. It keeps the site off search engines and out of casual view, but it
is not real access control. If you ever want genuine privacy, that needs a
private host with server-side auth rather than GitHub Pages.

To change the password later, edit `PLAIN_PASSWORD` near the top of
`js/app.js`.

## Structure

```
index.html         one-page site, all sections
css/style.css       theme, layout, animations
js/app.js           password gate, starfield, content loader
content/*.json      editable content — this is what you'll touch most
assets/logo.svg     the orbiting-hearts logo
```
