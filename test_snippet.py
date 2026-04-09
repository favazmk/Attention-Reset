from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Flowable, Spacer
from reportlab.lib import colors

W, H = A4
CREAM     = colors.HexColor("#F0EDE6")
MID_GRAY  = colors.HexColor("#1E1E2A")
DAY_COLORS = {0: colors.HexColor("#E8C547")}

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
        form.checkbox(name=f'cb_{id(self)}', tooltip=self.label,
                      x=0, y=3, size=s, buttonStyle='check',
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
        form.textfield(name=f'tf_{id(self)}', tooltip=self.label,
                       x=0, y=y - field_height + 8, width=self.line_width, height=field_height,
                       borderColor=colors.HexColor("#2A2A3A"), fillColor=colors.transparent,
                       textColor=CREAM, fontName='Helvetica', fontSize=10)
        c.restoreState()

doc = SimpleDocTemplate("test_snippet.pdf", pagesize=A4)
story = [ClickBox("Hello", colors.red), Spacer(1, 200), FillLine("World", colors.red, lines=3)]
doc.build(story)
print("Done snippet test")
