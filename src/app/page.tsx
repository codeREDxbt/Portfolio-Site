import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Narrative } from "@/components/Narrative";
import { Projects } from "@/components/Projects";
import { SiteNav } from "@/components/SiteNav";
import { StackActivity } from "@/components/StackActivity";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteNav />
      <main id="main">
        <Hero />
        <Narrative />
        <Projects />
        <StackActivity />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
