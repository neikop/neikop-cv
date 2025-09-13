import React, { useMemo } from "react"

/**
 * PdfLikePages
 * - Renders content in fixed A4-sized "pages" for on-screen preview
 * - Prints cleanly to real A4 pages (no shadows/borders)
 * - Supports manual <PageBreak /> markers and automatic section splitting
 * - Uses Tailwind for styling; add this component anywhere in your app
 */

/**
 * Manual Page building block if you want strict control per-page.
 */
export function Page({ children, number }: { children: React.ReactNode; number?: number }) {
  return (
    <div className="page mx-auto shadow-xl">
      <RunningHeader />
      <div className="content">{children}</div>
      <RunningFooter pageNumber={number} />
    </div>
  )
}

export function PageBreak() {
  return <div aria-hidden="true" className="page-break" />
}

export default function PdfLikePages() {
  // Demo content — replace with your own JSX/markdown.
  const sections = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => (
        <section className="break-inside-avoid space-y-2" key={i}>
          <h2 className="text-lg font-semibold">Section {i + 1}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dapibus, urna a ullamcorper viverra, ligula
            arcu tempor mi, a efficitur est justo et dolor. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae; In posuere interdum sem, vitae ultrices augue elementum in. Duis vel viverra
            lorem. Integer tincidunt, nibh a commodo consequat, lacus arcu placerat nibh, non dapibus quam dolor vel mi.
          </p>
          <DummyParagraphs count={i % 3 === 0 ? 10 : 5} />
        </section>
      )),
    [],
  )

  return (
    <div className="min-h-screen w-full bg-gray-100 py-8 dark:bg-neutral-900 print:bg-white">
      {/* Global styles for paged media + print */}
      <style>{globalCss}</style>

      <div className="mx-auto max-w-[900px] px-4">
        <HeaderControls />

        <Document>
          {/*
            Approach A (auto):
            Flow content into one long column; CSS will create page breaks
            based on A4 height via the .page class and utility rules below.
          */}
          <AutoPaged>{sections}</AutoPaged>

          {/*
            Approach B (manual):
            Uncomment to control breaks explicitly:

            <Page number={1}>
              <YourContent/>
            </Page>
            <PageBreak/>
            <Page number={2}>
              <MoreContent/>
            </Page>
          */}
        </Document>
      </div>
    </div>
  )
}

/**
 * AutoPaged
 * Wraps arbitrary children and lets CSS handle pagination using fixed-height
 * A4-sized boxes. Content flows naturally; you can still insert <PageBreak/>.
 */
function AutoPaged({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&_.page]:mx-auto [&_section]:px-8 [&_section]:py-6">
      <div className="page shadow-xl">
        <RunningHeader />
        <div className="content">{children}</div>
        <RunningFooter />
      </div>
    </div>
  )
}

/** Layout primitives **/
function Document({ children }: { children: React.ReactNode }) {
  return <div className="doc space-y-6">{children}</div>
}

function DummyParagraphs({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <p key={i}>
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus
          efficitur, justo id pretium rhoncus, mauris sapien gravida sem, vitae luctus libero neque sit amet justo.
          Aenean posuere metus in porta dictum.
        </p>
      ))}
    </>
  )
}

function HeaderControls() {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 print:hidden">
      <h1 className="text-2xl font-bold">PDF-like Pages (A4)</h1>
      <div className="flex items-center gap-2">
        <button
          className="rounded-2xl border border-black/10 px-4 py-2 shadow transition hover:shadow-md dark:border-white/10"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  )
}

function RunningFooter({ pageNumber }: { pageNumber?: number }) {
  return (
    <footer className="running-footer">
      <div className="text-xs opacity-70">
        <span>Confidential · {new Date().getFullYear()}</span>
        {typeof pageNumber === "number" && <span className="ml-auto">Page {pageNumber}</span>}
      </div>
    </footer>
  )
}

function RunningHeader() {
  return (
    <header className="running-header">
      <div className="text-xs opacity-70">Your Title · Subtitle</div>
    </header>
  )
}

/**
 * Global CSS (scoped in this component via a <style> tag)
 *
 * Key ideas:
 * - .page is a fixed A4 box (210mm × 297mm) with internal padding area where content flows.
 * - We use CSS fragmentation: .content creates page breaks when it overflows,
 *   thanks to "box-decoration-break: clone" and manual .page-break markers.
 * - For print, we remove shadows/borders and set @page size to A4 with margins.
 */
const globalCss = `
  :root {
    /* Tweak to your baseline grid */
    --page-padding: 20mm;
    --page-width: 210mm;   /* A4 */
    --page-height: 297mm;  /* A4 */
    --page-content-height: calc(var(--page-height) - 2 * var(--page-padding));
  }

  /* A single visual page card */
  .page {
    width: var(--page-width);
    min-height: var(--page-height);
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    overflow: hidden; /* keep header/footer inside */
    position: relative;
  }

  /* Running header/footer inside each page card */
  .running-header,
  .running-footer {
    position: sticky;
    left: 0;
    right: 0;
    background: white;
    z-index: 10;
    padding: 8mm var(--page-padding);
  }

  .running-header { top: 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
  .running-footer { bottom: 0; border-top: 1px solid rgba(0,0,0,0.06); display: flex; }

  /* Content area that can break across pages visually via CSS columns technique */
  .content {
    padding: 6mm var(--page-padding);
    /* Multi-column trick: create vertical pages as columns in preview */
    column-width: var(--page-width);
    column-gap: 2rem; /* visual gap between pages in preview */
    height: var(--page-content-height);
    overflow: auto; /* scroll within the card while previewing */
  }

  /* Avoid breaking inside these blocks */
  .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; -webkit-column-break-inside: avoid; }

  /* Force a manual page break */
  .page-break { break-after: page; page-break-after: always; }

  /* PRINT STYLES */
  @media print {
    html, body { background: white; }
    .doc { gap: 0 !important; }
    .page {
      box-shadow: none !important;
      border-radius: 0 !important;
      width: auto; /* let the printer take A4 size from @page */
      min-height: auto;
    }

    /* Each column becomes an actual page when printed. We switch from columns
       to normal flow so the browser paginates at A4 size. */
    .content {
      column-width: auto;
      column-gap: 0;
      height: auto;
      overflow: visible;
      padding: 15mm var(--page-padding) 20mm var(--page-padding);
    }

    /* Repeat header/footer using position: fixed so they appear on all pages */
    .running-header { position: fixed; top: 0; }
    .running-footer { position: fixed; bottom: 0; }

    /* Define paper size and margins. Most browsers support this. */
    @page {
      size: A4;
      margin: 15mm var(--page-padding) 20mm var(--page-padding);
    }

    /* Remove on-screen controls */
    .print\\:hidden { display: none !important; }
  }
`
