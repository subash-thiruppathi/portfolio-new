# Subash Thiruppathy — portfolio

A responsive, static portfolio built with HTML, CSS, and vanilla JavaScript. No build step or dependencies.

## Local preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` in this directory and open <http://127.0.0.1:4173>.

## Publishing and SEO

The provisional public URL is **https://subash-thiruppathi.github.io/portfolio-new/**, inferred from the repository remote. Confirm it before publishing. For a custom domain, update every occurrence of that URL in `index.html`, `sitemap.xml`, and `robots.txt` together. Keep the trailing slash.

The page includes a descriptive title and meta description, a stable H1, canonical URL, Open Graph and Twitter preview metadata, and ProfilePage/Person JSON-LD. Projects, skills, and experience are present in the HTML and remain readable without JavaScript. Portraits have dimensions; the hero uses WebP with PNG fallback, and the secondary image loads lazily. Google Fonts use `display=swap` with system font fallbacks.

For GitHub Pages, publish this directory from the repository root. Submit the deployed `sitemap.xml` URL in Google Search Console and verify the deployed canonical URL. A project site’s `/portfolio-new/robots.txt` is not the origin-level robots file: crawlers use `https://subash-thiruppathi.github.io/robots.txt`. Manage that root file in the account site if crawl directives are needed. On a custom domain served from this directory, the included robots file is at the correct root location.

Use Google’s [Rich Results Test](https://search.google.com/test/rich-results) to validate the deployed structured data and [PageSpeed Insights](https://pagespeed.web.dev/) to measure the actual production page. SEO metadata helps discovery and understanding; rankings depend on the deployed site and its content.

## Contact

The contact form validates required fields and opens a draft in the visitor’s email app. It does not submit to a server. The direct email link is always available; with JavaScript disabled, the draft form is hidden. Resume and social links use the existing supplied assets and profiles.
