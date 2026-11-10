import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { Narrative } from '@/components/Narrative';
import { Projects } from '@/components/Projects';
import { SiteNav } from '@/components/SiteNav';
import { DockNav } from '@/components/DockNav';
import { StackActivity } from '@/components/StackActivity';
import { Journey } from '@/components/Journey';
import { SmoothScroll } from '@/components/SmoothScroll';
import { PageLoader } from '@/components/PageLoader';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <PageLoader />
      {/* The curtain: opaque sheet over both pinned layers. Its bottom edge
          lifts to reveal the contact layer; the contact layer then lifts to
          reveal the footer. z-20 keeps the fixed nav/dock/menu inside it
          above both pinned layers. */}
      <div className="relative z-20 bg-background">
        <SiteNav />
        <DockNav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Narrative />
          <Projects />
          <StackActivity />
          <Journey />
        </main>
      </div>
      {/* Scroll room for the pinned contact reveal. Doubles as the #contact
          anchor — a fixed element can't be scrolled to. */}
      <div
        id="contact"
        data-contact-spacer
        className="scroll-mt-0"
        style={{ height: 'var(--contact-h, 0px)' }}
      />
      {/* Scroll room for the contact lift that reveals the footer. */}
      <div data-footer-spacer aria-hidden="true" style={{ height: 'var(--footer-h, 0px)' }} />
      {/* Pinned contact layer (z-10): revealed by the curtain, then lifts off
          the footer. Pinned footer (z-0) sits beneath everything. */}
      <Contact />
      <Footer />
    </>
  );
}
