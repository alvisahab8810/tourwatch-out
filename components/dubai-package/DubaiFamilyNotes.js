import { useState } from "react";

function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="dfn-section">
      <button
        className="dfn-section-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="dfn-pill">{title}</span>
        <span
          className="faq-icon"
          style={{
            display: "inline-block",
            transform: open ? "rotate(-90deg)" : "rotate(90deg)",
            transition: "0.3s ease",
            fontSize: "20px",
            fontFamily: "DM Sans",
          }}
        >
          &gt;
        </span>
      </button>
      {open && <div className="dfn-panel">{children}</div>}
    </div>
  );
}

function BulletText({ text }) {
  if (!text) return null;
  return (
    <ul className="dfn-bullet-list">
      {text.split("\n").filter(Boolean).map((line, i) => (
        <li key={i}>{line.replace(/^[•\-]\s*/, "")}</li>
      ))}
    </ul>
  );
}

function ImgGrid({ images }) {
  const visible = (images || []).filter(i => i?.src);
  if (!visible.length) return null;
  return (
    <div className="dfn-highlights">
      {visible.map((img, idx) => (
        <img key={idx} src={img.src} alt={img.alt || "image"} />
      ))}
    </div>
  );
}

export default function DubaiFamilyNotes({ pkg }) {
  if (!pkg) return null;

  return (
    <div className="dubai-family-notes" aria-live="polite">
      <div className="dfn-accordion">

        {(pkg.inclusions || pkg.exclusions) && (
          <AccordionSection title="Inclusions &amp; Exclusions">
            {pkg.inclusions && (
              <>
                <h4 className="dfn-sub-heading">Inclusions</h4>
                <BulletText text={pkg.inclusions} />
              </>
            )}
            {pkg.exclusions && (
              <>
                <h4 className="dfn-sub-heading">Exclusions</h4>
                <BulletText text={pkg.exclusions} />
              </>
            )}
          </AccordionSection>
        )}

        {pkg.aboutText && (
          <AccordionSection title={`About ${pkg.destination || "Destination"}`} defaultOpen>
            <div className="dfn-about">
              <div className="dfn-content">
                <div className="dfn-intro">
                  <img
                    src="/assets/images/dubai/icons/info-circle.svg"
                    alt="info"
                    className="info-icon"
                  />
                  <p>{pkg.aboutText}</p>
                </div>
                <ImgGrid images={pkg.aboutImages} />
              </div>
            </div>
          </AccordionSection>
        )}

        {pkg.bucketListText && (
          <AccordionSection title={`${pkg.destination || "Destination"} Bucket List`}>
            <BulletText text={pkg.bucketListText} />
            <ImgGrid images={pkg.bucketImages} />
          </AccordionSection>
        )}

        {(pkg.cancellationPolicy || pkg.bookingPolicy || pkg.termsConditions) && (
          <AccordionSection title="Cancellation &amp; Policies">
            {pkg.cancellationPolicy && (
              <>
                <h4 className="dfn-sub-heading">Cancellation Policy</h4>
                <BulletText text={pkg.cancellationPolicy} />
              </>
            )}
            {pkg.bookingPolicy && (
              <>
                <h4 className="dfn-sub-heading">Booking Policy</h4>
                <p>{pkg.bookingPolicy}</p>
              </>
            )}
            {pkg.termsConditions && (
              <>
                <h4 className="dfn-sub-heading">Terms &amp; Conditions</h4>
                <p>{pkg.termsConditions}</p>
              </>
            )}
          </AccordionSection>
        )}

      </div>
    </div>
  );
}
