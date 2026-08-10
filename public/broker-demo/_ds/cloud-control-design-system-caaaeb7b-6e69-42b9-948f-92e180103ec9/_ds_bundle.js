/* @ds-bundle: {"format":4,"namespace":"CloudControlDesignSystem_caaaeb","components":[],"sourceHashes":{"ui_kits/marketing/CTASection.jsx":"a8cd7468e734","ui_kits/marketing/DemoModal.jsx":"586c213a8f2e","ui_kits/marketing/Footer.jsx":"7b7d0f408a15","ui_kits/marketing/GoldenThreadSection.jsx":"ae6bdb824888","ui_kits/marketing/Header.jsx":"705eb6ab6e56","ui_kits/marketing/Hero.jsx":"57faf8d98539","ui_kits/marketing/Icon.jsx":"6fd5aae52d1c","ui_kits/marketing/PillarCard.jsx":"52198262dd7d","ui_kits/marketing/PillarsSection.jsx":"ff9d2e701189","ui_kits/marketing/ServicesSection.jsx":"d563b2f0d611","ui_kits/marketing/StatsStrip.jsx":"3bf005125acc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CloudControlDesignSystem_caaaeb = window.CloudControlDesignSystem_caaaeb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/marketing/CTASection.jsx
try { (() => {
// CTASection.jsx — final navy CTA
function CTASection({
  onRequestDemo
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    className: "cta-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow on-dark"
  }, "Connect with us"), /*#__PURE__*/React.createElement("h2", null, "Bring your building to the chain."), /*#__PURE__*/React.createElement("p", null, "Cloud Control engineers the data infrastructure that makes your asset financeable, auditable, and resilient \u2014 without rebuilding it.")), /*#__PURE__*/React.createElement("div", {
    className: "cta-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-on-dark-primary btn-lg",
    onClick: onRequestDemo
  }, "Request a demo", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-on-dark-ghost btn-lg",
    href: "#capabilities"
  }, "Download capability statement"))));
}
window.CTASection = CTASection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/CTASection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/DemoModal.jsx
try { (() => {
// DemoModal.jsx — mock request-a-demo modal
function DemoModal({
  open,
  onClose
}) {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (open) setStep(0);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  })), step === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Request a demo"), /*#__PURE__*/React.createElement("h3", null, "Tell us about the asset."), /*#__PURE__*/React.createElement("p", {
    className: "modal-sub"
  }, "We'll respond within one business day with a 30-minute walkthrough tailored to your portfolio."), /*#__PURE__*/React.createElement("div", {
    className: "form-grid"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Project name"), /*#__PURE__*/React.createElement("input", {
    placeholder: "e.g. 1500 Mission St"
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Asset class"), /*#__PURE__*/React.createElement("select", null, /*#__PURE__*/React.createElement("option", null, "Commercial \xB7 Mid-rise"), /*#__PURE__*/React.createElement("option", null, "Commercial \xB7 High-rise"), /*#__PURE__*/React.createElement("option", null, "Industrial"), /*#__PURE__*/React.createElement("option", null, "Infrastructure"))), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Work email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "name@firm.com"
  })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("span", null, "Role"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Owner / GC / Finance"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setStep(1)
  }, "Request demo ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "modal-success"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 36
  })), /*#__PURE__*/React.createElement("h3", null, "Anchored."), /*#__PURE__*/React.createElement("p", {
    className: "modal-sub"
  }, "Your request is on the ledger. A member of the Cloud Control team will reach out within one business day."), /*#__PURE__*/React.createElement("code", {
    className: "modal-receipt"
  }, "tx \xB7 0x7f3e\u202691a4 \xB7 block #18,402,117"), /*#__PURE__*/React.createElement("div", {
    className: "modal-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onClose
  }, "Done")))));
}
window.DemoModal = DemoModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/DemoModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Footer.jsx
try { (() => {
// Footer.jsx
function Footer() {
  const cols = [{
    title: "Capabilities",
    links: ["Structured Assets", "Digital Twins", "Auditable Truth", "Tokenization", "BMM Validation"]
  }, {
    title: "Services",
    links: ["Supply Chain Records", "Smart Lien Waivers", "Payment Acceleration", "Performance Audits", "Cap Table Tokenization"]
  }, {
    title: "Company",
    links: ["About", "Press", "Careers", "Capability statement", "Contact"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-shield.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "brand-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "Cloud Control LLC"), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Earth \xB7 Technology \xB7 Humanity"))), /*#__PURE__*/React.createElement("p", null, "Aligning Earth, Technology and Humanity into a Life-Cycle Management methodology via IoT, Blockchain and Innovation across Clouds & Chains.")), /*#__PURE__*/React.createElement("nav", {
    className: "footer-cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    className: "footer-col",
    key: c.title
  }, /*#__PURE__*/React.createElement("h4", null, c.title), /*#__PURE__*/React.createElement("ul", null, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, l)))))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-fine"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Cloud Control LLC. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "v1.4 \xB7 capability-statement")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/GoldenThreadSection.jsx
