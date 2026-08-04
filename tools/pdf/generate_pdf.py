import uuid
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable

W, H = A4

BG        = colors.HexColor("#0D0D0D")
CREAM     = colors.HexColor("#F0EDE6")
LIGHT_TXT = colors.HexColor("#8A8A9A")
MID_GRAY  = colors.HexColor("#1E1E2A")
DARK_CARD = colors.HexColor("#161622")
BORDER_C  = colors.HexColor("#2A2A3A")

DAY_COLORS = {
    0: colors.HexColor("#E8C547"),
    1: colors.HexColor("#FF4B4B"),
    2: colors.HexColor("#E8C547"),
    3: colors.HexColor("#4A9EBF"),
    4: colors.HexColor("#9B59B6"),
    5: colors.HexColor("#1ABC9C"),
    6: colors.HexColor("#2ECC71"),
    7: colors.HexColor("#F39C12"),
}

def get_id():
    return uuid.uuid4().hex[:8]


class ProgressBar(Flowable):
    def __init__(self, day, total=7, accent=None):
        super().__init__()
        self.day = day
        self.total = total
        self.accent = accent or DAY_COLORS.get(day, DAY_COLORS[0])
        self.width = W - 80
        self.height = 18

    def draw(self):
        c = self.canv
        c.saveState()
        bar_w = self.width
        filled = bar_w * (self.day / self.total) if self.day > 0 else 0
        c.setFillColor(MID_GRAY)
        c.roundRect(0, 6, bar_w, 5, 2, fill=1, stroke=0)
        if filled > 0:
            c.setFillColor(self.accent)
            c.roundRect(0, 6, filled, 5, 2, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(self.accent)
        label = f"Step {self.day} of {self.total}" if self.day > 0 else "Let's Begin"
        c.drawRightString(bar_w, 0, label)
        c.restoreState()


class AccentLine(Flowable):
    def __init__(self, color, width=None, thickness=2):
        super().__init__()
        self.line_color = color
        self.line_width = width or (W - 80)
        self.thickness = thickness
        self.width = self.line_width
        self.height = self.thickness + 4

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.line_color)
        c.setLineWidth(self.thickness)
        c.line(0, 2, self.line_width, 2)
        c.restoreState()


class ClickBox(Flowable):
    def __init__(self, label, accent, size=12, small=False):
        super().__init__()
        self.label = label
        self.accent = accent
        self.size = size
        self.small = small
        self.width = W - 80
        self.height = size + 12

    def draw(self):
        c = self.canv
        c.saveState()
        s = self.size
        
        # Draw Label
        fs = 8.5 if self.small else 9.5
        c.setFont("Helvetica", fs)
        c.setFillColor(CREAM)
        c.drawString(s + 10, 5, self.label)

        # Interactive AcroForm Checkbox
        form = c.acroForm
        abs_x, abs_y = c.absolutePosition(0, 3)
        form.checkbox(name=f'cb_{id(self)}', tooltip=self.label,
                      x=abs_x, y=abs_y, size=s, buttonStyle='check',
                      borderColor=self.accent, fillColor=MID_GRAY,
                      textColor=CREAM, forceBorder=True)
        c.restoreState()


class FillLine(Flowable):
    def __init__(self, label="", accent=None, lines=1, width=None):
        super().__init__()
        self.label = label
        self.accent = accent or DAY_COLORS[0]
        self.lines = lines
        self.line_width = width or (W - 80)
        self.width = self.line_width
        self.height = (16 if label else 0) + lines * 20 + 4

    def draw(self):
        c = self.canv
        c.saveState()
        y = self.height - 4
        if self.label:
            c.setFont("Helvetica-Bold", 8)
            c.setFillColor(self.accent)
            c.drawString(0, y - 10, self.label)
            y -= 18

        # Interactive AcroForm TextField
        form = c.acroForm
        field_height = self.lines * 20
        abs_x, abs_y = c.absolutePosition(0, y - field_height + 8)
        form.textfield(name=f'tf_{id(self)}', tooltip=self.label,
                       x=abs_x, y=abs_y, width=self.line_width, height=field_height,
                       borderColor=colors.HexColor("#2A2A3A"), fillColor=colors.transparent,
                       textColor=CREAM, fontName='Helvetica', fontSize=10)
        c.restoreState()


class BoltTracker(Flowable):
    def __init__(self, accent):
        super().__init__()
        self.accent = accent
        self.width = W - 80
        self.height = 52

    def draw(self):
        c = self.canv
        c.saveState()
        labels = ["MORNING", "AFTERNOON", "EVENING"]
        box_w = (self.width - 16) / 3
        for i, lbl in enumerate(labels):
            x = i * (box_w + 8)
            c.setFillColor(MID_GRAY)
            c.roundRect(x, 0, box_w, 50, 5, fill=1, stroke=0)
            c.setFont("Helvetica-Bold", 7)
            c.setFillColor(self.accent)
            c.drawCentredString(x + box_w / 2, 36, lbl)
            
            # Interactive text field restricted visually and by tooltip
            abs_x, abs_y = c.absolutePosition(x + box_w / 2 - 15, 12)
            c.acroForm.textfield(
                name=f"urges_{get_id()}", tooltip="Number of Urges",
                x=abs_x, y=abs_y, width=30, height=20,
                textColor=CREAM, fillColor=BG, borderColor=self.accent,
                borderStyle='solid', forceBorder=True,
                fontName="Helvetica", fontSize=12
            )

            c.setFont("Helvetica", 8)
            c.setFillColor(LIGHT_TXT)
            c.drawCentredString(x + box_w / 2, 3, "mark your urges")
        c.restoreState()


