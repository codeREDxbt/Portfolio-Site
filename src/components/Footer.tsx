import { profile, socials } from "@/data/portfolio";
import { VisitorCount } from "./VisitorCount";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8 md:px-16 lg:px-24">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-muted md:flex-row md:items-center">
        <p>© 2026 {profile.handle}. All rights reserved.</p>
        <p className="font-mono text-xs">
          <VisitorCount /> visits
        </p>
        <nav aria-label="Social links" className="flex gap-5">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
