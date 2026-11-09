'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile, projects } from '@/data/portfolio';
import { lockPageScroll, navigateToElement } from '@/lib/scroll';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

type Command = {
  id: string;
  group: 'Navigate' | 'Projects' | 'Actions';
  title: string;
  hint?: string;
  keywords: string;
  keepOpen?: boolean;
  run: () => void;
};

function score(command: Command, query: string) {
  const hay = `${command.title} ${command.group} ${command.keywords}`.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const at = hay.indexOf(q);
  if (at >= 0) return 10 + at * 0.01;
  let i = 0;
  for (const char of hay) if (char === q[i]) i += 1;
  return i === q.length ? 30 : Number.POSITIVE_INFINITY;
}

/**
 * ⌘K command palette — the engineer's menu. Fuzzy-find sections, projects,
 * and actions. Rendered as a true modal: background inert, page scroll
 * locked, Tab trapped, focus returns to the dock pill on dismiss.
 */
export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpenRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState('');
  const [restoreOnClose, setRestoreOnClose] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = (restoreFocus = true) => {
    setRestoreOnClose(restoreFocus);
    onClose();
  };

  // Small static list — built per render, no memoization needed.
  const navigate = (hash: string) => () => {
    close(false);
    const target = document.getElementById(hash.slice(1));
    if (target) navigateToElement(target, hash);
  };
  const openExternal = (url: string) => () => {
    close(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const copy = (value: string, label: string) => async () => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`Copied — ${label}`);
      window.setTimeout(() => setNotice(''), 2200);
    } catch {
      setNotice('Clipboard unavailable');
    }
  };

  const commands: Command[] = [
    { id: 'index', group: 'Navigate', title: 'Index', hint: 'Top of page', keywords: 'home hero start', run: navigate('#index') },
    { id: 'work', group: 'Navigate', title: 'Works', hint: 'Featured projects', keywords: 'projects case studies tuner', run: navigate('#work') },
    { id: 'stack', group: 'Navigate', title: 'Stack', hint: 'Systems and tools', keywords: 'tech skills github', run: navigate('#stack') },
    { id: 'journey', group: 'Navigate', title: 'Trail', hint: 'Signal log', keywords: 'timeline journey history constellation', run: navigate('#journey') },
    { id: 'contact', group: 'Navigate', title: 'Contact', hint: profile.email, keywords: 'email touch hire', run: navigate('#contact') },
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      group: 'Projects' as const,
      title: project.title,
      hint: `${project.year} — ${project.role}`,
      keywords: `${project.description} ${project.stack.join(' ')}`,
      run: openExternal(project.liveUrl ?? project.repoUrl ?? 'https://github.com/codeREDxbt'),
    })),
    {
      id: 'book',
      group: 'Actions',
      title: 'Book a call',
      hint: '15 min — Discord',
      keywords: 'meeting call schedule hire contact',
      run: () => {
        close(false);
        const contact = document.getElementById('contact');
        if (contact) navigateToElement(contact, '#contact');
        window.setTimeout(() => window.dispatchEvent(new Event('codered:booking:open')), 900);
      },
    },
    {
      id: 'copy-npx',
      group: 'Actions',
      title: 'Copy npx command',
      hint: profile.command,
      keywords: 'cli npm package copy terminal',
      keepOpen: true,
      run: async () => copy(profile.command, profile.command)(),
    },
    {
      id: 'copy-email',
      group: 'Actions',
      title: 'Copy email',
      hint: profile.email,
      keywords: 'mail address contact copy',
      keepOpen: true,
      run: async () => copy(profile.email, profile.email)(),
    },
    {
      id: 'theme',
      group: 'Actions',
      title: 'Toggle theme',
      hint: 'Dark / ivory',
      keywords: 'light dark mode color',
      keepOpen: true,
      run: () => {
        window.dispatchEvent(new Event('codered:theme-toggle'));
        setNotice('Theme toggled');
        window.setTimeout(() => setNotice(''), 1600);
      },
    },
    {
      id: 'resume',
      group: 'Actions',
      title: 'Resume',
      hint: 'PDF — opens in new tab',
      keywords: 'cv download document',
      run: openExternal(profile.resumeUrl),
    },
  ];

  const filtered = commands
    .map((command) => ({ command, rank: score(command, query) }))
    .filter((entry) => Number.isFinite(entry.rank))
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.command);

  // modal lifecycle: lock scroll, inert background, trap Tab
  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const unlockScroll = lockPageScroll();
    const siblings = Array.from(document.body.children).filter(
      (element) => element !== dialog && element.tagName !== 'SCRIPT'
    );
    siblings.forEach((element) => element.setAttribute('inert', ''));

    const focusFrame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', onKeyDown);
      siblings.forEach((element) => element.removeAttribute('inert'));
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // focus returns to the dock pill after a dismiss (not after running a command)
  useEffect(() => {
    if (wasOpenRef.current && !open && restoreOnClose) {
      document.querySelector<HTMLElement>('[aria-controls="command-menu"]')?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [open, restoreOnClose]);

  // reset search each time the palette opens
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      setQuery('');
      setActive(0);
      setNotice('');
      setRestoreOnClose(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const runCommand = (command: Command) => {
    command.run();
    if (!command.keepOpen) return;
    // keep-open actions (copy/theme) leave the palette in place with a notice
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => (value + 1) % Math.max(filtered.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => (value - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = filtered[active];
      if (command) runCommand(command);
    }
  };


  if (!mounted || typeof document === 'undefined') return null;

  let flatIndex = -1;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialogRef}
          id="command-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
          data-lenis-prevent
          className="fixed inset-0 z-[60] overflow-y-auto bg-background/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.22, ease: EASE }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-4 pt-[14vh] pb-10">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: reduced ? 0.1 : 0.32, ease: EASE }}
              className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40"
            >
              {/* input row */}
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <span className="font-mono text-sm text-red">›</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Type a command or search…"
                  aria-label="Search commands"
                  className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-dim"
                />
                <kbd className="rounded border border-line px-2 py-1 font-mono text-[10px] text-dim">ESC</kbd>
              </div>

              {/* results */}
              <div className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Commands">
                {filtered.length === 0 ? (
                  <p className="px-4 py-8 text-center font-mono text-xs text-dim">No signal — try another query</p>
                ) : (
                  (['Navigate', 'Projects', 'Actions'] as const).map((group) => {
                    const groupCommands = filtered.filter((command) => command.group === group);
                    if (groupCommands.length === 0) return null;
                    return (
                      <div key={group} className="mb-1">
                        <p className="px-3 pt-3 pb-1 font-mono text-[9px] uppercase tracking-[0.24em] text-dim">
                          {group}
                        </p>
                        {groupCommands.map((command) => {
                          flatIndex += 1;
                          const index = flatIndex;
                          const isActive = index === active;
                          return (
                            <button
                              key={command.id}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onMouseEnter={() => setActive(index)}
                              onClick={() => runCommand(command)}
                              className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                isActive ? 'bg-red/10 text-foreground' : 'text-muted hover:bg-surface-strong'
                              }`}
                            >
                              <span className="flex items-center gap-3 text-sm">
                                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-red' : 'bg-line'}`} />
                                {command.title}
                              </span>
                              {command.hint ? (
                                <span className="truncate font-mono text-[10px] text-dim">{command.hint}</span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>

              {/* footer */}
              <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                <span>{notice || 'codeRED command line'}</span>
                <span className="hidden sm:inline">↑↓ navigate · ↵ run</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