class LevelSelector(Flowable):
    def __init__(self, accent):
        super().__init__()
        self.accent = accent
        self.width = W - 80
        self.height = 60

    def draw(self):
        c = self.canv
        c.saveState()
        levels = [("SPRINTER", "20 min", "Easy"), ("RUNNER", "40 min", "Medium"), ("MONK", "60 min", "Hard")]
        bw = (self.width - 16) / 3
        lvl_grp = "level_selection_day3"
        for i, (name, time, diff) in enumerate(levels):
            x = i * (bw + 8)
            c.setFillColor(MID_GRAY)
            c.roundRect(x, 0, bw, self.height, 6, fill=1, stroke=0)
            
            # Radio Buttons
            abs_x, abs_y = c.absolutePosition(x + 8, self.height - 20)
            c.acroForm.radio(
                name=lvl_grp, value=name, tooltip=name,
                x=abs_x, y=abs_y, buttonStyle='check',
                size=11, fillColor=BG, borderColor=self.accent,
                textColor=self.accent, forceBorder=True
            )

            c.setFont("Helvetica-Bold", 8)
            c.setFillColor(self.accent)
            c.drawCentredString(x + bw / 2, self.height - 32, name)
            c.setFont("Helvetica-Bold", 14)
            c.setFillColor(CREAM)
            c.drawCentredString(x + bw / 2, 20, time)
            c.setFont("Helvetica", 8)
            c.setFillColor(LIGHT_TXT)
            c.drawCentredString(x + bw / 2, 6, diff)
        c.restoreState()


class SprintTracker(Flowable):
    def __init__(self, accent):
        super().__init__()
        self.accent = accent
        self.width = W - 80
        self.height = 116

    def draw(self):
        c = self.canv
        c.saveState()
        rh = 26
        for i in range(4):
            y = self.height - (i + 1) * rh - 4
            c.setFillColor(MID_GRAY if i % 2 == 0 else DARK_CARD)
            c.roundRect(0, y, self.width, rh - 2, 3, fill=1, stroke=0)
            
            # Interactive Checkbox
            abs_x, abs_y = c.absolutePosition(8, y + 7)
            c.acroForm.checkbox(
                name=f"sprintchk_{get_id()}", tooltip="Completed",
                x=abs_x, y=abs_y, buttonStyle='check',
                size=11, fillColor=BG, borderColor=self.accent,
                textColor=self.accent, forceBorder=True, borderStyle='solid'
            )

            c.setFont("Helvetica-Bold", 9)
            c.setFillColor(CREAM)
            c.drawString(28, y + 9, f"Sprint {i+1}  —  25 min focus + 5 min break")
            c.setFont("Helvetica", 8)
            c.setFillColor(LIGHT_TXT)
            c.drawRightString(self.width - 55, y + 9, "Score:")
            
            # Interactive Score limited to numbers conceptually
            abs_xc, abs_yc = c.absolutePosition(self.width - 50, y + 4)
            c.acroForm.textfield(
                name=f"sprintscore_{get_id()}", tooltip="Number only / 10",
                x=abs_xc, y=abs_yc, width=40, height=15,
                textColor=CREAM, fillColor=BG, borderColor=self.accent,
                borderStyle='solid', forceBorder=True,
                fontName="Helvetica", fontSize=9
            )

        c.restoreState()


class ParkingLot(Flowable):
    def __init__(self, accent, lines=3):
        super().__init__()
        self.accent = accent
        self.lines = lines
        self.width = W - 80
        self.height = 18 + lines * 22

    def draw(self):
        c = self.canv
        c.saveState()
        c.setStrokeColor(self.accent)
        c.setLineWidth(1.2)
        c.setDash(4, 3)
        c.roundRect(0, 0, self.width, self.height, 5, fill=0, stroke=1)
        c.setDash()
        c.setFont("Helvetica-Bold", 7.5)
        c.setFillColor(self.accent)
        c.drawString(10, self.height - 14, "P  PARKING LOT — stray thoughts go here, keep moving")
        for i in range(self.lines):
            y = self.height - 28 - i * 22
            c.setFont("Helvetica", 9)
            c.setFillColor(LIGHT_TXT)
            c.drawString(10, y + 4, f"{i+1}.")

            # Interactive field with styled boxes instead of dashed line
            abs_x, abs_y = c.absolutePosition(24, y)
            c.acroForm.textfield(
                name=f"park_{get_id()}", tooltip="Stray thought",
                x=abs_x, y=abs_y, width=self.width - 34, height=16,
                textColor=CREAM, fillColor=DARK_CARD, borderColor=BORDER_C,
                borderStyle='solid', forceBorder=True,
                fontName="Helvetica", fontSize=9
            )

        c.restoreState()


