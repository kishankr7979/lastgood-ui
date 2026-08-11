/**
 * Lightweight, optional Google Analytics 4 (GA4) integration.
 * Activates automatically when VITE_GA_MEASUREMENT_ID environment variable is provided.
 * Gracefully no-ops when measurement ID is missing.
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID || isInitialized) return;

  try {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // Pageviews sent manually on route changes
    });

    isInitialized = true;
  } catch (e) {
    // Silent fail if script fails to load
  }
};

export const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  try {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
    });
  } catch (e) {
    // Ignore tracking error
  }
};

export const trackEvent = (action, category = "general", label = "", value = null) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (e) {
    // Ignore tracking error
  }
};
