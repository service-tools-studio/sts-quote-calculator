"use client";

import { useCallback, useMemo, useState } from "react";
import {
  BusinessInputs,
  LaunchInputs,
  QuoteSummary,
  buildCopiedSummaryText,
  calculateBusinessQuote,
  calculateLaunchQuote,
  formatCurrency,
} from "./lib/pricing";

type ProjectType = "launch" | "business";

type LaunchSectionComplexity = "essentials" | "extra";

type BusinessPageRange = "fiveOrLess" | "sixToEight" | "ninePlus";

function projectTypeLabel(type: ProjectType): string {
  return type === "launch" ? "Launch Site" : "Business Website";
}

interface InterviewQuestionProps {
  step?: number;
  title: string;
  helperText?: string;
  children: React.ReactNode;
}

function InterviewQuestion({
  step,
  title,
  helperText,
  children,
}: InterviewQuestionProps) {
  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-rose-50/80 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            {typeof step === "number" && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">
                {step}
              </div>
            )}
            <h2 className="text-sm font-semibold text-zinc-900 sm:text-base">
              {title}
            </h2>
          </div>
          {helperText && (
            <p className="mt-2 text-xs text-zinc-500 sm:text-sm">{helperText}</p>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

interface SummaryCardProps {
  summary: QuoteSummary;
  projectType: ProjectType;
  onCopy: () => void;
  isCopying: boolean;
  copied: boolean;
  internalNotes: string;
  onDownload: () => void;
  isDownloading: boolean;
}

function SummaryCard({
  summary,
  projectType,
  onCopy,
  isCopying,
  copied,
  internalNotes,
  onDownload,
  isDownloading,
}: SummaryCardProps) {
  const typeLabel = projectTypeLabel(projectType);

  return (
    <aside className="rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-rose-100 sm:p-6 lg:sticky lg:top-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose-500">
            Quote Summary
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900 sm:text-base">
            {typeLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Total Quote
          </p>
          <p className="mt-1 text-xl font-semibold text-rose-700 sm:text-2xl">
            {formatCurrency(summary.total)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-rose-50 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">Base Package</span>
          <span className="font-medium text-zinc-900">
            {formatCurrency(summary.basePrice)}
          </span>
        </div>
        {summary.lineItems.length > 0 ? (
          <dl className="space-y-1.5">
            {summary.lineItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs text-zinc-600 sm:text-sm"
              >
                <dt>{item.label}</dt>
                <dd className="font-medium text-zinc-900">
                  {formatCurrency(item.amount)}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-xs text-zinc-500">
            No add-ons selected yet. As you answer questions, details will
            appear here.
          </p>
        )}

        <div className="mt-3 rounded-2xl bg-rose-50/70 px-3 py-2 text-xs text-rose-800">
          <p className="font-medium">Closing Question</p>
          <p className="mt-1">
            “Based on what we discussed, your project comes out to{" "}
            <span className="font-semibold">
              {formatCurrency(summary.total)}
            </span>
            . Does that feel aligned with the investment you had in mind for
            your website?”
          </p>
        </div>

        {summary.requiresCustomReview && (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
            <p className="font-semibold">
              Custom Website Tier (Manual Review)
            </p>
            <p className="mt-1">
              This project likely falls into our Custom Website tier starting at{" "}
              <span className="font-semibold">$12,000+</span>. Please flag this
              for manual review before sending a final proposal.
            </p>
          </div>
        )}

        {internalNotes.trim().length > 0 && (
          <div className="mt-3 rounded-2xl bg-zinc-50 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Internal Notes
            </p>
            <p className="mt-1 text-xs text-zinc-700 whitespace-pre-wrap">
              {internalNotes}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onCopy}
          disabled={isCopying}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {copied ? "Copied to clipboard" : "Copy Quote Summary"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isDownloading ? "Preparing PDF…" : "Download Itemized Quote"}
        </button>
      </div>

      <p className="mt-2 text-[11px] text-zinc-500">
        Copy a clean text version or download an itemized PDF for email, SMS,
        CRM, or your notes.
      </p>
    </aside>
  );
}

export default function Home() {
  const [projectType, setProjectType] = useState<ProjectType>("launch");

  const [launchSectionComplexity, setLaunchSectionComplexity] =
    useState<LaunchSectionComplexity>("essentials");
  const [launchTotalSections, setLaunchTotalSections] = useState<number>(5);
  const [launchBooking, setLaunchBooking] = useState(false);
  const [launchReviews, setLaunchReviews] = useState(false);
  const [launchServiceArea, setLaunchServiceArea] = useState(false);
  const [launchCopywriting, setLaunchCopywriting] = useState(false);
  const [launchBranding, setLaunchBranding] = useState(false);
  const [launchImages, setLaunchImages] = useState(false);
  const [launchVisualPolish, setLaunchVisualPolish] = useState(false);
  const [launchRush, setLaunchRush] = useState(false);

  const [businessPageRange, setBusinessPageRange] =
    useState<BusinessPageRange>("fiveOrLess");
  const [businessTotalPages, setBusinessTotalPages] = useState<number>(5);
  const [businessAdvancedServicePages, setBusinessAdvancedServicePages] =
    useState<number>(0);
  const [businessBlog, setBusinessBlog] = useState(false);
  const [businessPortfolio, setBusinessPortfolio] = useState(false);
  const [businessBooking, setBusinessBooking] = useState(false);
  const [businessCrm, setBusinessCrm] = useState(false);
  const [businessReviews, setBusinessReviews] = useState(false);
  const [businessServiceAreas, setBusinessServiceAreas] = useState(false);
  const [businessImages, setBusinessImages] = useState(false);
  const [businessCopywriting, setBusinessCopywriting] = useState(false);
  const [businessBranding, setBusinessBranding] = useState(false);
  const [businessMotion, setBusinessMotion] = useState(false);
  const [businessCustomFunctionality, setBusinessCustomFunctionality] =
    useState(false);

  const [internalNotes, setInternalNotes] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const launchInputs: LaunchInputs = useMemo(
    () => ({
      totalSections: launchTotalSections,
      bookingIntegration: launchBooking,
      googleReviewsIntegration: launchReviews,
      serviceAreaMap: launchServiceArea,
      copywritingAssistance: launchCopywriting,
      brandingHelp: launchBranding,
      stockImageSourcing: launchImages,
      customIcons: false,
      animations: launchVisualPolish,
      rushBuild: launchRush,
    }),
    [
      launchTotalSections,
      launchBooking,
      launchReviews,
      launchServiceArea,
      launchCopywriting,
      launchBranding,
      launchImages,
      launchVisualPolish,
      launchRush,
    ]
  );

  const businessInputs: BusinessInputs = useMemo(
    () => ({
      standardPages: businessTotalPages,
      advancedServicePages: businessAdvancedServicePages,
      blogSetup: businessBlog,
      portfolioGallery: businessPortfolio,
      bookingIntegration: businessBooking,
      crmIntegration: businessCrm,
      googleReviewsIntegration: businessReviews,
      serviceAreaMapSystem: businessServiceAreas,
      imageSourcing: businessImages,
      copywritingAssistance: businessCopywriting,
      brandIdentitySetup: businessBranding,
      advancedAnimations: businessMotion,
      customFunctionality: businessCustomFunctionality,
    }),
    [
      businessTotalPages,
      businessAdvancedServicePages,
      businessBlog,
      businessPortfolio,
      businessBooking,
      businessCrm,
      businessReviews,
      businessServiceAreas,
      businessImages,
      businessCopywriting,
      businessBranding,
      businessMotion,
      businessCustomFunctionality,
    ]
  );

  const summary: QuoteSummary = useMemo(
    () =>
      projectType === "launch"
        ? calculateLaunchQuote(launchInputs)
        : calculateBusinessQuote(businessInputs),
    [projectType, launchInputs, businessInputs]
  );

  const handleCopy = useCallback(async () => {
    try {
      setIsCopying(true);
      const text = buildCopiedSummaryText({
        summary,
        internalNotes,
      });
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy quote summary", error);
    } finally {
      setIsCopying(false);
    }
  }, [summary, internalNotes]);

  const resetAll = useCallback(() => {
    setProjectType("launch");
    setLaunchSectionComplexity("essentials");
    setLaunchTotalSections(5);
    setLaunchBooking(false);
    setLaunchReviews(false);
    setLaunchServiceArea(false);
    setLaunchCopywriting(false);
    setLaunchBranding(false);
    setLaunchImages(false);
    setLaunchVisualPolish(false);
    setLaunchRush(false);

    setBusinessPageRange("fiveOrLess");
    setBusinessTotalPages(5);
    setBusinessAdvancedServicePages(0);
    setBusinessBlog(false);
    setBusinessPortfolio(false);
    setBusinessBooking(false);
    setBusinessCrm(false);
    setBusinessReviews(false);
    setBusinessServiceAreas(false);
    setBusinessImages(false);
    setBusinessCopywriting(false);
    setBusinessBranding(false);
    setBusinessMotion(false);
    setBusinessCustomFunctionality(false);

    setInternalNotes("");
    setCopied(false);
    setIsDownloading(false);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      const projectTypeText =
        projectType === "launch" ? "Launch Site" : "Business Website";

      let y = 15;
      doc.setFontSize(14);
      doc.text("Service Tools Studio Quote", 14, y);
      y += 8;

      doc.setFontSize(11);
      doc.text(`Project Type: ${projectTypeText}`, 14, y);
      y += 8;

      doc.text(
        `Base Package: ${formatCurrency(summary.basePrice)}`,
        14,
        y
      );
      y += 6;

      if (summary.lineItems.length > 0) {
        summary.lineItems.forEach((item) => {
          const line = `${item.label}: ${formatCurrency(item.amount)}`;
          if (y > 270) {
            doc.addPage();
            y = 15;
          }
          doc.text(line, 14, y);
          y += 6;
        });
      } else {
        doc.text("No add-ons selected.", 14, y);
        y += 6;
      }

      y += 4;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(12);
      doc.text(`Total Quote: ${formatCurrency(summary.total)}`, 14, y);
      y += 8;

      doc.setFontSize(10);
      if (summary.requiresCustomReview) {
        const customNote =
          "Note: This quote may require manual review due to custom functionality requests. Custom projects may start at $12,000+.";
        const splitNote = doc.splitTextToSize(customNote, 180);
        if (y + splitNote.length * 5 > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(splitNote, 14, y);
        y += splitNote.length * 5 + 4;
      }

      if (internalNotes.trim().length > 0) {
        const title = "Internal Notes:";
        const notes = internalNotes.trim();
        const splitNotes = doc.splitTextToSize(notes, 180);
        if (y + splitNotes.length * 5 > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(title, 14, y);
        y += 5;
        doc.text(splitNotes, 14, y);
      }

      const filename =
        projectType === "launch"
          ? "launch-site-quote.pdf"
          : "business-website-quote.pdf";
      doc.save(filename);
    } catch (error) {
      console.error("Failed to generate PDF quote", error);
    } finally {
      setIsDownloading(false);
    }
  }, [projectType, summary, internalNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-4 py-8 text-zinc-900 sm:px-6 lg:px-10 lg:py-10">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 lg:gap-8">
        <header className="flex flex-col gap-4 border-b border-rose-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
              Service Tools Studio
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Website Quote Interview
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-zinc-600 sm:text-base">
              A guided, client-friendly flow Kelsey can read word-for-word on
              sales calls. Answer each question and the quote will update in
              real time.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1.5 text-xs text-zinc-600 shadow-sm ring-1 ring-rose-100/60 sm:self-auto">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Live pricing calculator
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
          <section className="space-y-5 lg:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Client Interview
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-rose-50"
              >
                Reset conversation
              </button>
            </div>

            <InterviewQuestion
              step={1}
              title="Identify the type of website"
              helperText="Launch Site is best for a simple one-page site. Business Website is for a structured, multi-page build."
            >
              <p className="text-sm text-zinc-700">
                “To start, are you looking for a simple one-page website, or a
                larger multi-page website for your business?”
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setProjectType("launch")}
                  className={`flex flex-col items-start rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${projectType === "launch"
                    ? "border-rose-400 bg-rose-50"
                    : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                    }`}
                >
                  <span className="font-medium text-zinc-900">
                    Simple one-page site
                  </span>
                  <span className="mt-1 text-xs text-zinc-600">
                    Launch Site — starts at {formatCurrency(1000)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectType("business")}
                  className={`flex flex-col items-start rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${projectType === "business"
                    ? "border-rose-400 bg-rose-50"
                    : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                    }`}
                >
                  <span className="font-medium text-zinc-900">
                    Multi-page business website
                  </span>
                  <span className="mt-1 text-xs text-zinc-600">
                    Business Website — starts at {formatCurrency(4000)}
                  </span>
                </button>
              </div>
            </InterviewQuestion>

            {projectType === "launch" && (
              <>
                <InterviewQuestion
                  title="Launch Site — Sections / content complexity"
                  helperText="Use this to estimate how long the page will be and how much content we’re organizing."
                >
                  <p className="text-sm text-zinc-700">
                    “About how much information do you want on the page?”
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLaunchSectionComplexity("essentials");
                        setLaunchTotalSections(5);
                      }}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchSectionComplexity === "essentials"
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        Just the essentials
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        About, services, contact — around 5 sections.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setLaunchSectionComplexity("extra")
                      }
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchSectionComplexity === "extra"
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        A few additional sections
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        FAQ, testimonials, process, etc.
                      </span>
                    </button>
                  </div>

                  {launchSectionComplexity === "extra" && (
                    <div className="mt-2 space-y-1">
                      <label className="flex flex-col gap-1 text-xs text-zinc-700 sm:text-sm">
                        <span>
                          Optional follow-up: “Roughly how many sections do you
                          think the page might have?”
                        </span>
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min={5}
                            value={launchTotalSections}
                            onChange={(event) => {
                              const next = Number(event.target.value) || 5;
                              setLaunchTotalSections(
                                Number.isNaN(next) ? 5 : Math.max(5, next)
                              );
                            }}
                            className="w-20 rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-300"
                          />
                          <span className="text-xs text-zinc-500">
                            First 5 sections are included.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Booking">
                  <p className="text-sm text-zinc-700">
                    “Do you want people to be able to book appointments directly
                    from the website?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setLaunchBooking(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!launchBooking
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchBooking(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${launchBooking
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(75)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Reviews">
                  <p className="text-sm text-zinc-700">
                    “Would you like your Google reviews displayed on the website
                    for social proof?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setLaunchReviews(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!launchReviews
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchReviews(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${launchReviews
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(75)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Service area">
                  <p className="text-sm text-zinc-700">
                    “Do you serve specific cities or areas and want a map or
                    service area section?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setLaunchServiceArea(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!launchServiceArea
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchServiceArea(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${launchServiceArea
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(50)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Content / copy">
                  <p className="text-sm text-zinc-700">
                    “Will you be providing the text and content for the website,
                    or would you like help writing it?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLaunchCopywriting(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!launchCopywriting
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I will provide the text
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        We’ll plug in what you share.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchCopywriting(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchCopywriting
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I would like help writing it
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds copywriting assistance ({formatCurrency(150)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Branding">
                  <p className="text-sm text-zinc-700">
                    “Do you already have a logo and brand colors you want to
                    use?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLaunchBranding(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!launchBranding
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        Yes, I already have them
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchBranding(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchBranding
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I would like help choosing colors and styling
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds branding help ({formatCurrency(100)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Images">
                  <p className="text-sm text-zinc-700">
                    “Will you be providing photos for the website?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLaunchImages(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!launchImages
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        Yes, I’ll provide photos
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchImages(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchImages
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        No, I would like help selecting images
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds stock image sourcing ({formatCurrency(75)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Visual polish">
                  <p className="text-sm text-zinc-700">
                    “Would you like the site to include small animations or
                    motion effects when people scroll or hover?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setLaunchVisualPolish(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!launchVisualPolish
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchVisualPolish(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${launchVisualPolish
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(100)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Launch Site — Timeline">
                  <p className="text-sm text-zinc-700">
                    “Do you have a specific timeline for launching the website?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setLaunchRush(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!launchRush
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        Normal timeline
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLaunchRush(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${launchRush
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I need it launched quickly
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds rush build ({formatCurrency(150)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>
              </>
            )}

            {projectType === "business" && (
              <>
                <InterviewQuestion
                  title="Business Website — Page count"
                  helperText="Most businesses have pages like Home, Services, About, and Contact. Use this to estimate total page count."
                >
                  <p className="text-sm text-zinc-700">
                    “About how many pages do you think your website will need?”
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessPageRange("fiveOrLess");
                        setBusinessTotalPages(5);
                      }}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-xs sm:text-sm shadow-sm transition ${businessPageRange === "fiveOrLess"
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        5 or fewer pages
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessPageRange("sixToEight");
                        setBusinessTotalPages(7);
                      }}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-xs sm:text-sm shadow-sm transition ${businessPageRange === "sixToEight"
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        6–8 pages
                      </span>
                      <span className="mt-1 block text-[11px] text-zinc-600">
                        Adds pages above 5 at {formatCurrency(300)} each.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessPageRange("ninePlus");
                        setBusinessTotalPages(9);
                      }}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-xs sm:text-sm shadow-sm transition ${businessPageRange === "ninePlus"
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        9+ pages
                      </span>
                    </button>
                  </div>

                  {businessPageRange !== "fiveOrLess" && (
                    <div className="mt-2 space-y-1">
                      <label className="flex flex-col gap-1 text-xs text-zinc-700 sm:text-sm">
                        <span>
                          Follow-up: “Roughly how many pages do you think
                          you’ll need?”
                        </span>
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min={5}
                            value={businessTotalPages}
                            onChange={(event) => {
                              const next = Number(event.target.value) || 5;
                              setBusinessTotalPages(
                                Number.isNaN(next) ? 5 : Math.max(5, next)
                              );
                            }}
                            className="w-20 rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-300"
                          />
                          <span className="text-xs text-zinc-500">
                            First 5 pages are included.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </InterviewQuestion>

                <InterviewQuestion
                  title="Business Website — Service pages"
                  helperText="Great for businesses with distinct services that each deserve their own detail page."
                >
                  <p className="text-sm text-zinc-700">
                    “Would you like a detailed page for each of your services?”
                  </p>

                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessAdvancedServicePages(0)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessAdvancedServicePages === 0
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessAdvancedServicePages(
                          businessAdvancedServicePages || 3
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessAdvancedServicePages > 0
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes
                    </button>
                  </div>

                  {businessAdvancedServicePages > 0 && (
                    <div className="mt-2 space-y-1">
                      <label className="flex flex-col gap-1 text-xs text-zinc-700 sm:text-sm">
                        <span>
                          Follow-up: “How many services would you want their own
                          pages?”
                        </span>
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={businessAdvancedServicePages}
                            onChange={(event) => {
                              const next = Number(event.target.value) || 1;
                              setBusinessAdvancedServicePages(
                                Number.isNaN(next) ? 1 : Math.max(1, next)
                              );
                            }}
                            className="w-20 rounded-full border border-rose-200 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-300"
                          />
                          <span className="text-xs text-zinc-500">
                            Each advanced service page adds{" "}
                            {formatCurrency(200)}.
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Blog">
                  <p className="text-sm text-zinc-700">
                    “Would you like a blog so you can make blog posts on the site?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessBlog(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessBlog
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessBlog(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessBlog
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(600)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Portfolio / gallery">
                  <p className="text-sm text-zinc-700">
                    “Do you want to showcase photos of your work or past
                    projects on the website?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessPortfolio(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessPortfolio
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessPortfolio(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessPortfolio
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(500)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Booking">
                  <p className="text-sm text-zinc-700">
                    “Should customers be able to schedule appointments directly
                    from the website?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessBooking(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessBooking
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessBooking(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessBooking
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(400)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Lead capture / CRM">
                  <p className="text-sm text-zinc-700">
                    “Do you use a system to collect leads, like HubSpot,
                    GoHighLevel, or a mailing list?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessCrm(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessCrm
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessCrm(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessCrm
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(500)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Reviews">
                  <p className="text-sm text-zinc-700">
                    “Would you like your Google reviews shown on the site?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessReviews(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessReviews
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessReviews(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessReviews
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(150)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Service areas">
                  <p className="text-sm text-zinc-700">
                    “Do you want a map that highlights the cities or areas you
                    serve?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessServiceAreas(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessServiceAreas
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessServiceAreas(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessServiceAreas
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(200)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Images">
                  <p className="text-sm text-zinc-700">
                    “Will you be providing photos for the website?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setBusinessImages(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!businessImages
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        Yes, I’ll provide photos
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessImages(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${businessImages
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        No, I’d like help selecting images
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds image sourcing ({formatCurrency(250)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Content writing">
                  <p className="text-sm text-zinc-700">
                    “Will you be providing the text for each page, or would you
                    like help writing it?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setBusinessCopywriting(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!businessCopywriting
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I will provide it
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessCopywriting(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${businessCopywriting
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I would like help writing it
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds copywriting ({formatCurrency(1000)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Branding">
                  <p className="text-sm text-zinc-700">
                    “Do you already have a logo, brand colors, and a general
                    style for the website?”
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setBusinessBranding(false)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${!businessBranding
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">Yes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessBranding(true)}
                      className={`rounded-2xl border px-3.5 py-3 text-left text-sm shadow-sm transition ${businessBranding
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/60"
                        }`}
                    >
                      <span className="font-medium text-zinc-900">
                        I would like help defining that
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Adds brand identity setup ({formatCurrency(500)}).
                      </span>
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion title="Business Website — Motion / visual polish">
                  <p className="text-sm text-zinc-700">
                    “Would you like the website to include subtle animations or
                    motion effects for a more polished feel?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessMotion(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessMotion
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessMotion(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessMotion
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes (adds {formatCurrency(400)})
                    </button>
                  </div>
                </InterviewQuestion>

                <InterviewQuestion
                  title="Business Website — Custom features detection"
                  helperText="This protects you from under-quoting projects that really belong in the custom tier."
                >
                  <p className="text-sm text-zinc-700">
                    “Does the website need any special features like accounts,
                    membership access, online payments, or anything beyond a
                    standard business website?”
                  </p>
                  <div className="inline-flex gap-2 rounded-full bg-rose-50 p-1">
                    <button
                      type="button"
                      onClick={() => setBusinessCustomFunctionality(false)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${!businessCustomFunctionality
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusinessCustomFunctionality(true)}
                      className={`rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${businessCustomFunctionality
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500"
                        }`}
                    >
                      Yes
                    </button>
                  </div>
                  {businessCustomFunctionality && (
                    <p className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                      “That may move the project into our custom website tier
                      starting at{" "}
                      <span className="font-semibold">$12,000+</span>.” This
                      quote is still shown for context, but please plan a manual
                      review.
                    </p>
                  )}
                </InterviewQuestion>
              </>
            )}

            <InterviewQuestion title="Internal notes (optional)">
              <p className="text-sm text-zinc-700">
                Use this for any details Kelsey wants to remember from the
                conversation. Notes are not included in pricing.
              </p>
              <textarea
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-300"
                placeholder="Internal notes from the sales call…"
              />
            </InterviewQuestion>
          </section>

          <SummaryCard
            summary={summary}
            projectType={projectType}
            onCopy={handleCopy}
            isCopying={isCopying}
            copied={copied}
            internalNotes={internalNotes}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        </div>
      </main>
    </div>
  );
}