class RecoveryMissions(Flowable):
    def __init__(self, missions, accent):
        super().__init__()
        self.missions = missions
        self.accent = accent
        self.width = W - 80
        self.height = len(missions) * 38 + 8

    def draw(self):
        c = self.canv
        c.saveState()
        for i, (title, desc) in enumerate(self.missions):
            y = self.height - (i + 1) * 38
            c.setFillColor(MID_GRAY)
            c.roundRect(0, y, self.width, 34, 4, fill=1, stroke=0)
            c.setFillColor(self.accent)
            c.roundRect(0, y, 4, 34, 2, fill=1, stroke=0)
            
            # Interactive Checkbox
            abs_x, abs_y = c.absolutePosition(14, y + 11)
            c.acroForm.checkbox(
                name=f"misschk_{get_id()}", tooltip="Complete mission",
                x=abs_x, y=abs_y, buttonStyle='check',
                size=12, fillColor=BG, borderColor=self.accent,
                textColor=self.accent, forceBorder=True, borderStyle='solid'
            )

            c.setFont("Helvetica-Bold", 8)
            c.setFillColor(self.accent)
            c.drawString(36, y + 21, f"MISSION {i+1}: {title}")
            c.setFont("Helvetica", 8.5)
            c.setFillColor(CREAM)
            txt = desc[:80] + ("..." if len(desc) > 80 else "")
            c.drawString(36, y + 8, txt)
        c.restoreState()


class CertBanner(Flowable):
    def __init__(self):
        super().__init__()
        self.width = W - 80
        self.height = 96

    def draw(self):
        c = self.canv
        gold = DAY_COLORS[7]
        c.saveState()
        c.setStrokeColor(gold)
        c.setLineWidth(2)
        c.roundRect(0, 0, self.width, self.height, 8, fill=0, stroke=1)
        c.setStrokeColor(colors.HexColor("#2E2E3A"))
        c.setLineWidth(0.5)
        c.roundRect(5, 5, self.width - 10, self.height - 10, 6, fill=0, stroke=1)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(gold)
        c.drawCentredString(self.width / 2, self.height - 18, "CERTIFICATE OF COMPLETION")
        c.setFont("Helvetica-Bold", 17)
        c.setFillColor(CREAM)
        c.drawCentredString(self.width / 2, self.height - 40, "THE 7-DAY ATTENTION RESET")
        c.setFont("Helvetica", 9)
        c.setFillColor(LIGHT_TXT)
        c.drawCentredString(self.width / 2, self.height - 54, "This certifies that")
        
        # Interactive Textfield for Name
        abs_x, abs_y = c.absolutePosition(self.width * 0.2, self.height - 76)
        c.acroForm.textfield(
            name=f"cert_name_{get_id()}", tooltip="Your Name",
            x=abs_x, y=abs_y, width=self.width * 0.6, height=18,
            textColor=gold, fillColor=BG, borderColor=gold,
            borderStyle='solid', forceBorder=True,
            fontName="Helvetica", fontSize=12
        )

        c.setFont("Helvetica-Oblique", 8.5)
        c.setFillColor(LIGHT_TXT)
        c.drawCentredString(self.width / 2, self.height - 86, "has completed all 7 days of the protocol")
        c.restoreState()


def S(name, **kw):
    return ParagraphStyle(name, **kw)


def sp(n=6):
    return Spacer(1, n)


def make_card(items, bg=None, lp=12, rp=12, tp=10, bp=10):
    bg = bg or DARK_CARD
    tbl = Table([[items]], colWidths=[W - 80])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), bg),
        ("ROUNDEDCORNERS",[6]),
        ("TOPPADDING",    (0, 0), (-1, -1), tp),
        ("BOTTOMPADDING", (0, 0), (-1, -1), bp),
        ("LEFTPADDING",   (0, 0), (-1, -1), lp),
        ("RIGHTPADDING",  (0, 0), (-1, -1), rp),
    ]))
    return tbl


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(LIGHT_TXT)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawCentredString(W / 2, 14, "The 7-Day Attention Reset  @favazmk")
    canvas.restoreState()


# ── PAGES ────────────────────────────────────────────────────────────────────

def cover():
    ACC = DAY_COLORS[0]
    els = [sp(48)]
    els.append(Paragraph("THE 7-DAY", S("a", fontName="Helvetica-Bold", fontSize=44,
        leading=50, textColor=CREAM, alignment=TA_CENTER)))
    els.append(Paragraph("ATTENTION", S("b", fontName="Helvetica-Bold", fontSize=68,
        leading=74, textColor=ACC, alignment=TA_CENTER)))
    els.append(Paragraph("RESET", S("c", fontName="Helvetica-Bold", fontSize=44,
        leading=50, textColor=CREAM, alignment=TA_CENTER)))
    els.append(sp(14))
    els.append(AccentLine(color=ACC, thickness=1))
    els.append(sp(12))
    els.append(Paragraph("Reclaim your focus in a world designed to steal it.",
        S("d", fontName="Helvetica", fontSize=13, leading=19, textColor=ACC, alignment=TA_CENTER)))
    els.append(sp(6))
    els.append(Paragraph("A 7-day science-backed workbook",
        S("e", fontName="Helvetica-Oblique", fontSize=10, textColor=LIGHT_TXT, alignment=TA_CENTER)))
    els.append(sp(52))
    badge = Table([["7 DAYS", "7 EXERCISES", "7 REFLECTIONS"]], colWidths=[(W-80)/3]*3)
    badge.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), DARK_CARD),
        ("TEXTCOLOR",     (0,0), (-1,-1), ACC),
        ("FONTNAME",      (0,0), (-1,-1), "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,-1), 9),
        ("ALIGN",         (0,0), (-1,-1), "CENTER"),
        ("TOPPADDING",    (0,0), (-1,-1), 12),
        ("BOTTOMPADDING", (0,0), (-1,-1), 12),
        ("GRID",          (0,0), (-1,-1), 0.4, BORDER_C),
    ]))
    els.append(badge)
    els.append(sp(14))
    els.append(ProgressBar(0, 7, ACC))
    els.append(PageBreak())
    return els


