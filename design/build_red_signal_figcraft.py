import json
import queue
import subprocess
import threading
import time
from pathlib import Path

ROOT = Path(r"D:\Portfolio-Site-main\Portfolio-Site-main")
OUT = ROOT / "design" / "codered-red-signal.figcraft"
EXPORTS = ROOT / "design" / "exports"
CLI = r"X:\craft\FigCraft\figcraft-cli.exe"

BG = "#0C0A09"
SURFACE = "#171513"
TEXT = "#F5F2ED"
MUTED = "#A6A09B"
DIM = "#6F6963"
LINE = "#292524"
RED = "#E5484D"
RED_DARK = "#7F1D1D"
GREEN = "#67C792"


class MCP:
    def __init__(self):
        self.proc = subprocess.Popen(
            [CLI, "mcp", "--attach", "7979", "--timeout", "60"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
        )
        self.messages = queue.Queue()
        self.next_id = 0
        threading.Thread(target=self._reader, daemon=True).start()
        self.send({
            "jsonrpc": "2.0",
            "id": self._id(),
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-06-18",
                "capabilities": {},
                "clientInfo": {"name": "codered-design-builder", "version": "1.0.0"},
            },
        })
        self.wait(1)
        self.send({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}})

    def _id(self):
        self.next_id += 1
        return self.next_id

    def _reader(self):
        for line in self.proc.stdout:
            try:
                self.messages.put(json.loads(line))
            except json.JSONDecodeError:
                pass

    def send(self, payload):
        self.proc.stdin.write(json.dumps(payload, separators=(",", ":")) + "\n")
        self.proc.stdin.flush()

    def wait(self, request_id, timeout=60):
        deadline = time.time() + timeout
        while time.time() < deadline:
            message = self.messages.get(timeout=max(0.1, deadline - time.time()))
            if message.get("id") == request_id:
                if "error" in message:
                    raise RuntimeError(json.dumps(message["error"], indent=2))
                return message
        raise TimeoutError(f"MCP response {request_id} timed out")

    def call(self, tool, arguments=None):
        request_id = self._id()
        self.send({
            "jsonrpc": "2.0",
            "id": request_id,
            "method": "tools/call",
            "params": {"name": tool, "arguments": arguments or {}},
        })
        response = self.wait(request_id)
        result = response.get("result", {})
        if result.get("isError"):
            raise RuntimeError(json.dumps(result, indent=2))
        text = result.get("content", [{}])[0].get("text", "{}")
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"text": text}

    def close(self):
        self.proc.terminate()
        try:
            self.proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            self.proc.kill()


def frame(parent, name, x, y, width, height, fill=BG, stroke=None, radius=0):
    props = {"fill": fill, "cornerRadius": radius, "clip": True}
    if stroke:
        props.update({"stroke": stroke, "strokeWeight": 1})
    return {"command": "node.create", "as": name, "params": {
        "type": "frame", "parent": parent, "name": name, "x": x, "y": y,
        "width": width, "height": height, "props": props, "select": False,
    }}


def text(parent, name, value, x, y, width, size, color=TEXT, family="Inter", style="Regular", line=None, spacing=0, align="left"):
    props = {
        "fontFamily": family,
        "fontStyle": style,
        "fontSize": size,
        "fill": color,
        "letterSpacing": spacing,
        "textAlign": align,
        "textAutoResize": "height",
        "wrapStyle": "pretty",
    }
    if line:
        props["lineHeight"] = line
    return {"command": "node.create", "params": {
        "type": "text", "parent": parent, "name": name, "text": value,
        "x": x, "y": y, "width": width, "props": props, "select": False,
    }}


def rect(parent, name, x, y, width, height, fill, stroke=None, radius=0, opacity=None):
    props = {"fill": fill, "cornerRadius": radius}
    if stroke:
        props.update({"stroke": stroke, "strokeWeight": 1})
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "node.create", "params": {
        "type": "rectangle", "parent": parent, "name": name, "x": x, "y": y,
        "width": width, "height": height, "props": props, "select": False,
    }}


def ellipse(parent, name, x, y, width, height, fill=None, stroke=None, weight=1, opacity=None):
    props = {"fill": fill}
    if stroke:
        props.update({"stroke": stroke, "strokeWeight": weight})
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "node.create", "params": {
        "type": "ellipse", "parent": parent, "name": name, "x": x, "y": y,
        "width": width, "height": height, "props": props, "select": False,
    }}


