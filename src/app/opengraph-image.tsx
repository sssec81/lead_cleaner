import { ImageResponse } from "next/og";

export const alt = "LeadCleanr";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #fff8ee 0%, #f9f3eb 48%, #d7f0eb 100%)",
          color: "#112433",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(17,36,51,0.12)",
            borderRadius: "36px",
            background: "rgba(255,255,255,0.82)",
            padding: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "72px",
                height: "72px",
                borderRadius: "24px",
                background: "#112433",
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              LC
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: 700 }}>
                LeadCleanr
              </div>
              <div style={{ fontSize: "18px", color: "#48606f" }}>
                Browser-first lead cleaning
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "860px",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              Clean messy lead CSV files before CRM import
            </div>
            <div
              style={{
                fontSize: "26px",
                lineHeight: 1.35,
                color: "#48606f",
              }}
            >
              Deduplicate rows, flag personal and role-based inboxes, generate
              domains, and export a cleaner file in your browser.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {["CSV cleanup", "Email extraction", "Browser-side processing"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "999px",
                    background: "rgba(15,118,110,0.1)",
                    color: "#0f766e",
                    padding: "12px 18px",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
