import Link from "next/link";

export const metadata = {
  title: "Terms of Service · Drip Scheduler",
  description: "The rules for using Drip Scheduler.",
};

const operator = "Apon";
const contactEmail = "abuisaapon962974@gmail.com";
const lastUpdated = "May 7, 2026";

const h2 = "mt-10 text-xl font-semibold tracking-tight text-gray-900";
const p = "mt-3 text-sm leading-relaxed text-gray-700";
const ul = "mt-3 space-y-1.5 list-disc pl-6 text-sm leading-relaxed text-gray-700";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>

        <p className={p}>
          By using Drip Scheduler (&quot;the service&quot;), you agree to these
          terms. The service is operated by {operator}. If you do not agree,
          please do not use the service.
        </p>

        <h2 className={h2}>The service</h2>
        <p className={p}>
          Drip Scheduler lets you write or import a document, save schedules,
          and gradually export the content into a Google Doc you authorize the
          service to create. Features may change or be removed.
        </p>

        <h2 className={h2}>Your account</h2>
        <ul className={ul}>
          <li>
            You sign in with a Google account. You are responsible for keeping
            that account secure.
          </li>
          <li>
            You confirm that any information you provide is accurate, and that
            you have the right to grant the service access to the Google
            account you connect.
          </li>
          <li>
            You are responsible for the activity that happens under your
            account.
          </li>
        </ul>

        <h2 className={h2}>Your content</h2>
        <ul className={ul}>
          <li>You retain ownership of the content you create or upload.</li>
          <li>
            You grant the service the limited rights necessary to operate the
            features you use &mdash; for example, to store your schedules in
            Firestore so you can load them back, and to forward the contents to
            the Google Docs API when you click Export.
          </li>
          <li>
            You are responsible for ensuring you have the right to use any
            content you upload (e.g., that you own it or have permission).
          </li>
        </ul>

        <h2 className={h2}>Acceptable use</h2>
        <p className={p}>You agree not to:</p>
        <ul className={ul}>
          <li>Use the service to violate any law or third-party rights.</li>
          <li>
            Attempt to circumvent, overload, or interfere with the service or
            its underlying providers.
          </li>
          <li>
            Send content that is illegal, harassing, infringing, or that
            contains malware.
          </li>
          <li>
            Use the service to impersonate another person or misrepresent
            authorship in a way that violates the rules of the platform you
            export to.
          </li>
        </ul>

        <h2 className={h2}>Third-party services</h2>
        <p className={p}>
          The service relies on Google (Firebase Authentication, Firestore,
          Google Docs API, Google Drive API) and Vercel for hosting. Your use
          of those features is also subject to their own terms and policies,
          including Google&rsquo;s{" "}
          <a
            className="text-blue-700 hover:underline"
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          .
        </p>

        <h2 className={h2}>Disclaimers</h2>
        <p className={p}>
          The service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, express or implied, including
          merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the service will be
          uninterrupted, error-free, or free from data loss. You are
          responsible for keeping your own backup of important content.
        </p>

        <h2 className={h2}>Limitation of liability</h2>
        <p className={p}>
          To the maximum extent permitted by law, the operator is not liable
          for any indirect, incidental, consequential, special, or punitive
          damages, or for loss of profits, data, or goodwill, arising out of or
          related to your use of the service. The operator&rsquo;s total
          aggregate liability for any direct damages will not exceed the amount
          you have paid the service in the past twelve months (which, for a
          free service, is zero).
        </p>

        <h2 className={h2}>Termination</h2>
        <p className={p}>
          You may stop using the service at any time. We may suspend or
          terminate your access if you violate these terms or if we are
          required to do so to comply with the law or our providers&rsquo;
          policies. On termination, you can request deletion of your stored
          content as described in the{" "}
          <Link className="text-blue-700 hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className={h2}>Governing law</h2>
        <p className={p}>
          These terms are governed by the laws applicable to where the operator
          is based, without regard to conflict-of-laws rules. Any dispute
          arising from these terms or your use of the service will be resolved
          in the competent courts of that jurisdiction, unless mandatory
          consumer-protection law in your country provides otherwise.
        </p>

        <h2 className={h2}>Changes to these terms</h2>
        <p className={p}>
          We may update these terms from time to time. The &quot;Last
          updated&quot; date at the top reflects the most recent change.
          Continued use of the service after a change constitutes acceptance
          of the updated terms.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          For questions about these terms, email{" "}
          <a className="text-blue-700 hover:underline" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          .
        </p>

        <div className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
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
