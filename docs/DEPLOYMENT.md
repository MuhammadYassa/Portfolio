# Relaunch plan — approval required before publishing

No remote push, public deployment, DNS change, or GitHub settings change was performed. This document is a runbook for the owner, not a claim that the domain has been restored.

## What was observed on November 16, 2026

| Check | Observed result |
| --- | --- |
| `www.muhammadyassa.com` CNAME, local resolver and 1.1.1.1 | `parkingpage.namecheap.com` → `parking.d.parity.domains` → `104.219.250.36` |
| Apex A record | `192.64.119.78`, inconsistent with the documented GitHub Pages targets |
| HTTPS `www` | HTTP 200 from nginx serving parking content, not this portfolio |
| `https://muhammadyassa.github.io/Portfolio/` | HTTP 301 to `https://muhammadyassa.com/`; following the redirect timed out during the check |
| Public repository API | `has_pages: true`, default branch `main`; only `main` appeared in the public branch listing |
| Pages configuration API | HTTP 404 with the available access; actual `build_type`, source, HTTPS and domain settings could not be inspected |
| Public Actions runs listing | No visible runs returned; this does not prove Actions never ran |

DNS currently directs visitors away from GitHub Pages. That is a confirmed recovery issue. The actual administrative publishing mode still needs inspection. The existing checked-in workflow already uploaded `dist`; the separate npm script targeted `build`, so that script was broken but is not established as the cause of the outage.

## What the code now does

- `.github/workflows/pages.yml` runs `npm ci`, lint, a full dependency audit, production build checks, and Chromium browser tests. Only successful main-branch builds can deploy.
- PR builds cannot deploy or obtain deployment write permissions. Build permissions are `contents: read` and `pages: read`; only the separate deploy job receives `pages: write` and `id-token: write`.
- Official GitHub Actions are pinned to full commit SHAs verified against their public tag refs during implementation. Dependabot proposes future updates.
- Vite uses base `/`, outputs `dist/`, and prerenders the content. `public/CNAME` is copied into `dist/CNAME` with `www.muhammadyassa.com`; the duplicate root CNAME was removed.
- GitHub Actions publishing uses the **repository Pages setting** for custom domains. GitHub ignores CNAME files for this publishing mode; the copied file documents the intended host and supports static portability. It does not configure GitHub or DNS.

## Exact owner steps, after approving publication

1. Review the local changes and provide the current resume PDF if the download is required before relaunch. Place it in `public/resume.pdf`, set `profile.resume` to `/resume.pdf`, and rerun the checks.
2. In your personal GitHub **Settings → Pages**, verify ownership of `muhammadyassa.com`. GitHub supplies a TXT challenge value; add that exact value to the authoritative DNS zone and complete verification. Do not invent the challenge value. Keep the TXT record afterward.
3. In **MuhammadYassa/Portfolio → Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. In **Custom domain**, enter `www.muhammadyassa.com` and save. Do this before pointing DNS at GitHub to reduce domain takeover risk.
4. In **Settings → Environments → github-pages**, set deployment branches to `main`. Enable required reviewers if supported by your repository plan and desired. This is the approval gate for future workflow deployments.
5. At the authoritative DNS provider (if the domain uses Namecheap BasicDNS: **Domain List → Manage → Advanced DNS**), replace the parking/URL-redirect records for these web hosts with:

   | Type | Host | Value |
   | --- | --- | --- |
   | CNAME | `www` | `muhammadyassa.github.io` |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

   Replace conflicting parking A/CNAME/URL redirects for `@` and `www`. Remove stale AAAA records for these hosts if they send traffic elsewhere, or configure the current official GitHub IPv6 targets. Preserve unrelated MX, TXT, and other records. Do not add a wildcard DNS record. If restrictive CAA records exist, follow GitHub's HTTPS troubleshooting guidance to permit its certificate issuance. Use DNS-only mode if your provider offers a proxy while validating HTTPS.
6. After explicit approval to push and publish, push the reviewed changes to `main` or merge the approved PR. This triggers the prepared workflow. Alternatively, use **Actions → Validate and deploy portfolio → Run workflow → main** once the workflow is present remotely. Approve the environment deployment if you configured a reviewer gate.
7. Allow DNS to propagate (GitHub advises up to 24 hours), wait for GitHub's domain check and certificate provisioning, then enable **Enforce HTTPS** under **Settings → Pages**. The checkbox may be temporarily unavailable while the certificate is issued.
8. Verify the production page, canonical host, assets, social card, mobile navigation, contact links, and resume PDF. Confirm `https://muhammadyassa.com/` redirects to the `www` canonical and HTTP redirects to HTTPS.

## Diagnose without changing anything

```powershell
Resolve-DnsName www.muhammadyassa.com -Server 1.1.1.1
Resolve-DnsName muhammadyassa.com -Type A -Server 1.1.1.1
curl.exe -I https://www.muhammadyassa.com/
curl.exe -I https://muhammadyassa.com/
gh api repos/MuhammadYassa/Portfolio/pages
gh run list --repo MuhammadYassa/Portfolio
```

- **Parking page:** DNS still points to the registrar or stale records/caches.
- **Pages 404:** verify the Pages source, custom domain, environment approval, artifact upload, and the last deploy job. A 404 from the Pages configuration API may mean inadequate administrative access; inspect the settings UI.
- **Blank page or missing CSS:** confirm the uploaded artifact is `dist/`, assets return HTTP 200, and base is `/` for this custom domain. Do not upload `build/`, just `index.html`, or the source checkout.
- **HTTPS unavailable:** check conflicting records, DNS propagation, CAA, and certificate provisioning; a CNAME file alone cannot provision a certificate.
- **Workflow audit fails later:** inspect the advisory and dependency path, update safely, and repeat checks. Do not remove the audit gate merely to deploy.

For rollback after a future approved launch, revert the problematic source change and let the same checked workflow rebuild and deploy. Preserve the configured custom domain and DNS.

Primary references: [GitHub custom-domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [HTTPS troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [Vite static deployment](https://vite.dev/guide/static-deploy.html).
