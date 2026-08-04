import uuid
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
        # draw a box
        c.rect(0, 0, self.width, self.height)
        
        # Absolute coordinates
        abs_x, abs_y = c.absolutePosition(0, 0)
        form = c.acroForm
        form.textfield(name=f"test_{uuid.uuid4().hex}", x=0, y=0, width=100, height=20)
        form.textfield(name=f"test_{uuid.uuid4().hex}", x=abs_x + 100, y=abs_y + 20, width=100, height=20)

doc = SimpleDocTemplate("test_form.pdf", pagesize=A4)
story = [TestField(), Spacer(1, 200), TestField()]
doc.build(story)
print("Done")
