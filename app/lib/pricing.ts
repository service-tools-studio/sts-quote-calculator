export type ProjectType = "launch" | "business";

export interface LaunchInputs {
  totalSections: number;
  bookingIntegration: boolean;
  googleReviewsIntegration: boolean;
  serviceAreaMap: boolean;
  copywritingAssistance: boolean;
  brandingHelp: boolean;
  stockImageSourcing: boolean;
  customIcons: boolean;
  animations: boolean;
  rushBuild: boolean;
}

export interface BusinessInputs {
  standardPages: number;
  advancedServicePages: number;
  blogSetup: boolean;
  portfolioGallery: boolean;
  bookingIntegration: boolean;
  crmIntegration: boolean;
  googleReviewsIntegration: boolean;
  serviceAreaMapSystem: boolean;
  imageSourcing: boolean;
  copywritingAssistance: boolean;
  brandIdentitySetup: boolean;
  advancedAnimations: boolean;
  customFunctionality: boolean;
}

export interface QuoteLineItem {
  label: string;
  amount: number;
}

export interface QuoteSummary {
  projectType: ProjectType;
  basePrice: number;
  baseLabel: string;
  lineItems: QuoteLineItem[];
  total: number;
  requiresCustomReview: boolean;
}

const PRICING = {
  launch: {
    basePrice: 1000,
    addOns: {
      bookingIntegration: { label: "Booking Integration", price: 75 },
      googleReviewsIntegration: { label: "Google Reviews Integration", price: 75 },
      serviceAreaMap: { label: "Service Area Map", price: 50 },
      copywritingAssistance: { label: "Copywriting Assistance", price: 150 },
      brandingHelp: {
        label: "Branding Help / Logo Cleanup / Color Direction",
        price: 100,
      },
      stockImageSourcing: { label: "Stock Image Sourcing", price: 75 },
      customIcons: { label: "Custom Icons / Simple Graphics", price: 75 },
      animations: { label: "Animations / Motion Elements", price: 100 },
      rushBuild: { label: "Rush Build", price: 150 },
    },
  },
  business: {
    basePrice: 4000,
    addOns: {
      blogSetup: { label: "Blog Setup", price: 600 },
      portfolioGallery: { label: "Portfolio / Gallery System", price: 500 },
      bookingIntegration: { label: "Booking Integration", price: 400 },
      crmIntegration: { label: "CRM / Lead Capture Integration", price: 500 },
      googleReviewsIntegration: { label: "Google Reviews Integration", price: 150 },
      serviceAreaMapSystem: { label: "Service Area Map System", price: 200 },
      imageSourcing: { label: "Image Sourcing / Photo Curation", price: 250 },
      copywritingAssistance: { label: "Copywriting Assistance", price: 1000 },
      brandIdentitySetup: { label: "Brand Identity Setup", price: 500 },
      advancedAnimations: { label: "Advanced Animations / Motion", price: 400 },
    },
  },
} as const;

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function calculateLaunchQuote(inputs: LaunchInputs): QuoteSummary {
  const basePrice = PRICING.launch.basePrice;
  let total = basePrice;
  const lineItems: QuoteLineItem[] = [];

  if (inputs.totalSections > 5) {
    const extraSections = inputs.totalSections - 5;
    const amount = extraSections * 50;
    total += amount;
    lineItems.push({
      label: `Extra Sections (${extraSections})`,
      amount,
    });
  }

  const addOns = PRICING.launch.addOns;

  if (inputs.bookingIntegration) {
    total += addOns.bookingIntegration.price;
    lineItems.push({
      label: addOns.bookingIntegration.label,
      amount: addOns.bookingIntegration.price,
    });
  }

  if (inputs.googleReviewsIntegration) {
    total += addOns.googleReviewsIntegration.price;
    lineItems.push({
      label: addOns.googleReviewsIntegration.label,
      amount: addOns.googleReviewsIntegration.price,
    });
  }

  if (inputs.serviceAreaMap) {
    total += addOns.serviceAreaMap.price;
    lineItems.push({
      label: addOns.serviceAreaMap.label,
      amount: addOns.serviceAreaMap.price,
    });
  }

  if (inputs.copywritingAssistance) {
    total += addOns.copywritingAssistance.price;
    lineItems.push({
      label: addOns.copywritingAssistance.label,
      amount: addOns.copywritingAssistance.price,
    });
  }

  if (inputs.brandingHelp) {
    total += addOns.brandingHelp.price;
    lineItems.push({
      label: addOns.brandingHelp.label,
      amount: addOns.brandingHelp.price,
    });
  }

  if (inputs.stockImageSourcing) {
    total += addOns.stockImageSourcing.price;
    lineItems.push({
      label: addOns.stockImageSourcing.label,
      amount: addOns.stockImageSourcing.price,
    });
  }

  if (inputs.customIcons) {
    total += addOns.customIcons.price;
    lineItems.push({
      label: addOns.customIcons.label,
      amount: addOns.customIcons.price,
    });
  }

  if (inputs.animations) {
    total += addOns.animations.price;
    lineItems.push({
      label: addOns.animations.label,
      amount: addOns.animations.price,
    });
  }

  if (inputs.rushBuild) {
    total += addOns.rushBuild.price;
    lineItems.push({
      label: addOns.rushBuild.label,
      amount: addOns.rushBuild.price,
    });
  }

  return {
    projectType: "launch",
    basePrice,
    baseLabel: "Launch Site Base Package",
    lineItems,
    total,
    requiresCustomReview: false,
  };
}

