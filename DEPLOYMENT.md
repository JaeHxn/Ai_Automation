# Deployment Notes

## 1) Serverless API runtime
- `contact.js` calls `POST /api/contact`.
- `api/contact.js` must run on a platform that supports serverless functions (for example, Vercel).
- Plain GitHub Pages cannot execute `api/contact.js`.

## 2) Required environment variables
- `CONTACT_RECEIVER_EMAIL`: destination email address.
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token.

Use `.env.example` as a template.

## 3) Contact limits
- Enforced in backend: max 5 submissions per day (KST) by IP and by sender email.
- Image upload is limited to one image file, max 10MB.

## 4) AdSense ads.txt
- `ads.txt` must be reachable at:
  - `https://<your-domain>/ads.txt`
- Current line:
  - `google.com, pub-5354319294441406, DIRECT, f08c47fec0942fa0`

## 5) SEO indexing checklist
- `robots.txt` is published at site root.
- `sitemap.xml` is published at site root.
- Submit sitemap URL in Google Search Console:
  - `https://<your-domain>/sitemap.xml`
- Verify each page returns HTTP 200 and has canonical URL.
- Keep content pages (`index`, `about`, `privacy`, `contact`) internally linked.

## 6) Domain value updates
- Current canonical/Open Graph URLs are set to:
  - `https://jaehxn.github.io/Ai_Automation/`
- If you deploy to another domain, replace canonical/og URLs in all HTML pages.