try { (() => {
// GoldenThreadSection.jsx — lifecycle node sequence
function GoldenThreadSection() {
  const nodes = [{
    ts: "Step 01",
    label: "Document",
    body: "Submittals, shop drawings and contracts ingested and schema-mapped.",
    icon: "file",
    state: "done"
  }, {
    ts: "Step 02",
    label: "Digital Twin",
    body: "Baseline replica of the asset built and version-pinned to v1.0.0.",
    icon: "building",
    state: "done"
  }, {
    ts: "Step 03",
    label: "Sensor",
    body: "IoT instrumentation deployed; live telemetry begins streaming.",
    icon: "sensor",
    state: "done"
  }, {
    ts: "Step 04",
    label: "Ledger",
    body: "Performance & maintenance hashes anchored to the blockchain.",
    icon: "layers",
    state: "active"
  }, {
    ts: "Step 05",
    label: "Token",
    body: "Cap-table tokenization unlocks finance-grade liquidity.",
    icon: "coin",
    state: "future"
  }];
  const [active, setActive] = React.useState(3);
  return /*#__PURE__*/React.createElement("section", {
    id: "golden-thread",
    className: "thread-section"
  }, /*#__PURE__*/React.createElement("header", {
    className: "section-head dark"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow on-dark"
  }, "The Golden Thread"), /*#__PURE__*/React.createElement("h2", null, "One immutable timeline. From document to token.")), /*#__PURE__*/React.createElement("div", {
    className: "thread-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "thread-rail"
  }), nodes.map((n, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "thread-node node-" + n.state + (active === i ? " is-active" : ""),
    onClick: () => setActive(i)
  }, /*#__PURE__*/React.createElement("span", {
    className: "node-glyph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    className: "node-step"
  }, n.ts), /*#__PURE__*/React.createElement("span", {
    className: "node-label"
  }, n.label)))), /*#__PURE__*/React.createElement("div", {
    className: "thread-detail"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow on-dark"
  }, nodes[active].ts, " \xB7 ", nodes[active].label), /*#__PURE__*/React.createElement("p", null, nodes[active].body)));
}
window.GoldenThreadSection = GoldenThreadSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/GoldenThreadSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Header.jsx
try { (() => {
// Header.jsx — sticky top nav
function Header({
  onRequestDemo
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navItems = ["Capabilities", "Golden Thread", "BMM", "Services", "About"];
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header" + (scrolled ? " is-scrolled" : "")
  }, /*#__PURE__*/React.createElement("a", {
    className: "brand",
    href: "#top",
    "aria-label": "Cloud Control LLC home"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-shield.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "brand-name"
  }, /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, "Cloud Control LLC"), /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, "Earth \xB7 Technology \xB7 Humanity"))), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav"
  }, navItems.map(label => /*#__PURE__*/React.createElement("a", {
    key: label,
    href: "#" + label.toLowerCase().replace(/\s+/g, "-")
  }, label))), /*#__PURE__*/React.createElement("div", {
    className: "header-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: onRequestDemo
  }, "Sign in"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onRequestDemo
  }, "Request a demo", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
