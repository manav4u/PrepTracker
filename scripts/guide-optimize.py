"""After the four capture scripts, crop controls, add focus dots and write WebP.
Run from the repository root. Input PNGs are synthetic, unannotated captures.
"""
from PIL import Image, ImageDraw
from pathlib import Path
base = Path('public/guide')
raw = {p.stem: Image.open(p).convert('RGB') for p in base.glob('*.png')}
if not raw:
    raise SystemExit('Run the guide capture scripts first; no source PNGs found.')
points = {'plan-dates': (.94,.56), 'setup-courses': (.94,.22), 'unit': (.94,.14), 'topics': (.94,.16), 'unit-status': (.95,.5), 'pyq': (.94,.6), 'task-form': (.94,.17), 'task-carry': (.94,.77), 'task-row': (.94,.27), 'backup': (.94,.68), 'restore': (.94,.77), 'subjects-change': (.92,.10), 'resource-add': (.93,.33), 'search': (.94,.20), 'review': (.94,.67)}
def save(name, image, point=None):
    im = image.copy()
    if point:
        x,y = int(point[0]*im.width),int(point[1]*im.height)
        d=ImageDraw.Draw(im)
        d.ellipse((x-17,y-17,x+17,y+17),fill='#cf143c',outline='#ffd0d4',width=2)
        d.ellipse((x-3,y-3,x+3,y+3),fill='white')
    im.save(base/(name+'.webp'), quality=92, method=6)
def crop(src,name,box,point=None):
    im=raw[src];w,h=im.size
    save(name,im.crop(tuple(int(v*(w if i%2==0 else h)) for i,v in enumerate(box))),point)
for name,im in raw.items():
    save(name, im, points.get(name))
crop('setup-name','setup-name',(0,.48,1,1),(.93,.23))
crop('task-form','task-title',(0,0,1,.38),(.94,.45))
crop('task-form','task-link',(0,.38,1,.84),(.94,.23))
crop('unit','unit-open',(0,0,1,.27),(.94,.39))
crop('topics','topics-focus',(0,0,1,.49),(.94,.26))
crop('backup','backup-controls',(0,.51,1,1),(.94,.25))
crop('setup-courses','setup-choice',(0,.15,1,.29),(.93,.48))
crop('home-progress','overall-progress',(0,0,1,.49))
crop('search','search',(0,0,1,.43),(.94,.465))
for p in base.glob('*.png'):
    p.unlink()
