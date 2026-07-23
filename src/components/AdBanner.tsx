'use client';
import { useT } from "../lib/LanguageContext";

export default function AdBanner() {
  const { t, lang } = useT();
  const isZh = lang === "zh";

  return (
    <div className="max-w-6xl mx-auto px-4 my-6">
      <div
        id="ad-container"
        className="ad-placeholder h-24 rounded-lg flex flex-col items-center justify-center gap-1"
      >
        <span className="text-xs">{t("ad.placeholder")}</span>
        {isZh ? (
          <span className="text-[10px] opacity-60">
            国内：百度联盟 / 国外：Google AdSense
          </span>
        ) : (
          <span className="text-[10px] opacity-60">
            Domestic: Baidu Union / International: Google AdSense
          </span>
        )}
      </div>
    </div>
  );
}