// Hero.jsx
function Hero({
  onRequestDemo
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-pattern",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Capability Statement \xB7 2026"), /*#__PURE__*/React.createElement("h1", {
    className: "hero-title"
  }, "From Concrete to ", /*#__PURE__*/React.createElement("em", null, "Code"), ": Value Engineering the Digital Asset."), /*#__PURE__*/React.createElement("p", {
    className: "hero-thesis"
  }, "Cloud Control LLC converts fragmented construction documentation into a", /*#__PURE__*/React.createElement("strong", null, " \"Golden Thread\""), " of structured data \u2014 enabling lifecycle governance and capital-market readiness for the built environment."), /*#__PURE__*/React.createElement("div", {
    className: "hero-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: onRequestDemo
  }, "Request a demo", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-secondary btn-lg",
    href: "#capabilities"
  }, "View capabilities")), /*#__PURE__*/React.createElement("div", {
    className: "hero-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Validated by"), /*#__PURE__*/React.createElement("span", {
    className: "trust-chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 14
  }), "GBA Blockchain Maturity Model"))), /*#__PURE__*/React.createElement("aside", {
    className: "hero-art",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "art-frame"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-shield.png",
    alt: "",
    className: "art-shield"
  }), /*#__PURE__*/React.createElement("div", {
    className: "art-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "art-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Anchored to chain \xB7 block\xA0#18,402,117")))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Icon.jsx
try { (() => {
// Icon.jsx — minimal inline Lucide-style icon set (stroke 1.75, currentColor)
function Icon({
  name,
  size = 20,
  className = ""
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": "true"
  };
  switch (name) {
    case "arrow-right":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m12 5 7 7-7 7"
      }));
    case "shield":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"
      }));
    case "shield-check":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m9 12 2 2 4-4"
      }));
    case "box":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3.3 7 8.7 5 8.7-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 22V12"
      }));
    case "network":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "14",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4"
      }));
    case "file":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 2v6h6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 13h6M9 17h6"
      }));
    case "building":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 21V8l9-5 9 5v13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 21V12h6v9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 21h18"
      }));
    case "sensor":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0"
      }));
    case "coin":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v10M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1 2-2.5 2.5-1.5.5-2.5 1-2.5 2.5a2.5 2.5 0 0 0 5 0"
      }));
    case "check":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M20 6 9 17l-5-5"
      }));
    case "menu":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18M3 12h18M3 18h18"
      }));
    case "x":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M18 6 6 18M6 6l12 12"
      }));
    case "lock":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "11",
        width: "18",
        height: "10",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11V7a5 5 0 0 1 10 0v4"
      }));
    case "receipt":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M4 2h16v20l-3-2-3 2-3-2-3 2-4-2z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 8h8M8 12h8M8 16h5"
      }));
    case "activity":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M22 12h-4l-3 9-6-18-3 9H2"
      }));
    case "layers":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m12 2-9 5 9 5 9-5z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3 12 9 5 9-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3 17 9 5 9-5"
      }));
    default:
      return null;
  }
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Icon.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/PillarCard.jsx
try { (() => {
// PillarCard.jsx — single capability tile
function PillarCard({
  num,
  title,
  body,
  bullets = [],
  chip,
  expanded,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "pillar-card" + (expanded ? " is-expanded" : ""),
    onClick: onToggle,
    tabIndex: 0,
    onKeyDown: e => (e.key === "Enter" || e.key === " ") && onToggle()
  }, /*#__PURE__*/React.createElement("header", {
    className: "pillar-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pillar-num"
  }, String(num).padStart(2, "0"), "."), /*#__PURE__*/React.createElement("span", {
    className: "pillar-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "pillar-body"
  }, /*#__PURE__*/React.createElement("p", null, body), expanded && bullets.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "pillar-bullets"
  }, bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), b))), /*#__PURE__*/React.createElement("footer", {
    className: "pillar-foot"
  }, chip && /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, chip), /*#__PURE__*/React.createElement("span", {
    className: "expand-hint"
  }, expanded ? "Collapse" : "More", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 12
  })))));
}
window.PillarCard = PillarCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/PillarCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/PillarsSection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// PillarsSection.jsx — five capability pillars
function PillarsSection() {
  const [openIdx, setOpenIdx] = React.useState(null);
  const pillars = [{
    title: "Converting Static Documents into Structured Assets",
    body: "We transition projects from human-readable PDFs to machine-readable datasets designed for repeated, system-level reuse and trust.",
    bullets: ["Submittal extraction", "Schema-mapped to industry standards", "Versioned & signed"],
    chip: "Golden Thread"
  }, {
    title: "Value Engineering through Digital Twins",
    body: "Our digital replicas allow teams to assess, manipulate, and optimize buildings to uncover efficiencies and reduce operational risks.",
    bullets: ["IFC/BIM interop", "Energy & maintenance scenarios", "Owner-side governance"],
    chip: "Digital Twin"
  }, {
    title: "Establishing an Auditable Truth",
    body: "We integrate IoT sensors with blockchain ledgers to ensure maintenance and performance data is immutable and transparent.",
    bullets: ["12+ sensor classes", "On-chain anchoring", "Tamper-evident audit log"],
    chip: "On-chain"
  }, {
    title: "Enabling Finance & Tokenization Readiness",
    body: "Clean digital outputs transform physical structures into finance-ready assets, reducing the 2–4% of inadequate information exchange.",
    bullets: ["Cap-table tokenization", "Smart lien waivers", "Accelerated payments"],
    chip: "Finance-ready"
  }, {
    title: "Validated by the Blockchain Maturity Model",
    body: "Our use of the GBA's BMM provides a quality-assurance roadmap that makes projects magnets for institutional capital.",
    bullets: ["GBA-administered", "Tier 1–5 assessment", "Third-party assured"],
    chip: "GBA BMM"
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "capabilities",
    className: "pillars"
  }, /*#__PURE__*/React.createElement("header", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Five capability pillars"), /*#__PURE__*/React.createElement("h2", null, "How we engineer the digital asset."), /*#__PURE__*/React.createElement("p", {
    className: "section-sub"
  }, "Each pillar maps a fragmented part of the construction lifecycle into structured, finance-grade data.")), /*#__PURE__*/React.createElement("div", {
    className: "pillar-grid"
  }, pillars.map((p, i) => /*#__PURE__*/React.createElement(PillarCard, _extends({
    key: i,
    num: i + 1
  }, p, {
    expanded: openIdx === i,
    onToggle: () => setOpenIdx(openIdx === i ? null : i)
  })))));
}
window.PillarsSection = PillarsSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/PillarsSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/ServicesSection.jsx
try { (() => {
// ServicesSection.jsx — the "Connect With Us" services list
function ServicesSection() {
  const services = [{
    icon: "receipt",
    title: "Immutable Supply Chain Records",
    body: "Every material, every transfer, signed and timestamped."
  }, {
    icon: "activity",
    title: "Accelerated, Transparent Payments",
    body: "Pay-when-paid logic compiled to on-chain settlement."
  }, {
    icon: "file",
    title: "Smart Lien Waiver Automation",
    body: "Conditional and unconditional waivers issued via smart contract."
  }, {
    icon: "sensor",
    title: "IoT & Building Performance Audits",
    body: "Live telemetry rolled into investor-grade reports."
  }, {
    icon: "coin",
    title: "Cap Table Tokenization",
    body: "Fractionalize the asset; widen the capital base."
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    className: "services"
  }, /*#__PURE__*/React.createElement("header", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Services"), /*#__PURE__*/React.createElement("h2", null, "What we deliver.")), /*#__PURE__*/React.createElement("ul", {
    className: "service-list"
  }, services.map(s => /*#__PURE__*/React.createElement("li", {
    className: "service-item",
    key: s.title
  }, /*#__PURE__*/React.createElement("span", {
    className: "service-icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    className: "service-text"
  }, /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body)), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16,
    className: "service-arrow"
  })))));
}
window.ServicesSection = ServicesSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/ServicesSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/StatsStrip.jsx
try { (() => {
// StatsStrip.jsx — value-prop counters
function StatsStrip() {
  const stats = [{
    kpi: "2–4%",
    label: "Information-exchange loss recovered"
  }, {
    kpi: "Tier 3",
    label: "GBA BMM certification target"
  }, {
    kpi: "12+",
    label: "IoT sensor classes supported"
  }, {
    kpi: "100%",
    label: "Of audit logs anchored on-chain"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "stats-strip"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "stat",
    key: s.label
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat-kpi"
  }, s.kpi), /*#__PURE__*/React.createElement("span", {
    className: "stat-label"
  }, s.label))));
}
window.StatsStrip = StatsStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/StatsStrip.jsx", error: String((e && e.message) || e) }); }

})();
