# Google Sheets setup (RSVP + Wishes)

Spreadsheet: https://docs.google.com/spreadsheets/d/1PXOB-E5YvSNcHAQYP50KvVqof-FPz0qjGRxw01mcum4/edit

1. Open the spreadsheet → **Extensions > Apps Script**.
2. Delete the default code and paste the whole of `google-apps-script/code.gs`. Save.
3. In the function dropdown pick **setup** → **Run** → allow the permissions.
   This creates the `RSVP` and `Wishes` tabs with styled headers.
   (They are also created automatically on the first submission if missing.)
4. **Deploy > New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL (ends in `/exec`).
6. Create `.env` in the project root:

   ```
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
   ```

   On Vercel/Netlify add the same variable in the project's environment settings.
7. Restart `npm run dev` (or redeploy the site).

## Sheets

| Tab     | Columns |
| ------- | ------- |
| RSVP    | Timestamp · Name · Attendance · Guests · Dietary Notes · Invited As |
| Wishes  | Timestamp · Name · Message · Invited As · Show On Website |

Untick **Show On Website** to hide a wish from the site.

## Notes

- After editing `code.gs`, use **Deploy > Manage deployments > Edit > New version**,
  otherwise the old code keeps running.
- Test the endpoint: open `<WEB_APP_URL>?action=wishes` in a browser.