def intro_toc():
    ACC = DAY_COLORS[0]
    els = [sp(10)]
    els.append(Paragraph("BEFORE YOU START", S("sl", fontName="Helvetica-Bold",
        fontSize=8, textColor=ACC, letterSpacing=1.5, spaceAfter=3)))
    els.append(Paragraph("Read this. It takes 60 seconds.",
        S("h2", fontName="Helvetica-Bold", fontSize=18, leading=24, textColor=CREAM, spaceAfter=6)))
    els.append(AccentLine(color=ACC))
    els.append(sp(8))
    els.append(Paragraph(
        "Your attention is the most valuable thing you own. Every app, every notification, "
        "every infinite scroll is competing for it 24/7. "
        "This 7-day protocol helps you take it back. One day. One win. At a time.",
        S("bd", fontName="Helvetica", fontSize=10, leading=17, textColor=CREAM, spaceAfter=8)))
    els.append(sp(4))
    how_items = [
        Paragraph("HOW TO USE THIS", S("cl", fontName="Helvetica-Bold", fontSize=8,
            textColor=ACC, spaceAfter=6)),
        ClickBox("Work through one day at a time. Don't skip ahead.", ACC),
        sp(3),
        ClickBox("Keep your phone in another room during exercises.", ACC),
        sp(3),
        ClickBox("Fill in every blank — writing rewires faster than reading.", ACC),
        sp(3),
        ClickBox("Finished a day? Celebrate. Then show up tomorrow.", ACC),
    ]
    els.append(make_card(how_items))
    els.append(sp(12))
    els.append(Paragraph("YOUR 7-DAY JOURNEY", S("sl2", fontName="Helvetica-Bold",
        fontSize=8, textColor=ACC, letterSpacing=1.5, spaceAfter=6)))
    days_info = [
        (1, "The Digital Kill-Switch", "Stop the pings. Start the progress.", "FF4B4B"),
        (2, "The Snap Audit",          "Find your attention leaks in 5 minutes.", "E8C547"),
        (3, "The Monk Sprint",         "One task. Zero noise. 100% impact.", "4A9EBF"),
        (4, "The Focus Sprints",       "Level up your mental endurance.", "9B59B6"),
        (5, "The Fortress",            "Design a space where focus is the only option.", "1ABC9C"),
        (6, "The Dopamine Reset",      "Recover your edge through strategic boredom.", "2ECC71"),
        (7, "The Attention OS",        "Build a system that works so you don't have to.", "F39C12"),
    ]
    for d, title, desc, hex_c in days_info:
        col = colors.HexColor(f"#{hex_c}")
        row = Table([[
            Paragraph(f"DAY {d:02d}", S(f"td{d}", fontName="Helvetica-Bold",
                fontSize=9, textColor=col)),
            [Paragraph(title, S(f"tt{d}", fontName="Helvetica-Bold",
                fontSize=10, leading=14, textColor=CREAM)),
             Paragraph(desc, S(f"td2{d}", fontName="Helvetica",
                fontSize=8.5, leading=13, textColor=LIGHT_TXT))],
        ]], colWidths=[52, W - 80 - 52])
        row.setStyle(TableStyle([
            ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
            ("TOPPADDING",    (0,0), (-1,-1), 7),
            ("BOTTOMPADDING", (0,0), (-1,-1), 7),
            ("LEFTPADDING",   (0,0), (-1,-1), 0),
            ("RIGHTPADDING",  (0,0), (-1,-1), 0),
            ("LINEBELOW",     (0,0), (-1,-1), 0.4, BORDER_C),
        ]))
        els.append(row)
    els.append(sp(10))
    els.append(ProgressBar(0, 7, ACC))
    els.append(PageBreak())
    return els


def day_header_els(day, title, subtitle, ACC):
    els = [sp(8)]
    els.append(Paragraph(f"DAY {day:02d}", S(f"dn{day}", fontName="Helvetica-Bold",
        fontSize=10, textColor=ACC, spaceAfter=2)))
    els.append(Paragraph(title, S(f"dt{day}", fontName="Helvetica-Bold",
        fontSize=28, leading=34, textColor=CREAM, spaceAfter=4)))
    els.append(AccentLine(color=ACC, thickness=3))
    els.append(sp(4))
    els.append(Paragraph(subtitle, S(f"ds{day}", fontName="Helvetica-Oblique",
        fontSize=11, leading=16, textColor=LIGHT_TXT, spaceAfter=10)))
    return els


def sci_card(text, ACC):
    return make_card([
        Paragraph("THE SCIENCE", S("cl", fontName="Helvetica-Bold", fontSize=8,
            textColor=ACC, spaceAfter=4)),
        Paragraph(text, S("ct", fontName="Helvetica", fontSize=9.5, leading=15, textColor=CREAM)),
    ])