export function calculateBusinessQuote(inputs: BusinessInputs): QuoteSummary {
  const basePrice = PRICING.business.basePrice;
  let total = basePrice;
  const lineItems: QuoteLineItem[] = [];

  if (inputs.standardPages > 5) {
    const extraPages = inputs.standardPages - 5;
    const amount = extraPages * 300;
    total += amount;
    lineItems.push({
      label: `Additional Standard Pages (${extraPages})`,
      amount,
    });
  }

  if (inputs.advancedServicePages > 0) {
    const amount = inputs.advancedServicePages * 200;
    total += amount;
    lineItems.push({
      label: `Advanced Service Pages (${inputs.advancedServicePages})`,
      amount,
    });
  }

  const addOns = PRICING.business.addOns;

  if (inputs.blogSetup) {
    total += addOns.blogSetup.price;
    lineItems.push({
      label: addOns.blogSetup.label,
      amount: addOns.blogSetup.price,
    });
  }

  if (inputs.portfolioGallery) {
    total += addOns.portfolioGallery.price;
    lineItems.push({
      label: addOns.portfolioGallery.label,
      amount: addOns.portfolioGallery.price,
    });
  }

  if (inputs.bookingIntegration) {
    total += addOns.bookingIntegration.price;
    lineItems.push({
      label: addOns.bookingIntegration.label,
      amount: addOns.bookingIntegration.price,
    });
  }

  if (inputs.crmIntegration) {
    total += addOns.crmIntegration.price;
    lineItems.push({
      label: addOns.crmIntegration.label,
      amount: addOns.crmIntegration.price,
    });
  }

  if (inputs.googleReviewsIntegration) {
    total += addOns.googleReviewsIntegration.price;
    lineItems.push({
      label: addOns.googleReviewsIntegration.label,
      amount: addOns.googleReviewsIntegration.price,
    });
  }

  if (inputs.serviceAreaMapSystem) {
    total += addOns.serviceAreaMapSystem.price;
    lineItems.push({
      label: addOns.serviceAreaMapSystem.label,
      amount: addOns.serviceAreaMapSystem.price,
    });
  }

  if (inputs.imageSourcing) {
    total += addOns.imageSourcing.price;
    lineItems.push({
      label: addOns.imageSourcing.label,
      amount: addOns.imageSourcing.price,
    });
  }

  if (inputs.copywritingAssistance) {
    total += addOns.copywritingAssistance.price;
    lineItems.push({
      label: addOns.copywritingAssistance.label,
      amount: addOns.copywritingAssistance.price,
    });
  }

  if (inputs.brandIdentitySetup) {
    total += addOns.brandIdentitySetup.price;
    lineItems.push({
      label: addOns.brandIdentitySetup.label,
      amount: addOns.brandIdentitySetup.price,
    });
  }

  if (inputs.advancedAnimations) {
    total += addOns.advancedAnimations.price;
    lineItems.push({
      label: addOns.advancedAnimations.label,
      amount: addOns.advancedAnimations.price,
    });
  }

  return {
    projectType: "business",
    basePrice,
    baseLabel: "Business Website Base Package",
    lineItems,
    total,
    requiresCustomReview: inputs.customFunctionality,
  };
}

export function buildCopiedSummaryText(params: {
  summary: QuoteSummary;
  internalNotes?: string;
}): string {
  const { summary, internalNotes } = params;

  const projectTypeLabel =
    summary.projectType === "launch" ? "Launch Site" : "Business Website";

  const lines: string[] = [];

  lines.push("Service Tools Studio Quote");
  lines.push("");
  lines.push(`Project Type: ${projectTypeLabel}`);
  lines.push("");
  lines.push(`Base Package: ${formatCurrency(summary.basePrice)}`);

  summary.lineItems.forEach((item) => {
    lines.push(`${item.label}: ${formatCurrency(item.amount)}`);
  });

  lines.push("");
  lines.push(`Total Quote: ${formatCurrency(summary.total)}`);

  if (summary.requiresCustomReview) {
    lines.push("");
    lines.push(
      "Note: This quote may require manual review due to custom functionality requests. Custom projects may start at $12,000+."
    );
  }

  if (internalNotes && internalNotes.trim().length > 0) {
    lines.push("");
    lines.push("Internal Notes:");
    lines.push(internalNotes.trim());
  }

  return lines.join("\n");
}

