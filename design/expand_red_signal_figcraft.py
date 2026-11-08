import json
from pathlib import Path

from build_red_signal_figcraft import (
    MCP, ROOT, OUT, EXPORTS,
    BG, SURFACE, TEXT, MUTED, DIM, LINE, RED, GREEN,
    frame, text, rect, ellipse, vector, ref,
)


def image(parent, name, path, x, y, width, height):
    return {
        "command": "image.place",
        "params": {
            "path": str(path).replace("\\", "/"),
            "parent": parent,
            "name": name,
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "mode": "crop",
        },
    }


def make_board(mcp, key, name, x, y, width, height):
    result = mcp.call("create_node", {
        "type": "frame",
        "name": name,
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "props": {"fill": BG, "stroke": LINE, "strokeWeight": 1, "clip": True},
        "select": False,
    })
    return result["id"]


def save_and_export(mcp, boards):
    mcp.call("save_file", {"path": str(OUT).replace("\\", "/")})
    exports = {}
    for key, board_id in boards.items():
        target = EXPORTS / f"{key}-concept.png"
        mcp.call("export", {
            "ids": [board_id],
            "format": "png",
            "scale": 1,
            "path": str(target).replace("\\", "/"),
        })
        exports[key] = str(target)
    return exports


def main():
    mcp = MCP()
    try:
        mcp.call("open_file", {"path": str(OUT).replace("\\", "/")})
        boards = {
            "projects": make_board(mcp, "projects", "04 / Project System", 0, 1400, 1440, 1660),
            "contact": make_board(mcp, "contact", "05 / Stack Activity Contact", 1500, 1400, 1440, 1100),
            "menu": make_board(mcp, "menu", "06 / Desktop Menu Overlay", 3000, 0, 1440, 900),
            "mobile-menu": make_board(mcp, "mobile-menu", "07 / Mobile Menu Overlay", 3000, 1000, 390, 844),
        }

        p = boards["projects"]
        steps = [
            text(p, "Work eyebrow", "WORK / SELECTED BUILDS", 96, 52, 320, 12, RED, "Inter", "Medium", spacing=1.7),
            text(p, "Work heading", "Selected work", 96, 86, 500, 50, TEXT, line=56, spacing=-1.4),
            text(p, "Work note", "Four product stories first. Two supporting builds in the archive.", 850, 110, 450, 15, MUTED, align="right"),
        ]
        projects = [
            ("01", "Veilpay", "A multi-chain wallet with protocol-specific address isolation and integrated fiat on/off-ramp flows.", "Design + Development", "2026", "React / TypeScript / Web3", None),
            ("02", "PayTrack", "Employee attendance, overtime, and payroll management shaped into a clear operational dashboard.", "Design + Development", "2025", "React / Firebase / Tailwind", ROOT / "preview-paytrack.png"),
            ("03", "StellarPulse", "A real-time Stellar network explorer with analytics, search, and data-rich visualizations.", "Development", "2025", "React / Node.js / Stellar", ROOT / "preview-stellarpulse.png"),
            ("04", "Blockademia", "A decentralized learning platform for Web3 education, progress, and verifiable certification.", "Design + Development", "2025", "Solidity / React / Web3", ROOT / "preview-blockademia.png"),
        ]
        for i, (num, title, description, role, year, stack, asset) in enumerate(projects):
            y = 190 + i * 285
            media_name = f"media_{num}"
            steps += [
                rect(p, f"Project rule {num}", 96, y - 28, 1248, 1, LINE),
                text(p, f"Project number {num}", num, 96, y, 44, 12, DIM, "Inter", "Medium", spacing=1.0),
                text(p, f"Project title {num}", title, 156, y - 10, 440, 34, TEXT, "Inter", "Medium", line=40, spacing=-0.9),
                text(p, f"Project description {num}", description, 156, y + 42, 530, 15, MUTED, line=23),
                text(p, f"Project role {num}", f"ROLE  {role}   /   YEAR  {year}", 156, y + 116, 520, 10, DIM, "Inter", "Medium", spacing=1.0),
                text(p, f"Project stack {num}", stack, 156, y + 140, 520, 12, TEXT, "Inter", "Regular"),
                text(p, f"Project link {num}", "View project  ↗", 156, y + 176, 160, 13, RED, "Inter", "Medium"),
                frame(p, media_name, 820, y - 10, 500, 210, SURFACE, LINE, 18),
            ]
            if asset:
                steps.append(image(ref(media_name), f"Project image {num}", asset, 0, 0, 500, 210))
            else:
                steps += [
                    ellipse(ref(media_name), "Veilpay orbit outer", 110, -50, 320, 320, None, RED, 1.4, 0.5),
                    ellipse(ref(media_name), "Veilpay orbit inner", 166, 6, 208, 208, None, RED, 1.2, 0.7),
                    vector(ref(media_name), "Veilpay path", "M0 130 C90 10 170 220 270 82 S420 120 500 34", 0, 0, 500, 210, RED, 2.0, 0.8),
                    text(ref(media_name), "Veilpay media label", "PRIVATE / MULTI-CHAIN / PAYMENTS", 28, 164, 300, 10, TEXT, "Inter", "Medium", spacing=1.2),
                ]
        steps += [
            text(p, "Archive heading", "ARCHIVE", 96, 1370, 200, 11, DIM, "Inter", "Medium", spacing=1.5),
            rect(p, "Archive rule top", 96, 1404, 1248, 1, LINE),
            text(p, "Archive number 05", "05", 96, 1434, 44, 12, DIM, "Inter", "Medium"),
            text(p, "Archive title 05", "MediChainAI", 156, 1424, 320, 24, TEXT, "Inter", "Medium"),
            text(p, "Archive copy 05", "AI-assisted decentralized medical records and diagnostics.", 500, 1430, 480, 14, MUTED),
            text(p, "Archive year 05", "2025  ↗", 1190, 1430, 130, 12, DIM, align="right"),
            rect(p, "Archive rule middle", 96, 1482, 1248, 1, LINE),
            text(p, "Archive number 06", "06", 96, 1512, 44, 12, DIM, "Inter", "Medium"),
            text(p, "Archive title 06", "Aptos LMS", 156, 1502, 320, 24, TEXT, "Inter", "Medium"),
            text(p, "Archive copy 06", "No-code course creation with Move smart contracts on Aptos.", 500, 1508, 480, 14, MUTED),
            text(p, "Archive year 06", "2025  ↗", 1190, 1508, 130, 12, DIM, align="right"),
            rect(p, "Archive rule bottom", 96, 1560, 1248, 1, LINE),
        ]
        mcp.call("batch", {"label": "Full project system", "commands": steps})

        c = boards["contact"]
        contact_steps = [
            text(c, "Systems eyebrow", "STACK / SYSTEMS", 96, 52, 320, 12, RED, "Inter", "Medium", spacing=1.7),
            text(c, "Systems heading", "How I build", 96, 86, 500, 50, TEXT, line=56, spacing=-1.4),
        ]
        groups = [
            ("Product engineering", "React · Next.js · TypeScript · Tailwind"),
            ("Web3", "Solidity · Move · Web3.js · Aptos · Ethereum"),
            ("Backend & data", "Node.js · Express · PostgreSQL · Firebase"),
            ("Workflow", "Git · Figma · FigCraft · Vercel · Security"),
        ]
        for i, (title, items) in enumerate(groups):
            x = 96 if i % 2 == 0 else 720
            y = 176 + (i // 2) * 102
            contact_steps += [
                text(c, f"Stack group {i}", title, x, y, 480, 18, TEXT, "Inter", "Medium"),
                text(c, f"Stack items {i}", items, x, y + 32, 520, 14, MUTED),
                rect(c, f"Stack rule {i}", x, y + 70, 560, 1, LINE),
            ]
        contact_steps += [
            text(c, "Activity eyebrow", "PROOF / ACTIVITY", 96, 398, 320, 11, RED, "Inter", "Medium", spacing=1.7),
            rect(c, "Activity panel", 96, 434, 1248, 218, SURFACE, LINE, 18),
            text(c, "Activity title", "GitHub contributions", 128, 462, 360, 20, TEXT, "Inter", "Medium"),
            text(c, "Activity count", "1,332+ contributions in the last year", 128, 494, 360, 13, MUTED),
            text(c, "Activity note", "Live API with graceful fallback", 1000, 470, 290, 12, DIM, align="right"),
        ]
        palette = ["#292524", "#274536", "#35694B", "#4B9B6A", GREEN]
        for row in range(7):
            for col in range(26):
                level = (col * 3 + row * 5 + (col // 4)) % 9
                color = palette[0 if level < 4 else 1 if level < 6 else 2 if level < 8 else 3]
                contact_steps.append(rect(c, f"Contribution {col}-{row}", 128 + col * 15, 536 + row * 15, 11, 11, color, None, 2))
        contact_steps += [
            text(c, "Activity side title", "Build in public", 620, 532, 260, 22, TEXT, "Inter", "Medium"),
            text(c, "Activity side copy", "Consistent shipping across full-stack product work, smart contracts, tooling, and experiments.", 620, 572, 350, 14, MUTED, line=22),
            text(c, "Activity link", "Explore GitHub  ↗", 620, 614, 180, 12, GREEN, "Inter", "Medium"),
            rect(c, "Contact rule", 96, 714, 1248, 1, LINE),
            text(c, "Contact eyebrow", "CONTACT / START A CONVERSATION", 96, 752, 420, 11, RED, "Inter", "Medium", spacing=1.7),
            text(c, "Contact heading", "Have something\nworth building?", 96, 796, 740, 62, TEXT, "Inter", "Medium", line=66, spacing=-1.8),
            text(c, "Contact copy", "Tell me about the product, the problem, and where it is stuck. I’ll bring product thinking, interface polish, and engineering depth.", 850, 820, 400, 16, MUTED, line=25),
            text(c, "Contact email", "codeREDx07@proton.me", 96, 952, 360, 16, TEXT, "Inter", "Medium"),
            rect(c, "Contact CTA", 1080, 928, 264, 48, TEXT, None, 24),
            text(c, "Contact CTA text", "Book a call  ↗", 1164, 944, 110, 14, BG, "Inter", "Medium"),
            text(c, "Footer brand", "© 2026 codeRED", 96, 1040, 240, 12, DIM),
            text(c, "Footer links", "X  /  LinkedIn  /  GitHub  /  Resume", 1010, 1040, 330, 12, DIM, align="right"),
        ]
        mcp.call("batch", {"label": "Stack activity and contact", "commands": contact_steps})

        menu = boards["menu"]
        menu_steps = [
            text(menu, "Menu brand", "codeRED", 64, 34, 160, 18, TEXT, "Inter", "Medium"),
            text(menu, "Menu close", "Close  ×", 1240, 34, 120, 14, TEXT, align="right"),
            text(menu, "Menu label", "NAVIGATION", 96, 112, 240, 11, RED, "Inter", "Medium", spacing=1.6),
            ellipse(menu, "Menu orbit outer", 880, 170, 390, 390, None, RED, 1.1, 0.18),
            ellipse(menu, "Menu orbit inner", 954, 244, 242, 242, None, RED, 1.1, 0.28),
            vector(menu, "Menu signal", "M0 160 C120 20 220 270 350 80 S520 110 620 20", 790, 240, 620, 300, RED, 1.6, 0.38),
        ]
        for i, item in enumerate(["Index", "Works", "Stack", "Resume", "Get in touch"]):
            y = 166 + i * 116
            menu_steps += [
                text(menu, f"Menu num {i}", f"0{i + 1}", 96, y + 20, 48, 11, DIM, "Inter", "Medium", spacing=1.0),
                text(menu, f"Menu item {i}", item, 164, y, 620, 66, TEXT, "Inter", "Medium", line=72, spacing=-1.8),
                rect(menu, f"Menu item rule {i}", 164, y + 88, 560, 1, RED if i == 1 else LINE),
            ]
        menu_steps += [
            text(menu, "Menu role label", "ROLE", 1030, 164, 240, 10, DIM, "Inter", "Medium", spacing=1.5),
            text(menu, "Menu role", "Design-minded engineer", 1030, 190, 300, 17, TEXT),
            text(menu, "Menu status label", "STATUS", 1030, 242, 240, 10, DIM, "Inter", "Medium", spacing=1.5),
            ellipse(menu, "Menu status dot", 1030, 272, 8, 8, GREEN),
            text(menu, "Menu status", "Available for select work", 1048, 264, 280, 16, TEXT),
            text(menu, "Menu email label", "EMAIL", 1030, 330, 240, 10, DIM, "Inter", "Medium", spacing=1.5),
            text(menu, "Menu email", "codeREDx07@proton.me", 1030, 356, 300, 15, TEXT),
            text(menu, "Menu social label", "ELSEWHERE", 1030, 430, 240, 10, DIM, "Inter", "Medium", spacing=1.5),
            text(menu, "Menu socials", "X  /  LinkedIn  /  GitHub", 1030, 456, 300, 15, TEXT),
            text(menu, "Menu NPX", "$ npx coderedxbt", 1030, 536, 260, 13, RED, "Inter", "Medium"),
            text(menu, "Menu footer", "RED SIGNAL EDITORIAL  /  CONCEPT 01", 96, 838, 400, 11, DIM, "Inter", "Medium", spacing=1.2),
        ]
        mcp.call("batch", {"label": "Desktop menu overlay", "commands": menu_steps})

        mm = boards["mobile-menu"]
        mobile_menu_steps = [
            text(mm, "Mobile menu brand", "codeRED", 24, 24, 120, 16, TEXT, "Inter", "Medium"),
            text(mm, "Mobile menu close", "Close  ×", 282, 25, 84, 13, TEXT, align="right"),
            text(mm, "Mobile menu label", "NAVIGATION", 24, 90, 180, 10, RED, "Inter", "Medium", spacing=1.5),
        ]
        for i, item in enumerate(["Index", "Works", "Stack", "Resume", "Get in touch"]):
            y = 136 + i * 88
            mobile_menu_steps += [
                text(mm, f"Mobile menu num {i}", f"0{i + 1}", 24, y + 10, 34, 10, DIM, "Inter", "Medium"),
                text(mm, f"Mobile menu item {i}", item, 70, y, 260, 40, TEXT, "Inter", "Medium", line=46, spacing=-1.0),
                rect(mm, f"Mobile menu rule {i}", 70, y + 60, 296, 1, RED if i == 1 else LINE),
            ]
        mobile_menu_steps += [
            ellipse(mm, "Mobile menu status dot", 24, 618, 8, 8, GREEN),
            text(mm, "Mobile menu status", "Available for select work", 42, 610, 280, 15, TEXT),
            text(mm, "Mobile menu email", "codeREDx07@proton.me", 24, 662, 280, 14, TEXT, "Inter", "Medium"),
            text(mm, "Mobile menu socials", "X  /  LinkedIn  /  GitHub", 24, 704, 280, 13, MUTED),
            text(mm, "Mobile menu NPX", "$ npx coderedxbt", 24, 754, 220, 12, RED, "Inter", "Medium"),
            text(mm, "Mobile menu footer", "RED SIGNAL  /  2026", 24, 806, 220, 10, DIM, "Inter", "Medium", spacing=1.2),
        ]
        mcp.call("batch", {"label": "Mobile menu overlay", "commands": mobile_menu_steps})

        exports = save_and_export(mcp, boards)
        print(json.dumps({"ok": True, "file": str(OUT), "boards": boards, "exports": exports}, indent=2))
    finally:
        mcp.close()


if __name__ == "__main__":
    main()