def quote_els(text, attr, ACC):
    return [
        Paragraph(f'"{text}"', S("qt", fontName="Helvetica-Oblique", fontSize=10,
            leading=16, textColor=ACC, alignment=TA_CENTER, spaceBefore=6, spaceAfter=2)),
        Paragraph(f"— {attr}", S("qa", fontName="Helvetica", fontSize=8.5,
            textColor=LIGHT_TXT, alignment=TA_CENTER, spaceAfter=8)),
    ]


def lbl(text, ACC):
    return Paragraph(text, S("sl_x", fontName="Helvetica-Bold", fontSize=8,
        textColor=ACC, letterSpacing=1.2, spaceBefore=6, spaceAfter=3))


def body(text):
    return Paragraph(text, S("bd_x", fontName="Helvetica", fontSize=10,
        leading=16, textColor=CREAM, spaceAfter=6))


def card_lbl(text, ACC):
    return Paragraph(text, S("clbl", fontName="Helvetica-Bold", fontSize=8,
        textColor=ACC, spaceAfter=4))


def card_txt(text):
    return Paragraph(text, S("ctxt", fontName="Helvetica", fontSize=9.5,
        leading=15, textColor=CREAM, spaceAfter=2))


# ── DAY 1 ────────────────────────────────────────────────────────────────────
def day1():
    ACC = DAY_COLORS[1]
    els = day_header_els(1, "The Digital Kill-Switch", "Stop the pings. Start the progress.", ACC)
    els.append(sci_card(
        "Every notification triggers a <b>cortisol spike</b> — the same stress hormone "
        "your ancestors got from predators. Over time your brain starts to <b>expect "
        "interruption</b>, making sustained focus feel physically uncomfortable.", ACC))
    els.append(sp(10))
    els.append(lbl("THE 3-MINUTE STEALTH SETUP", ACC))
    els.append(body("Open your phone settings. Do these 3 things right now:"))
    for item in [
        "Silence the Ghosts: Settings > Notifications. Turn OFF everything except Calls and Texts.",
        "Go Greyscale: Accessibility > Display > Colour Filters. Enable greyscale. Removes ~40% of addictiveness.",
        "Delete your #1 time-waster app today. You can reinstall it tomorrow if you really want to.",
    ]:
        els.append(ClickBox(item, ACC))
        els.append(sp(5))
    els.append(sp(8))
    els.append(lbl("THE GHOST-TOUCH CHALLENGE", ACC))
    els.append(body("Every time you reach for your phone and there's nothing to see, mark a tally below. Count your urges before bed."))
    els.append(sp(4))
    els.append(BoltTracker(ACC))
    els.append(sp(10))
    els.append(lbl("REFLECTION", ACC))
    els.append(body("Without the red dots yelling at you today, what was the one thing you actually <i>noticed</i> in the real world?"))
    els.append(FillLine("Your answer:", ACC, lines=2))
    els.append(sp(8))
    els += quote_els("Almost everything will work again if you unplug it for a few minutes. Including you.", "Anne Lamott", ACC)
    els.append(ProgressBar(1, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 2 ────────────────────────────────────────────────────────────────────
def day2():
    ACC = DAY_COLORS[2]
    els = day_header_els(2, "The Snap Audit", "Find your leaks in 5 minutes.", ACC)
    els.append(make_card([
        card_lbl("THE STAT THAT CHANGES EVERYTHING", ACC),
        Paragraph(
            '<font color="#E8C547"><b>Every interruption costs 23 minutes of focus recovery.</b></font> '
            'Most people interrupt themselves every 3 minutes — meaning they never actually reach deep focus at all.',
            S("ct2", fontName="Helvetica", fontSize=10, leading=16, textColor=CREAM)),
    ]))
    els.append(sp(10))
    els.append(lbl("YOUR ATTENTION ASSASSINS", ACC))
    els.append(body("Check everything that stole your time in the last 48 hours:"))
    els.append(sp(4))
    for a in [
        "Instagram / TikTok / Reels scrolling",
        "Email refresh (the infinite F5)",
        'The "quick" news / weather check that turns into 30 minutes',
        "Desktop notification pings",
        'The "I\'ll just look this up" Google rabbit hole',
        "YouTube autoplay",
        "WhatsApp group chats",
        "People interrupting while you work",
    ]:
        els.append(ClickBox(a, ACC))
        els.append(sp(4))
    els.append(sp(8))
    els.append(lbl("THE 60-SECOND POWER MOVE", ACC))
    els.append(make_card([
        card_lbl("THE INSTANT WIN", ACC),
        card_txt("Flip your phone face down and move it to the other side of the room. "
                 "<b>Done? You just improved your focus by ~20%.</b> Research shows even a "
                 "phone face-down on your desk consumes working memory — just by existing in your peripheral vision."),
    ], bg=colors.HexColor("#1A1800")))
    els.append(sp(10))
    els.append(lbl("REFLECTION", ACC))
    els.append(body('"If I reclaimed the 2 hours I lose to __________, I would finally have time to __________."'))
    els.append(FillLine("Complete it here:", ACC, lines=2))
    els.append(sp(8))
    els += quote_els("What you pay attention to is what becomes your life.", "Winifred Gallagher", ACC)
    els.append(ProgressBar(2, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 3 ────────────────────────────────────────────────────────────────────
def day3():
    ACC = DAY_COLORS[3]
    els = day_header_els(3, "The Monk Sprint", "One task. Zero noise. 100% impact.", ACC)
    els.append(sci_card(
        "<b>Multitasking is a lie.</b> Every tab-switch or text-check loses you 40% of "
        "your brainpower to 'Switching Cost.' Today we stop leaking energy and do one thing — "
        "completely — at a time.", ACC))
    els.append(sp(10))
    els.append(lbl("CHOOSE YOUR LEVEL", ACC))
    els.append(body("Pick the one that feels like a stretch — not a wall:"))
    els.append(sp(4))
    els.append(LevelSelector(ACC))
    els.append(sp(10))
    els.append(lbl("CLEAR THE DECK", ACC))
    for item in [
        "Close every browser tab not needed for your task.",
        "Put your phone in a drawer in a different room.",
        "Open your task. Set your timer. Start.",
    ]:
        els.append(ClickBox(item, ACC))
        els.append(sp(4))
    els.append(sp(6))
    els.append(lbl("THE ENTRY RITUAL", ACC))
    els.append(make_card([
        card_lbl("THE FOCUS TRIGGER", ACC),
        card_txt("Put on headphones (even without music) or grab a glass of water. "
                 "This tells your brain: <b>'The Sprint has started.'</b> "
                 "Repeat every session and it becomes automatic."),
    ]))
    els.append(sp(8))
    els.append(lbl("THE PARKING LOT", ACC))
    els.append(body("Stray thought? Don't leave the task. Drop it here and keep going."))
    els.append(sp(4))
    els.append(ParkingLot(ACC, lines=3))
    els.append(sp(10))
    els.append(lbl("REFLECTION", ACC))
    for label in [
        "My one task was:",
        "The hardest moment was:",
        "I feel: (circle one)   Productive  /  Relieved  /  Tired  /  Surprised",
    ]:
        els.append(FillLine(label, ACC, lines=1))
        els.append(sp(4))
    els.append(sp(6))
    els += quote_els("The mind is not a vessel to be filled, but a fire to be kindled.", "Plutarch", ACC)
    els.append(ProgressBar(3, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 4 ────────────────────────────────────────────────────────────────────
def day4():
    ACC = DAY_COLORS[4]
    els = day_header_els(4, "The Focus Sprints", "Level up your mental endurance.", ACC)
    els.append(sci_card(
        "<b>Start small to win big.</b> If you try to lift 100kg on Day 1 at the gym, you quit. "
        "Most people fail at focus because they attempt 2-hour sessions and burn out. "
        "Today: interval training for your brain.", ACC))
    els.append(sp(10))
    els.append(lbl("THE 25/5 GAME — 4 ROUNDS", ACC))
    els.append(body("Complete all 4 sprints. Score your focus after each:"))
    els.append(sp(4))
    els.append(SprintTracker(ACC))
    els.append(sp(6))
    els.append(make_card([
        card_lbl("THE GOLDEN RULE OF BREAKS", ACC),
        card_txt("During your 5-minute break: <b>DO NOT check your phone.</b> Walk, stretch, "
                 "or stare at a wall. Checking your phone extends re-focus time by up to 15 minutes."),
    ], bg=colors.HexColor("#1A0A1A")))
    els.append(sp(10))
    els.append(lbl("THE 20-20-20 EYE RESET", ACC))
    els.append(body("Every break: look at something <b>20 feet away</b> for <b>20 seconds</b>. Resets screen fatigue and lowers cortisol."))
    els.append(sp(8))
    els.append(lbl("THE PEAK FINDER", ACC))
    els.append(FillLine("My highest focus score was Sprint # __ — this tells me I'm sharpest at:", ACC, lines=1))
    els.append(sp(4))
    els.append(FillLine("What distracted me most today:", ACC, lines=1))
    els.append(sp(8))
    els += quote_els("You will never reach your destination if you stop and throw stones at every dog that barks.", "Winston Churchill", ACC)
    els.append(ProgressBar(4, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 5 ────────────────────────────────────────────────────────────────────
def day5():
    ACC = DAY_COLORS[5]
    els = day_header_els(5, "The Fortress", "Design a space where focus is the only option.", ACC)
    els.append(sci_card(
        "<b>Willpower is a finite battery.</b> If you have to fight the urge to check your phone, "
        "you've already lost half your energy. Today we use Architecture — changing the environment "
        "so your brain has no choice but to work.", ACC))
    els.append(sp(10))
    els.append(lbl("THE 3-POINT SWEEP", ACC))
    steps = [
        ("VISUAL SILENCE",
         "Clear everything off your desk except your computer/notebook and a drink. If it's not for the task, it's a distraction."),
        ("THE DIGITAL MOAT",
         "Install a site blocker (Cold Turkey / Freedom) and lock your top 3 distraction sites for the next 2 hours."),
        ("THE OUT-OF-SIGHT RULE",
         "Phone goes in a drawer in a different room. A phone on your desk reduces cognitive capacity even face-down."),
    ]
    for title, desc in steps:
        els.append(ClickBox(title, ACC))
        els.append(Paragraph(f"    {desc}",
            S("sm", fontName="Helvetica", fontSize=8.5, leading=13, textColor=LIGHT_TXT, spaceAfter=2)))
        els.append(sp(4))
    els.append(sp(6))
    els.append(lbl("THE FOCUS ANCHOR", ACC))
    els.append(make_card([
        card_lbl("BUILD A SENSORY TRIGGER", ACC),
        card_txt("Choose one scent (candle), playlist (lo-fi / white noise), or drink. "
                 "<b>Use it ONLY in Fortress Mode.</b> Your brain associates it with 'Go Time' within 2 weeks."),
    ]))
    els.append(sp(8))
    els.append(lbl("MY 3-STEP FOCUS RITUAL", ACC))
    for i, ex in enumerate(["e.g. Headphones on", "e.g. Phone in drawer", "e.g. Coffee sip"], 1):
        els.append(FillLine(f"Step {i}  ({ex}):", ACC, lines=1))
        els.append(sp(3))
    els.append(sp(8))
    els.append(lbl("REFLECTION", ACC))
    els.append(body("What is the #1 item in your environment that tricks you into procrastinating? How did you neutralize it today?"))
    els.append(FillLine("Your answer:", ACC, lines=2))
    els.append(sp(6))
    els += quote_els("Environment is the invisible hand that shapes human behaviour.", "James Clear", ACC)
    els.append(ProgressBar(5, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 6 ────────────────────────────────────────────────────────────────────
def day6():
    ACC = DAY_COLORS[6]
    els = day_header_els(6, "The Dopamine Reset", "Recover your edge through strategic boredom.", ACC)
    els.append(body('"Your brain is like a sponge. If it\'s constantly soaked in digital noise, it can\'t absorb new ideas. Today we wring it out."'))
    els.append(sp(6))
    els.append(make_card([
        card_lbl("THE SCIENCE IN 3 BULLETS", ACC),
        card_txt("• <b>Sleep</b> = Memory consolidation. One bad night = 40% drop in focus."),
        card_txt("• <b>Movement</b> = New brain cells (BDNF protein). Even a 20-min walk counts."),
        card_txt("• <b>Boredom</b> = Creativity. Your best ideas come when there's no noise to drown them out."),
    ]))
    els.append(sp(10))
    els.append(lbl("YOUR 3 RECOVERY MISSIONS", ACC))
    els.append(sp(4))
    els.append(RecoveryMissions([
        ("The Silent Walk",    "20 min, no phone/podcast. Notice 3 things you've never seen before."),
        ("The 30-Min Buffer",  "Phone goes to 'charging jail' outside bedroom 30 min before bed."),
        ("The Morning Shield", "Don't touch your phone until after your first coffee or breakfast."),
    ], ACC))
    els.append(sp(10))
    els.append(lbl("THE IDEA CATCH", ACC))
    els.append(make_card([
        card_lbl("CAPTURE THE BREAKTHROUGH", ACC),
        card_txt("During boredom your Default Mode Network activates — this is when creative breakthroughs happen. "
                 "Carry paper on your walk. If a great idea hits, jot <b>one word</b> and keep walking."),
    ]))
    els.append(sp(8))
    els.append(lbl("THE RECOVERY CHECK", ACC))
    els.append(FillLine("How itchy was your thumb to check your phone during the walk? (1–10):", ACC, lines=1))
    els.append(sp(4))
    els.append(FillLine("The most interesting thought I had when there was nothing to distract me:", ACC, lines=2))
    els.append(sp(6))
    els += quote_els("Almost everything will work again if you unplug it for a few minutes. Including you.", "Anne Lamott", ACC)
    els.append(ProgressBar(6, 7, ACC))
    els.append(PageBreak())
    return els


# ── DAY 7 ────────────────────────────────────────────────────────────────────
def day7():
    ACC = DAY_COLORS[7]
    els = day_header_els(7, "The Attention OS", "Build a system that works so you don't have to.", ACC)
    els.append(make_card([
        card_lbl("THE AUTOMATION SECRET", ACC),
        Paragraph(
            '"You don\'t rise to the level of your goals — you fall to the level of your systems." — James Clear',
            S("qti", fontName="Helvetica-Oblique", fontSize=10, leading=16,
              textColor=ACC, spaceAfter=6)),
        card_txt("Today we stop <i>trying</i> to focus and start <i>defaulting</i> to it. "
                 "We set the rules so your brain doesn't have to decide every morning."),
    ], bg=colors.HexColor("#1A1200")))
    els.append(sp(10))
    els.append(lbl("YOUR ATTENTION OPERATING SYSTEM", ACC))
    els.append(body("Fill in your 3 Core Rules:"))
    els.append(sp(6))
    rules = [
        ("THE MORNING RULE",   "I will not touch my phone until:"),
        ("THE DEEP WORK RULE", "Time of my daily Monk Sprint:"),
        ("THE SHUTDOWN RULE",  "Time my phone goes to charging jail:"),
    ]
    for title, prompt in rules:
        els.append(Paragraph(title, S(f"rl{title}", fontName="Helvetica-Bold", fontSize=8,
            textColor=ACC, letterSpacing=1, spaceBefore=4, spaceAfter=2)))
        els.append(FillLine(prompt, ACC, lines=1))
        els.append(sp(4))
    els.append(sp(8))
    els.append(lbl("THE BEFORE VS. AFTER", ACC))
    ba = Table([[
        [Paragraph("DAY 1 SCORE", S("bab1", fontName="Helvetica-Bold", fontSize=8, textColor=ACC, spaceAfter=4)),
         FillLine("", ACC, lines=1)],
        [Paragraph("DAY 7 SCORE", S("bab2", fontName="Helvetica-Bold", fontSize=8, textColor=ACC, spaceAfter=4)),
         FillLine("", ACC, lines=1)],
    ]], colWidths=[(W-80)/2 - 4, (W-80)/2 - 4])
    ba.setStyle(TableStyle([
        ("VALIGN",        (0,0),(-1,-1),"TOP"),
        ("BACKGROUND",    (0,0),(-1,-1),DARK_CARD),
        ("TOPPADDING",    (0,0),(-1,-1),10),
        ("BOTTOMPADDING", (0,0),(-1,-1),10),
        ("LEFTPADDING",   (0,0),(-1,-1),12),
        ("RIGHTPADDING",  (0,0),(-1,-1),12),
    ]))
    els.append(ba)
    els.append(sp(10))
    els.append(lbl("THE 90-DAY VISION", ACC))
    els.append(body('"If I keep this system for 90 days, the one big project I will finally finish is:"'))
    els.append(FillLine("", ACC, lines=1))
    els.append(sp(10))
    els.append(ProgressBar(7, 7, ACC))
    els.append(PageBreak())
    return els


# ── COMPLETION ───────────────────────────────────────────────────────────────
class SignatureBox(Flowable):
    def __init__(self):
        super().__init__()
        self.width = W - 80
        self.height = 30

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(LIGHT_TXT)
        c.drawString(0, 14, "SIGNED:")
        c.drawString(200, 14, "DATE:")

        abs_x, abs_y = c.absolutePosition(45, 10)
        c.acroForm.textfield(
            name=f"sig_{get_id()}", tooltip="Signature",
            x=abs_x, y=abs_y, width=140, height=16,
            textColor=CREAM, fillColor=DARK_CARD, borderColor=BORDER_C,
            borderStyle='solid', forceBorder=True,
            fontName="Helvetica", fontSize=10
        )
        
        abs_x_d, abs_y_d = c.absolutePosition(235, 10)
        c.acroForm.textfield(
            name=f"date_{get_id()}", tooltip="Date",
            x=abs_x_d, y=abs_y_d, width=80, height=16,
            textColor=CREAM, fillColor=DARK_CARD, borderColor=BORDER_C,
            borderStyle='solid', forceBorder=True,
            fontName="Helvetica", fontSize=10
        )

        c.restoreState()


def completion():
    ACC = DAY_COLORS[7]
    els = [sp(16)]
    els.append(CertBanner())
    els.append(sp(16))
    els.append(Paragraph("YOU FINISHED.",
        S("yf", fontName="Helvetica-Bold", fontSize=20, leading=26,
          textColor=CREAM, alignment=TA_CENTER)))
    els.append(sp(4))
    els.append(Paragraph(
        "Most people never finish what they start. You did. "
        "That puts you ahead of 90% of people who opened this workbook.",
        S("yd", fontName="Helvetica", fontSize=10, leading=15,
          textColor=LIGHT_TXT, alignment=TA_CENTER, spaceAfter=14)))
    els.append(AccentLine(color=ACC))
    els.append(sp(12))
    els.append(Paragraph("POST-RESET COMMITMENTS",
        S("prc", fontName="Helvetica-Bold", fontSize=8, textColor=ACC,
          letterSpacing=1.5, spaceAfter=6)))
    for item in [
        "One Monk Sprint every single day",
        "Phone stays out of the bedroom at night",
        "Social media only in designated windows",
        "One real boredom walk per week (no earphones)",
        "Revisit your Attention Score in 30 days and compare",
        "Share this workbook with one friend who needs it",
    ]:
        els.append(ClickBox(item, ACC))
        els.append(sp(5))
    els.append(sp(12))
    els.append(make_card([
        card_lbl("YOUR ATTENTION PLEDGE", ACC),
        card_txt("I commit to protecting my attention as the valuable resource it is. "
                 "I will not let algorithms, notifications, or endless scrolling "
                 "dictate where my mind goes. My focus is mine."),
    ], bg=MID_GRAY))
    els.append(sp(12))
    els.append(SignatureBox())
    els.append(sp(14))
    els.append(make_card([
        card_lbl("CONTINUE THE JOURNEY", ACC),
        card_txt("This workbook is Day 0 of a longer road. Follow <b>@favazmk</b> for AI tools, "
                 "habit trackers, and deep work systems that build on what you started here."),
    ], bg=colors.HexColor("#0A1A0A")))
    return els


def build():
    path = "7_Day_Attention_Reset_v2.pdf"
    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=40, rightMargin=40,
        topMargin=36, bottomMargin=36,
        title="The 7-Day Attention Reset",
        author="Favaz MK",
    )
    story = []
    story += cover()
    story += intro_toc()
    story += day1()
    story += day2()
    story += day3()
    story += day4()
    story += day5()
    story += day6()
    story += day7()
    story += completion()
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print("Done:", path)

if __name__ == "__main__":
    build()
