from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Flowable, Spacer
from reportlab.lib import colors

class TestField(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 200
        self.height = 50

    def draw(self):
        c = self.canv
        # Absolute coordinates
        abs_x, abs_y = c.absolutePosition(0, 0)
        form = c.acroForm
        form.radio(name='grp', tooltip='A', value='A', x=abs_x, y=abs_y,
                   buttonStyle='check', size=20, fillColor=colors.black, 
                   textColor=colors.red, borderColor=colors.white)
        form.radio(name='grp', tooltip='B', value='B', x=abs_x + 50, y=abs_y,
                   buttonStyle='check', size=20, fillColor=colors.black, 
                   textColor=colors.red, borderColor=colors.white)

doc = SimpleDocTemplate("test_radio.pdf", pagesize=A4)
story = [TestField()]
doc.build(story)
print("Done")
