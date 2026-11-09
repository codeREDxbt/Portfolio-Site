import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Narrative } from "@/components/Narrative";
import { Projects } from "@/components/Projects";
import { SiteNav } from "@/components/SiteNav";
import { DockNav } from "@/components/DockNav";
import { StackActivity } from "@/components/StackActivity";
import { Journey } from "@/components/Journey";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PageLoader />
      {/* Curtain: opaque layer that slides up to reveal the fixed footer. */}
      <div className="relative z-10 bg-background">
        <SiteNav />
        <DockNav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Narrative />
          <Projects />
          <StackActivity />
          <Journey />
          <Contact />
        </main>
      </div>
      {/* Spacer sized by Footer via --footer-h; the fixed footer shows through here. */}
      <div data-footer-spacer aria-hidden="true" style={{ height: "var(--footer-h, 0px)" }} />
      <Footer />
    </>
  );
}
