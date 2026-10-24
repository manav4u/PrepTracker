# Publishing an announcement

The announcements panel reads `public/announcements.json`. It is data, not code.

## The everyday way

Message the announcement text to Sia. She writes the entry, opens the pull request, and tells you when it is live.

## Doing it yourself (one minute)

1. Open https://github.com/manav4u/PrepTracker/edit/main/public/announcements.json (works in the GitHub mobile app too).
2. Copy the template below into `items`, above the previous entries, and fill in the blanks. Keep the quotes and commas.
3. Tap **Commit changes**, choose **Create a new branch for this commit and start a pull request**, then **Propose changes**.
4. When checks are green, merge. The panel updates within a few minutes.

## Template

```json
{
  "id": "2026-10-24-short-slug",
  "date": "2026-10-24",
  "tag": "Update",
  "title": "Title here",
  "body": "Two to four short lines.",
  "link": "https://optional-link.example"
}
```

- `id`: unique, date + a few words. Never reuse one - the unread dot keys off it.
- `date`: `YYYY-MM-DD`. Newest shows first.
- `tag`: `Update`, `Exam alert`, or `Resource`.
- `link`: optional, https only. Delete the line when you do not need it.
- To retract an announcement, delete its entry and PR the change.
- The network reader validates the whole feed before replacing its cached notices. Network errors, invalid JSON, invalid schemas and invalid entries retain the previous notices (regression-tested). A valid empty items array deliberately clears them. The build also validates the checked-in feed: unique IDs, real dates, supported tags, field limits, HTTPS links and a maximum of 20 entries.
