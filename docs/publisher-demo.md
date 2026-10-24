# Publisher sample preview

Open `/publisher-demo`. This is a public, in-memory UI demo, not a secured owner console. It has no authentication or backend publishing connection and never creates a PR or sends announcements. Its buttons explicitly simulate checks and publication; only strict feed validation runs for real. Reload clears the editor.

The real publisher still needs owner identity confirmation, host/cost qualification and explicit approval for GitHub App registration/installation. Do not ship this demo as an admin screen. The chosen student panel is preserved. The baseline PR and this sample PR must remain unmerged until production approval and sample removal or approved first notice.

Strict validation now runs on builds and before network feed acceptance. Invalid schemas/entries, invalid JSON and failed network requests preserve last-good notices; a valid empty feed deliberately clears them. The display parser remains forgiving for cache compatibility, but is not a publishing validator.