def vector(parent, name, path, x, y, width, height, color=RED, weight=2, opacity=None):
    props = {"fill": None, "stroke": color, "strokeWeight": weight, "strokeCap": "round"}
    if opacity is not None:
        props["opacity"] = opacity
    return {"command": "node.create", "params": {
        "type": "vector", "parent": parent, "name": name, "path": path,
        "x": x, "y": y, "width": width, "height": height, "props": props, "select": False,
    }}


def ref(name):
    return {"$ref": name}


def main():
    EXPORTS.mkdir(parents=True, exist_ok=True)
    mcp = MCP()
    try:
        boards = {}
        for key, name, x, y, width, height in [
            ("tokens", "00 / Design Tokens", 0, 0, 360, 900),
            ("desktop", "01 / Desktop — Editorial Signal", 420, 0, 1440, 1240),
            ("mobile", "02 / Mobile — Editorial Signal", 1920, 0, 390, 844),
            ("motion", "03 / Motion Notes", 2370, 0, 420, 844),
        ]:
            result = mcp.call("create_node", {
                "type": "frame", "name": name, "x": x, "y": y,
                "width": width, "height": height,
                "props": {"fill": BG, "stroke": LINE, "strokeWeight": 1, "clip": True},
                "select": False,
            })
            boards[key] = result["id"]

        t = boards["tokens"]
        token_steps = [
            text(t, "Board label", "RED SIGNAL / TOKENS", 28, 28, 300, 12, RED, "Inter", "Medium", spacing=1.8),
            text(t, "Title", "Design system", 28, 64, 280, 34, TEXT, line=40, spacing=-0.8),
            text(t, "Note", "FigCraft uses Inter as the local stand-in. Production uses Geist + Geist Mono.", 28, 108, 280, 13, MUTED, line=19),
            text(t, "Color heading", "COLOR", 28, 166, 200, 11, DIM, "Inter", "Medium", spacing=1.4),
        ]
        swatches = [
            ("Background", BG), ("Surface", SURFACE), ("Text", TEXT),
            ("Muted", MUTED), ("Hairline", LINE), ("Accent", RED), ("Success", GREEN),
        ]
        for i, (name, color) in enumerate(swatches):
            y = 198 + i * 58
            token_steps += [
                rect(t, f"Swatch {name}", 28, y, 46, 46, color, LINE, 10),
                text(t, f"Swatch name {name}", name, 88, y + 2, 180, 14, TEXT),
                text(t, f"Swatch hex {name}", color, 88, y + 24, 180, 11, DIM, "Inter", "Regular", spacing=0.4),
            ]
        token_steps += [
            text(t, "Type heading", "TYPE", 28, 626, 200, 11, DIM, "Inter", "Medium", spacing=1.4),
            text(t, "Display sample", "Aa 64 / tight editorial", 28, 656, 290, 28, TEXT, line=34, spacing=-0.7),
            text(t, "Body sample", "Clear product engineering copy, 16/26.", 28, 704, 290, 15, MUTED, line=23),
            text(t, "Mono sample", "01  VEILPAY  /  2026", 28, 746, 290, 12, RED, "Inter", "Medium", spacing=1.2),
            text(t, "Spacing note", "8px base grid. Sections breathe at 120–180px desktop.", 28, 790, 280, 13, DIM, line=19),
        ]
        mcp.call("batch", {"label": "Design token board", "commands": token_steps})

        d = boards["desktop"]
        desktop_steps = [
            text(d, "Brand", "codeRED", 64, 34, 160, 18, TEXT, "Inter", "Medium", spacing=-0.3),
            text(d, "Nav index", "Index", 548, 36, 80, 13, MUTED),
            text(d, "Nav work", "Works", 628, 36, 80, 13, MUTED),
            text(d, "Nav resume", "Resume", 716, 36, 90, 13, MUTED),
            text(d, "Nav contact", "Get in touch", 1210, 36, 140, 13, TEXT, align="right"),
            rect(d, "Nav red dot", 1168, 42, 6, 6, RED, None, 3),
            text(d, "Eyebrow", "VINAYAK VASHISTH  /  WEB3 × FULL-STACK", 96, 158, 520, 12, RED, "Inter", "Medium", spacing=1.7),
            text(d, "Hero heading", "Building secure,\nexpressive products\nfor the decentralized web.", 96, 216, 820, 74, TEXT, line=80, spacing=-2.2),
            text(d, "Hero body", "I design and build fast, resilient interfaces where complex blockchain systems feel clear, useful, and finished.", 96, 500, 520, 18, MUTED, line=29),
            rect(d, "Primary CTA", 96, 590, 148, 46, TEXT, None, 23),
            text(d, "Primary CTA text", "View work", 124, 604, 96, 14, BG, "Inter", "Medium"),
            rect(d, "Secondary CTA", 258, 590, 150, 46, "none", LINE, 23),
            text(d, "Secondary CTA text", "Book a call", 286, 604, 100, 14, TEXT, "Inter", "Medium"),
            rect(d, "NPX chip", 96, 660, 182, 34, SURFACE, LINE, 17),
            text(d, "NPX text", "$ npx coderedxbt", 114, 670, 150, 12, MUTED, "Inter", "Medium", spacing=0.2),
            text(d, "Role label", "ROLE", 1060, 166, 160, 10, DIM, "Inter", "Medium", spacing=1.5),
            text(d, "Role value", "Designer & Developer", 1060, 188, 260, 16, TEXT),
            text(d, "Based label", "BASED", 1060, 232, 260, 10, DIM, "Inter", "Medium", spacing=1.5),
            text(d, "Based value", "India / Remote", 1060, 254, 260, 16, TEXT),
            text(d, "Status label", "STATUS", 1060, 300, 260, 10, DIM, "Inter", "Medium", spacing=1.5),
            ellipse(d, "Status dot", 1060, 325, 8, 8, GREEN),
            text(d, "Status value", "Available for select work", 1078, 318, 260, 16, TEXT),
            ellipse(d, "Signal outer", 850, 360, 360, 360, None, RED, 1.2, 0.32),
            ellipse(d, "Signal middle", 900, 410, 260, 260, None, RED, 1.2, 0.45),
            ellipse(d, "Signal core", 966, 476, 128, 128, RED, None, 64, 0.16),
            vector(d, "Signal path", "M0 170 C95 40 180 250 285 90 S475 130 560 34", 820, 420, 560, 280, RED, 2.2, 0.72),
            rect(d, "Hero rule", 96, 748, 1248, 1, LINE),
            text(d, "Intro number", "[ 01 ]", 96, 790, 70, 11, RED, "Inter", "Medium", spacing=1.2),
            text(d, "Intro title", "Intro", 96, 820, 180, 18, TEXT, "Inter", "Medium"),
            text(d, "Intro copy", "Full-stack engineer with a design eye, focused on Web3 products that feel usable from day one.", 96, 856, 300, 14, MUTED, line=22),
            text(d, "Approach number", "[ 02 ]", 500, 790, 70, 11, RED, "Inter", "Medium", spacing=1.2),
            text(d, "Approach title", "Approach", 500, 820, 180, 18, TEXT, "Inter", "Medium"),
            text(d, "Approach copy", "Clarity, security, performance, and interface polish are treated as one system — not separate phases.", 500, 856, 300, 14, MUTED, line=22),
            text(d, "Now number", "[ 03 ]", 904, 790, 70, 11, RED, "Inter", "Medium", spacing=1.2),
            text(d, "Now title", "Now", 904, 820, 180, 18, TEXT, "Inter", "Medium"),
            text(d, "Now copy", "Currently building Veilpay and exploring practical multi-chain payment experiences.", 904, 856, 300, 14, MUTED, line=22),
        ]
        mcp.call("batch", {"label": "Desktop editorial hero", "commands": desktop_steps})

        project_steps = [
            text(d, "Work label", "FEATURED WORK", 96, 1000, 240, 11, DIM, "Inter", "Medium", spacing=1.5),
            text(d, "Project number", "01", 96, 1048, 60, 13, DIM, "Inter", "Medium"),
            text(d, "Project title", "Veilpay", 164, 1038, 300, 34, TEXT, line=38, spacing=-0.8),
            text(d, "Project description", "Multi-chain wallet infrastructure with protocol-specific address isolation and fiat on/off-ramp flows.", 164, 1088, 420, 15, MUTED, line=23),
            text(d, "Project metadata", "ROLE  DESIGN + BUILD   /   YEAR  2026", 164, 1148, 420, 10, DIM, "Inter", "Medium", spacing=1.0),
            rect(d, "Project media", 760, 1000, 500, 170, SURFACE, LINE, 18),
            rect(d, "Project media glow", 800, 1028, 420, 94, RED, None, 16, 0.12),
            text(d, "Project media label", "PRODUCT / WALLET / PAYMENTS", 800, 1110, 300, 11, RED, "Inter", "Medium", spacing=1.2),
        ]
        mcp.call("batch", {"label": "Featured project preview", "commands": project_steps})

        m = boards["mobile"]
        mobile_steps = [
            text(m, "Mobile brand", "codeRED", 24, 24, 120, 16, TEXT, "Inter", "Medium"),
            text(m, "Mobile menu", "Menu", 302, 25, 64, 13, TEXT, align="right"),
            rect(m, "Mobile status", 24, 76, 116, 26, RED, None, 13, 0.13),
            text(m, "Mobile status text", "AVAILABLE", 40, 83, 90, 10, RED, "Inter", "Medium", spacing=1.2),
            text(m, "Mobile heading", "Building secure,\nexpressive products\nfor Web3.", 24, 130, 330, 42, TEXT, line=46, spacing=-1.3),
            text(m, "Mobile body", "Full-stack engineer crafting fast, clear interfaces for complex decentralized systems.", 24, 296, 310, 16, MUTED, line=25),
            ellipse(m, "Mobile signal outer", 222, 178, 128, 128, None, RED, 1, 0.35),
            ellipse(m, "Mobile signal core", 258, 214, 56, 56, RED, None, 28, 0.18),
            rect(m, "Mobile primary", 24, 380, 342, 48, TEXT, None, 24),
            text(m, "Mobile primary text", "View work", 147, 396, 100, 14, BG, "Inter", "Medium"),
            rect(m, "Mobile secondary", 24, 440, 342, 48, "none", LINE, 24),
            text(m, "Mobile secondary text", "Book a call", 145, 456, 100, 14, TEXT, "Inter", "Medium"),
            rect(m, "Mobile NPX", 24, 510, 342, 38, SURFACE, LINE, 19),
            text(m, "Mobile NPX text", "$ npx coderedxbt", 126, 522, 150, 12, MUTED, "Inter", "Medium"),
            rect(m, "Mobile rule", 24, 590, 342, 1, LINE),
            text(m, "Mobile work", "FEATURED WORK", 24, 622, 180, 10, DIM, "Inter", "Medium", spacing=1.4),
            text(m, "Mobile project", "01  Veilpay", 24, 654, 220, 24, TEXT, "Inter", "Medium"),
            text(m, "Mobile project copy", "Multi-chain wallet infrastructure and payment flows.", 24, 690, 300, 14, MUTED, line=21),
        ]
        mcp.call("batch", {"label": "Mobile editorial hero", "commands": mobile_steps})

        n = boards["motion"]
        notes = [
            ("01", "Load", "Nav fades in; heading lines reveal through masks; signal settles over 700ms."),
            ("02", "Scroll", "Lenis-style inertia on capable devices. Native scroll remains for reduced motion."),
            ("03", "Projects", "Media mask opens first; title, metadata, and links follow with short staggers."),
            ("04", "3D", "One ambient red-signal object. Pointer drift only; disabled for reduced motion/mobile constraints."),
            ("05", "Hover", "Transform + opacity only. Red signal line expands; no layout-shifting effects."),
            ("06", "Fallback", "Static composition remains complete if WebGL, motion, or APIs fail."),
        ]
        motion_steps = [
            text(n, "Motion label", "MOTION / IMPLEMENTATION", 28, 28, 300, 12, RED, "Inter", "Medium", spacing=1.6),
            text(n, "Motion title", "Choreography notes", 28, 64, 330, 32, TEXT, line=38, spacing=-0.7),
        ]
        for i, (num, title, body) in enumerate(notes):
            y = 136 + i * 108
            motion_steps += [
                text(n, f"Note {num}", num, 28, y, 40, 11, RED, "Inter", "Medium", spacing=1.2),
                text(n, f"Note title {num}", title, 82, y - 4, 220, 16, TEXT, "Inter", "Medium"),
                text(n, f"Note body {num}", body, 82, y + 22, 290, 13, MUTED, line=19),
            ]
        mcp.call("batch", {"label": "Motion notes", "commands": motion_steps})

        saved_path = str(OUT).replace("\\", "/")
        mcp.call("save_file", {"path": saved_path})
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

        print(json.dumps({
            "ok": True,
            "file": saved_path,
            "boards": boards,
            "exports": exports,
        }, indent=2))
    finally:
        mcp.close()


if __name__ == "__main__":
    main()
