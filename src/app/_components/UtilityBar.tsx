import { emailHref, phoneHref, siteConfig } from "@/lib/site-config";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function UtilityBar() {
  const { phone, email, addressLines, hours, trustPoints } = siteConfig;

  return (
    <div className="utility-bar">
      <div className="utility-bar__inner">
        <div className="utility-bar__contact">
          {phone && (
            <span className="utility-bar__item">
              <svg {...iconProps}>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
              </svg>
              <a href={phoneHref}>{phone}</a>
            </span>
          )}
          {email && (
            <span className="utility-bar__item">
              <svg {...iconProps}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <a href={emailHref}>{email}</a>
            </span>
          )}
          {addressLines.length > 0 && (
            <span className="utility-bar__item">
              <svg {...iconProps}>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{addressLines.join(", ")}</span>
            </span>
          )}
          {hours.length > 0 && (
            <span className="utility-bar__item">
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{hours.join(" · ")}</span>
            </span>
          )}
        </div>
        {trustPoints.length > 0 && (
          <div className="utility-bar__trust">
            {trustPoints.join("  ·  ")}
          </div>
        )}
      </div>
    </div>
  );
}
