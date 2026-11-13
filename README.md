# Atelier No. 7 — Reservation Form

A responsive HTML/CSS/JavaScript reservation-form demo based on the supplied design reference. The left hero background is CSS-only so no text from the screenshot is baked into the background.

## Run it
1. Unzip the folder.
2. Open `index.html` in a modern browser. For the most reliable local testing, use VS Code with the Live Server extension.
3. The form has client-side required-field checks, email validation, date selection, month navigation, image type/size checks and a demo confirmation message.

## Important
- This is a front-end demo. Submitting the form does not send an email or save data to a database.
- Calendar month arrows work in both directions, and keyboard left/right arrows also navigate months when focus is not in a form control.
- The calendar uses sample availability rules in `script.js` (weekdays excluding Sunday/Monday and a few demo blocked dates). Replace `isDateAvailable()` with your real availability source.
- To enable real bookings, connect a backend/API and validate all fields and availability on the server.
- The screenshot's brand/contact details are used as visual placeholder content. Replace them with approved business details.
- Google Fonts are loaded from the web; fallback fonts are specified if offline.
- The calendar's visible language is English to match the reference. The selected date is also shown in Latvian numeric format, e.g. `21.10.2026.`.
