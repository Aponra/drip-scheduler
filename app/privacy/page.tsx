import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Drip Scheduler",
  description:
    "How Drip Scheduler handles your account, content, and Google account data.",
};

const operator = "Apon";
const contactEmail = "abuisaapon962974@gmail.com";
const lastUpdated = "May 7, 2026";

const h2 = "mt-10 text-xl font-semibold tracking-tight text-gray-900";
const h3 = "mt-6 text-base font-semibold text-gray-900";
const p = "mt-3 text-sm leading-relaxed text-gray-700";
const ul = "mt-3 space-y-1.5 list-disc pl-6 text-sm leading-relaxed text-gray-700";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] w-full bg-gradient-to-b from-blue-50/60 via-white to-transparent"
      />
      <div className="mx-auto max-w-2xl px-6 py-12 lg:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
        >
          ← Back to Drip Scheduler
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {lastUpdated}
        </p>

        <p className={p}>
          This page explains what Drip Scheduler (&quot;the service&quot;,
          &quot;we&quot;) collects, how we use it, and the choices you have. The
          service is operated by {operator}.
        </p>

        <h2 className={h2}>What we collect</h2>

        <h3 className={h3}>Account information</h3>
        <p className={p}>
          When you sign in with Google, we receive a basic profile from Firebase
          Authentication: your email address, your display name (if available),
          and a stable user ID. We use this to identify you and gate access to
          your own content. We do not receive your Google password.
        </p>

        <h3 className={h3}>Content you create</h3>
        <p className={p}>
          When you save a schedule, the title, your text (plain and rich
          formats), the chunked output, your interval choice, the creation
          timestamp, and your user ID are stored in Google Firestore. This
          content is only readable by you when you are signed in.
        </p>

        <h3 className={h3}>Google Docs OAuth tokens</h3>
        <p className={p}>
          When you click &quot;Connect Google Docs&quot; and approve access, we
          exchange the authorization code for access and refresh tokens and
          store them as <span className="font-mono text-xs">HttpOnly</span>{" "}
          cookies in your browser (named{" "}
          <span className="font-mono text-xs">gd_access_token</span>,{" "}
          <span className="font-mono text-xs">gd_refresh_token</span>, and{" "}
          <span className="font-mono text-xs">gd_expires_at</span>). These
          cookies are scoped to the site and are not accessible to JavaScript.
          We do not persist these tokens on our servers or in our database.
        </p>

        <h3 className={h3}>Imported documents</h3>
        <p className={p}>
          Files you upload (.txt, .md, .docx, .pdf) are parsed entirely in your
          browser. The original file is not transmitted to our servers; only
          the extracted content is loaded into the editor and is treated the
          same as anything you type or paste.
        </p>

        <h3 className={h3}>Local storage</h3>
        <p className={p}>
          We use one entry in your browser&rsquo;s{" "}
          <span className="font-mono text-xs">localStorage</span>, called{" "}
          <span className="font-mono text-xs">googleDocsConnected</span>, to
          remember whether you&rsquo;ve completed the Google Docs connection
          flow so the UI doesn&rsquo;t flicker on page load. It is a yes/no
          flag and contains no personal data. It is cleared when you log out.
        </p>

        <h2 className={h2}>How we use your data</h2>
        <ul className={ul}>
          <li>
            To authenticate you and serve only your own schedules to your
            session.
          </li>
          <li>
            To save, list, load, and delete schedules you create, on your
            request.
          </li>
          <li>
            To create Google Docs in your Google account and write content into
            documents you authorize, on your request.
          </li>
          <li>
            To debug failures (export errors are logged to the browser console
            so you can see them; we do not aggregate analytics or telemetry).
          </li>
        </ul>

        <h2 className={h2}>Google account data and the limited-use disclosure</h2>
        <p className={p}>
          Drip Scheduler&rsquo;s use of information received from Google APIs
          adheres to Google&rsquo;s{" "}
          <a
            className="text-blue-700 hover:underline"
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
        <ul className={ul}>
          <li>
            We only request the scopes we need:{" "}
            <span className="font-mono text-xs">
              https://www.googleapis.com/auth/documents
            </span>{" "}
            and{" "}
            <span className="font-mono text-xs">
              https://www.googleapis.com/auth/drive.file
            </span>
            . The latter restricts our access to documents the app has
            created &mdash; we cannot read or modify your other Drive content.
          </li>
          <li>
            Google account data is used solely to provide the user-facing
            features described in this policy. We do not transfer it to others
            except as needed to provide those features (e.g., to call the
            Google Docs API on your behalf).
          </li>
          <li>
            We do not use Google account data for advertising. We do not sell
            it. We do not allow humans to read it, except in the narrow cases
            allowed by Google&rsquo;s policy (such as where you give us
            specific consent or where access is necessary to comply with the
            law).
          </li>
        </ul>

        <h2 className={h2}>Third parties we use</h2>
        <ul className={ul}>
          <li>
            <strong>Google</strong> &mdash; Firebase Authentication, Cloud
            Firestore, Google Docs API, Google Drive API.
          </li>
          <li>
            <strong>Vercel</strong> &mdash; hosts the application.
          </li>
        </ul>
        <p className={p}>
          These providers process your data on our behalf and are subject to
          their own privacy policies. We do not share your data with anyone
          else.
        </p>

        <h2 className={h2}>Cookies</h2>
        <p className={p}>
          The cookies set by the service are functional, not advertising or
          analytics. They are listed under &quot;Google Docs OAuth tokens&quot;
          above.
        </p>

        <h2 className={h2}>Data retention and deletion</h2>
        <ul className={ul}>
          <li>
            Schedules you save remain in Firestore until you delete them in
            the app.
          </li>
          <li>
            Token cookies persist until they expire (1 hour for access, 30 days
            for refresh) or until you log out, at which point we clear them.
          </li>
          <li>
            You can revoke our access to your Google account at any time at{" "}
            <a
              className="text-blue-700 hover:underline"
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
            >
              myaccount.google.com/permissions
            </a>
            .
          </li>
          <li>
            To delete your account and all stored schedules, email{" "}
            <a className="text-blue-700 hover:underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>{" "}
            from the address tied to your account.
          </li>
        </ul>

        <h2 className={h2}>Children&rsquo;s privacy</h2>
        <p className={p}>
          The service is not directed to children under 13, and we do not
          knowingly collect personal information from them. If you believe a
          child has provided us information, please contact us.
        </p>

        <h2 className={h2}>Changes to this policy</h2>
        <p className={p}>
          We may update this policy from time to time. The &quot;Last
          updated&quot; date at the top reflects the most recent change.
          Material changes will be communicated through the app or by email.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          Questions, requests, or concerns: email{" "}
          <a className="text-blue-700 hover:underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>

        <div className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <span className="mx-2">·</span>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
