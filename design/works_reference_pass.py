import json

from build_red_signal_figcraft import MCP, ROOT, OUT, BG, SURFACE, TEXT, MUTED, DIM, LINE, RED, frame, text, rect, ellipse, vector, ref
from expand_red_signal_figcraft import image, make_board, save_and_export


def main():
    mcp = MCP()
    try:
        mcp.call("open_file", {"path": str(OUT).replace("\\", "/")})
        board = make_board(mcp, "works-reference", "12 / Works Reference Pass", 6210, 800, 1440, 1200)
        steps = [
            text(board, "Works label", "WORKS / REFERENCE PASS", 96, 42, 320, 11, RED, "Inter", "Medium", spacing=1.7),
            text(board, "Featured word", "Featured", 96, 88, 360, 70, TEXT, "Inter", "Medium", line=76, spacing=-2.0),
            frame(board, "works_heading_media", 440, 92, 220, 118, SURFACE, LINE, 59),
            image(ref("works_heading_media"), "Heading media", ROOT / "public" / "images" / "projects" / "preview-paytrack.png", 0, 0, 220, 118),
            text(board, "Work word", "Work (04)", 700, 88, 420, 70, TEXT, "Inter", "Medium", line=76, spacing=-2.0),
            rect(board, "Heading rule", 96, 246, 1248, 1, LINE),
        ]
        projects = [
            ("01", "Veilpay", "Multi-chain wallet infrastructure with protocol-specific address isolation and fiat flows.", None, "ROLE  DESIGN + DEV", "YEAR  2026"),
            ("02", "PayTrack", "Attendance, overtime, and payroll shaped into a clear operational dashboard.", ROOT / "public" / "images" / "projects" / "preview-paytrack.png", "ROLE  DESIGN + DEV", "YEAR  2025"),
        ]
        for i, (num, title, desc, asset, role, year) in enumerate(projects):
            x = 96 + i * 640
            media = f"works_media_{num}"
            steps += [
                frame(board, media, x, 310, 608, 380, SURFACE, LINE, 18),
                text(board, f"Number {num}", num, x, 724, 48, 12, DIM, "Inter", "Medium"),
                text(board, f"Title {num}", title, x, 750, 460, 34, TEXT, "Inter", "Medium", line=40, spacing=-0.9),
                text(board, f"Description {num}", desc, x, 812, 500, 15, MUTED, line=23),
                rect(board, f"Meta rule 1 {num}", x, 884, 608, 1, LINE),
                text(board, f"Role label {num}", "Role", x, 906, 120, 12, DIM),
                text(board, f"Role value {num}", role.replace("ROLE  ", ""), x + 136, 906, 360, 12, TEXT),
                rect(board, f"Meta rule 2 {num}", x, 940, 608, 1, LINE),
                text(board, f"Year label {num}", "Year", x, 962, 120, 12, DIM),
                text(board, f"Year value {num}", year.replace("YEAR  ", ""), x + 136, 962, 360, 12, TEXT),
                rect(board, f"Meta rule 3 {num}", x, 996, 608, 1, LINE),
                rect(board, f"Button {num}", x, 1034, 146, 42, "#292524", None, 8),
                text(board, f"Button text {num}", "View project", x + 42, 1048, 100, 12, TEXT, "Inter", "Medium"),
            ]
            for cell in range(9):
                steps.append(rect(board, f"Pixel {num}-{cell}", x + 14 + (cell % 3) * 7, 1048 + (cell // 3) * 7, 4, 4, RED, None, 1, 0.35 + (cell % 3) * 0.15))
            if asset:
                steps.append(image(ref(media), f"Project image {num}", asset, 0, 0, 608, 380))
            else:
                steps += [
                    ellipse(ref(media), "Veilpay orbit outer", 134, -64, 420, 420, None, RED, 1.4, 0.48),
                    ellipse(ref(media), "Veilpay orbit inner", 214, 16, 260, 260, None, RED, 1.2, 0.68),
                    vector(ref(media), "Veilpay signal", "M0 250 C120 40 240 360 360 110 S540 150 608 50", 0, 30, 608, 320, RED, 2.0, 0.82),
                    text(ref(media), "Veilpay media label", "PRIVATE / MULTI-CHAIN / PAYMENTS", 28, 330, 320, 10, TEXT, "Inter", "Medium", spacing=1.2),
                ]
        steps += [
            text(board, "Implementation note", "Implementation: sticky editorial heading, media-first cards, structured metadata rows, red pixel-grid CTA.", 96, 1090, 800, 13, DIM, line=20),
        ]
        mcp.call("batch", {"label": "Works reference pass", "commands": steps})
        exports = save_and_export(mcp, {"works-reference": board})
        print(json.dumps({"ok": True, "board": board, "exports": exports}, indent=2))
    finally:
        mcp.close()


if __name__ == "__main__":
    main()
