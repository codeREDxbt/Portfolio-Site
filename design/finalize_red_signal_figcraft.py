import json

from build_red_signal_figcraft import (
    MCP, ROOT, OUT,
    BG, SURFACE, TEXT, MUTED, DIM, LINE, RED, GREEN,
    frame, text, rect, ellipse, vector, ref,
)
from expand_red_signal_figcraft import image, make_board, save_and_export


def main():
    mcp = MCP()
    try:
        mcp.call("open_file", {"path": str(OUT).replace("\\", "/")})
        boards = {
            "mobile-work": make_board(mcp, "mobile-work", "08 / Mobile Work and Contact", 4500, 0, 390, 2000),
            "booking": make_board(mcp, "booking", "09 / Booking Modal", 4950, 0, 1200, 800),
            "og": make_board(mcp, "og", "10 / Social Preview", 4950, 900, 1200, 630),
            "ui-states": make_board(mcp, "ui-states", "11 / UI States", 6210, 0, 900, 700),
        }

        m = boards["mobile-work"]
        steps = [
            text(m, "Mobile work label", "SELECTED WORK", 24, 36, 180, 10, RED, "Inter", "Medium", spacing=1.4),
            text(m, "Mobile work heading", "Work that shipped.", 24, 66, 330, 32, TEXT, "Inter", "Medium", line=38, spacing=-0.8),
        ]
        projects = [
            ("01", "Veilpay", "Multi-chain wallet infrastructure and payment flows.", None),
            ("02", "PayTrack", "Attendance, overtime, and payroll made clear.", ROOT / "preview-paytrack.png"),
            ("03", "StellarPulse", "Real-time Stellar analytics and explorer.", ROOT / "preview-stellarpulse.png"),
            ("04", "Blockademia", "Web3 learning and verifiable certification.", ROOT / "preview-blockademia.png"),
        ]
        for i, (num, title, description, asset) in enumerate(projects):
            y = 140 + i * 330
            media = f"mobile_media_{num}"
            steps += [
                frame(m, media, 24, y, 342, 150, SURFACE, LINE, 14),
                text(m, f"Mobile project num {num}", num, 24, y + 172, 34, 10, DIM, "Inter", "Medium"),
                text(m, f"Mobile project title {num}", title, 70, y + 164, 220, 24, TEXT, "Inter", "Medium"),
                text(m, f"Mobile project copy {num}", description, 24, y + 204, 320, 14, MUTED, line=21),
                text(m, f"Mobile project link {num}", "View project  ↗", 24, y + 254, 140, 12, RED, "Inter", "Medium"),
            ]
            if asset:
                steps.append(image(ref(media), f"Mobile project image {num}", asset, 0, 0, 342, 150))
            else:
                steps += [
                    ellipse(ref(media), "Mobile Veilpay orbit", 100, -55, 220, 220, None, RED, 1.2, 0.5),
                    vector(ref(media), "Mobile Veilpay path", "M0 100 C70 10 130 160 205 65 S300 80 342 28", 0, 10, 342, 140, RED, 1.8, 0.8),
                ]
        steps += [
            rect(m, "Mobile archive rule", 24, 1470, 342, 1, LINE),
            text(m, "Mobile archive", "ARCHIVE", 24, 1496, 120, 10, DIM, "Inter", "Medium", spacing=1.3),
            text(m, "Mobile archive 05", "05  MediChainAI", 24, 1530, 240, 18, TEXT, "Inter", "Medium"),
            text(m, "Mobile archive 06", "06  Aptos LMS", 24, 1570, 240, 18, TEXT, "Inter", "Medium"),
            rect(m, "Mobile contact rule", 24, 1630, 342, 1, LINE),
            text(m, "Mobile contact label", "CONTACT", 24, 1666, 120, 10, RED, "Inter", "Medium", spacing=1.4),
            text(m, "Mobile contact heading", "Have something\nworth building?", 24, 1702, 330, 38, TEXT, "Inter", "Medium", line=42, spacing=-1.0),
            text(m, "Mobile contact copy", "Tell me about the product, the problem, and where it is stuck.", 24, 1800, 310, 15, MUTED, line=23),
            rect(m, "Mobile contact CTA", 24, 1870, 342, 50, TEXT, None, 25),
            text(m, "Mobile contact CTA text", "Book a call  ↗", 135, 1887, 120, 14, BG, "Inter", "Medium"),
            text(m, "Mobile footer", "© 2026 codeRED", 24, 1950, 200, 11, DIM),
        ]
        mcp.call("batch", {"label": "Mobile work and contact", "commands": steps})

        b = boards["booking"]
        booking_steps = [
            text(b, "Booking board label", "INTERACTION / BOOK A CALL", 32, 24, 320, 11, RED, "Inter", "Medium", spacing=1.4),
            frame(b, "booking_modal", 100, 70, 1000, 660, SURFACE, LINE, 24),
            rect(ref("booking_modal"), "Booking sidebar", 0, 0, 280, 660, "#131110", None, [24, 0, 0, 24]),
            ellipse(ref("booking_modal"), "Booking avatar", 32, 34, 56, 56, RED, None, 28, 0.85),
            text(ref("booking_modal"), "Booking name", "Vinayak Vashisth", 32, 112, 210, 17, TEXT, "Inter", "Medium"),
            text(ref("booking_modal"), "Booking title", "15 Min Meeting", 32, 154, 210, 26, TEXT, "Inter", "Medium", line=32, spacing=-0.5),
            text(ref("booking_modal"), "Booking duration", "15m  /  Discord  /  Asia/Kolkata", 32, 204, 210, 12, MUTED, line=20),
            text(ref("booking_modal"), "Booking note", "A focused call about your product, problem, and next step.", 32, 264, 196, 14, MUTED, line=22),
            rect(ref("booking_modal"), "Booking divider", 32, 340, 216, 1, LINE),
            text(ref("booking_modal"), "Booking email", "codeREDx07@proton.me", 32, 372, 210, 12, TEXT),
            text(ref("booking_modal"), "Booking close", "Close  ×", 884, 24, 84, 13, MUTED, align="right"),
            text(ref("booking_modal"), "Calendar month", "January 2026", 320, 36, 240, 22, TEXT, "Inter", "Medium"),
            text(ref("booking_modal"), "Calendar arrows", "‹     ›", 616, 38, 80, 20, TEXT, align="right"),
            text(ref("booking_modal"), "Time title", "Select a time", 748, 40, 180, 18, TEXT, "Inter", "Medium"),
            text(ref("booking_modal"), "Time zone", "GMT +5:30", 748, 70, 180, 11, DIM),
        ]
        weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
        for col, day in enumerate(weekdays):
            booking_steps.append(text(ref("booking_modal"), f"Weekday {day}", day, 320 + col * 54, 96, 46, 10, DIM, "Inter", "Medium", align="center"))
        for i in range(35):
            row, col = divmod(i, 7)
            day = i + 1
            selected = day == 6
            muted = day in [1, 2, 3, 4, 5, 11, 12]
            if selected:
                booking_steps.append(rect(ref("booking_modal"), "Selected day", 320 + col * 54, 132 + row * 52, 42, 42, RED, None, 21))
            booking_steps.append(text(ref("booking_modal"), f"Calendar day {day}", str(day), 320 + col * 54, 144 + row * 52, 42, 12, TEXT if selected else DIM if muted else TEXT, "Inter", "Medium" if selected else "Regular", align="center"))
        for i, slot in enumerate(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"]):
            y = 112 + i * 58
            booking_steps += [
                rect(ref("booking_modal"), f"Slot {slot}", 748, y, 196, 42, RED if slot == "10:00" else "none", RED if slot == "10:00" else LINE, 10),
                text(ref("booking_modal"), f"Slot text {slot}", slot, 748, y + 13, 196, 12, TEXT if slot == "10:00" else MUTED, "Inter", "Medium", align="center"),
            ]
        booking_steps += [
            rect(ref("booking_modal"), "Booking next", 748, 544, 196, 46, TEXT, None, 23),
            text(ref("booking_modal"), "Booking next text", "Continue  →", 798, 559, 96, 13, BG, "Inter", "Medium"),
            text(ref("booking_modal"), "Booking footnote", "No payment required. Confirmation follows by email.", 320, 596, 360, 11, DIM),
        ]
        mcp.call("batch", {"label": "Booking modal", "commands": booking_steps})

        og = boards["og"]
        og_steps = [
            text(og, "OG brand", "codeRED", 72, 58, 220, 24, TEXT, "Inter", "Medium", spacing=-0.4),
            text(og, "OG eyebrow", "VINAYAK VASHISTH  /  WEB3 × FULL-STACK", 72, 154, 520, 13, RED, "Inter", "Medium", spacing=1.6),
            text(og, "OG heading", "Building secure,\nexpressive products\nfor the decentralized web.", 72, 210, 720, 62, TEXT, "Inter", "Medium", line=68, spacing=-1.8),
            text(og, "OG footer", "ENGINEERING  /  INTERFACE DESIGN  /  BLOCKCHAIN", 72, 542, 560, 12, MUTED, "Inter", "Medium", spacing=1.4),
            ellipse(og, "OG orbit outer", 820, 106, 310, 310, None, RED, 1.3, 0.45),
            ellipse(og, "OG orbit middle", 866, 152, 218, 218, None, RED, 1.2, 0.65),
            ellipse(og, "OG core", 932, 218, 86, 86, RED, None, 43, 0.22),
            vector(og, "OG signal", "M0 160 C80 40 160 250 270 80 S390 100 460 20", 742, 148, 460, 300, RED, 2.0, 0.75),
            text(og, "OG URL", "coderedxbt.dev", 942, 542, 180, 13, TEXT, "Inter", "Medium", align="right"),
        ]
        mcp.call("batch", {"label": "Social sharing preview", "commands": og_steps})

        u = boards["ui-states"]
        ui_steps = [
            text(u, "UI label", "COMPONENTS / STATES", 32, 30, 280, 11, RED, "Inter", "Medium", spacing=1.5),
            text(u, "UI heading", "Interaction states", 32, 66, 400, 36, TEXT, "Inter", "Medium", line=42, spacing=-0.8),
            text(u, "Button group", "BUTTONS", 32, 144, 200, 10, DIM, "Inter", "Medium", spacing=1.4),
        ]
        buttons = [
            ("Default", 32, TEXT, BG, LINE, TEXT),
            ("Hover", 172, RED, TEXT, RED, TEXT),
            ("Focus", 312, SURFACE, TEXT, TEXT, TEXT),
            ("Disabled", 452, SURFACE, DIM, LINE, DIM),
        ]
        for label, x, fill, color, stroke, text_color in buttons:
            ui_steps += [
                rect(u, f"Button {label}", x, 176, 124, 44, fill, stroke, 22),
                text(u, f"Button text {label}", label, x, 190, 124, 13, color if label != "Default" else BG, "Inter", "Medium", align="center"),
            ]
        ui_steps += [
            text(u, "Input group", "FORM INPUTS", 32, 268, 200, 10, DIM, "Inter", "Medium", spacing=1.4),
            text(u, "Input default label", "Email", 32, 300, 180, 12, TEXT, "Inter", "Medium"),
            rect(u, "Input default", 32, 322, 250, 46, SURFACE, LINE, 10),
            text(u, "Input default text", "you@example.com", 48, 337, 200, 13, DIM),
            text(u, "Input focus label", "Focused", 318, 300, 180, 12, TEXT, "Inter", "Medium"),
            rect(u, "Input focus", 318, 322, 250, 46, SURFACE, RED, 10),
            text(u, "Input focus text", "vinayak@…", 334, 337, 200, 13, TEXT),
            text(u, "Input error label", "Error", 604, 300, 180, 12, RED, "Inter", "Medium"),
            rect(u, "Input error", 604, 322, 250, 46, SURFACE, RED, 10),
            text(u, "Input error text", "Enter a valid email", 620, 337, 200, 13, RED),
            text(u, "Chip group", "METADATA / CHIPS", 32, 420, 240, 10, DIM, "Inter", "Medium", spacing=1.4),
            rect(u, "Chip available", 32, 452, 132, 32, GREEN, None, 16, 0.12),
            text(u, "Chip available text", "AVAILABLE", 50, 462, 100, 10, GREEN, "Inter", "Medium", spacing=1.0),
            rect(u, "Chip web3", 180, 452, 96, 32, SURFACE, LINE, 16),
            text(u, "Chip web3 text", "WEB3", 214, 462, 60, 10, MUTED, "Inter", "Medium", spacing=1.0),
            rect(u, "Chip npx", 292, 452, 176, 32, SURFACE, LINE, 16),
            text(u, "Chip npx text", "$ npx coderedxbt", 310, 462, 140, 10, MUTED, "Inter", "Medium"),
            text(u, "Link group", "LINKS / SIGNAL", 32, 532, 240, 10, DIM, "Inter", "Medium", spacing=1.4),
            text(u, "Project link", "View project  ↗", 32, 564, 160, 16, RED, "Inter", "Medium"),
            rect(u, "Project link line", 32, 594, 180, 2, RED),
            text(u, "Focus note", "Focus rings stay visible; reduced-motion mode keeps every state instant and readable.", 32, 638, 720, 13, MUTED, line=20),
        ]
        mcp.call("batch", {"label": "UI states", "commands": ui_steps})

        exports = save_and_export(mcp, boards)
        print(json.dumps({"ok": True, "file": str(OUT), "boards": boards, "exports": exports}, indent=2))
    finally:
        mcp.close()


if __name__ == "__main__":
    main()
