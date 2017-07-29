'use strict';

class Curve {
  constructor(title, equation, draw) {
    this.title = title;
    this.equation = equation;
    this.draw = draw;
    this.points = [];
  }


}

class Polar extends Curve {
  constructor(title, equation, draw, max, min) {
    super(title, equation, draw);
    this.type = 'polar';
    this.max = (typeof max === 'number') ? (max * Math.PI) : (2 * Math.PI);
    this.min = (typeof min === 'number') ? min : 0;
    this.bg = "url('polar.svg') 0% 0% / contain white";
  }
}

class Parametric extends Curve {
  constructor(title, equation, draw, max, min) {
    super(title, equation, draw);
    this.type = 'parametric'
    this.max = (typeof max === 'number') ? max : 10;
    this.min = (typeof min === 'number') ? min : -10;
    this.bg = "url('parametric.svg') 0% 0% / contain white";
  }
}

var curves = curves || {};

curves.meta = {
	astroid: new Parametric(
    "Astroid", 
    "\\begin{aligned} x \&= a \\cos^3(t) \\\\[1.5ex] y \&= a \\sin^3(t)\\end{aligned}", 
    t => ({ x: (9 * Math.cos(t)**3), y: (9 * Math.sin(t)**3) }), (2*Math.PI), 0),

	bicorn: new Parametric(
		"Bicorn",
		"\\begin{aligned} x \&= a \\cos(t) \\\\[1.5ex] y \&= \\frac{\\sin^2(t)}{2 + \\sin(t)}\\end{aligned}",
		t => ({ x: (9 * Math.cos(t)), y: (9 * (Math.sin(t)**2)/(2 + Math.sin(t))) }), (2 * Math.PI), 0),
	
  cardiod: new Polar(
		"Cardiod",
		"r = 2a(1+\\cos\\theta)",
		t => { 
      let r = 4 * (1 + Math.cos(t));
      return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
    }, 2.1),
	
  catenary: new Parametric(
		"Catenary",
		"y = a\\cosh(\\frac{x}{a})",
		t =>  ({x: t, y: Math.cosh(t/3)}), 9, -9),
	
  cayleysSextic: new Polar(
		"Cayley's Sextic",
		"r = 4a\\cos^3(\\frac{\\theta}{3})",
  	t => {
			let r = 8 * Math.cos(t/3)**3;
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 3.1),
	
  cissoidOfDiocles: new Parametric(
		"Cissoid of Diocles",
		"r = 2a \\tan\\theta\\sin\\theta",
		t => {
			let r = 2 * Math.tan(t) * Math.sin(t);
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		},(Math.PI*0.5),(-Math.PI*0.44)),

	cochleoid: new Polar(
		"Cochleoid",
		"\\displaystyle r = \\frac{a \\sin\\theta}{\\theta}", 
		t => {
			let r = 9 * Math.sin(t)/t;
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 6, 0.0004),
	
  conchoid: new Parametric(
		"Conchoid",
		"r = a + b\\sec\\theta",
	  t => {
			let r = 5 + 2/Math.cos(t);
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, Math.PI, -Math.PI),

  conchoidOfDeSluze: new Polar(
		"Conchoid of DeSluze",
		"a(r\\cos\\theta + a) = k^2\\cos^2\\theta",
		t => {
			let	k = 2.5,
          c = Math.cos(t),
				  r = (k**2 * c**2 - 1)/c;
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 1.5, (Math.PI*0.53)),

  cycloid: new Parametric(
		"Cycloid",
		"\\begin{aligned} x \&= t - \\sin t \\\\[1.5ex] y \&= 1 - \\cos t\\end{aligned}",
		t => ({ x: (t - Math.sin(t)), y: (1 - Math.cos(t)) }), 9.75, -9.72),

	curateCycloid: new Parametric(
		"Cycloid (curate)",
		"\\begin{aligned} x \&= 2t - \\sin t \\\\[1.5ex] y \&= 2 - \\cos t\\end{aligned}",
		t => ({ x: (2 * t - Math.sin(t)), y: (2 - Math.cos(t)) }), 4.5, -4.5),

	prolateCycloid: new Parametric(
		"Cycloid (prolate)",
		"\\begin{aligned} x \&= t - 2\\sin t \\\\[1.5ex] y \&= 1 - 2\\cos t\\end{aligned}",
		t => ({ x: (t - 2 * Math.sin(t)), y: (1 - 2 * Math.cos(t)) }), 9.6, -9.6),

	doubleFolium: new Polar(
		"Double Folium",
		"r = 4a\\cos\\theta\\sin^2\\theta",
		t => {
			let r = 24 * Math.cos(t) * Math.sin(t)**2;
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 1),

	ellipse: new Parametric(
		"Ellipse",
		"\\begin{aligned} x \&= a \\cos(t) \\\\[1.5ex] y \&= b \\sin(t)\\end{aligned}",
		t => ({ x: (9 * Math.cos(t)), y: (5 * Math.sin(t)) }), (Math.PI*2+0.1), 0),

	epicycloid: new Parametric(
		"Epicycloid",
		"\\begin{aligned} x \&= (a+b) \\cos t - b \\cos((\\frac{a}{b} + 1)t) \\\\[1.5ex] y \&= (a+b) \\sin t - b \\sin((\\frac{a}{b}+1)t)\\end{aligned}",
		t => {
			let a = 4.5, b = 2;
			return { x: (a+b)*Math.cos(t) - b*Math.cos((a/b + 1)*t), y: (a+b)*Math.sin(t) - b*Math.sin((a/b + 1)*t) };
		}, (Math.PI*8), 0),

	epitrochoid: new Parametric(
		"Epitrochoid",
		"\\begin{aligned} x \&= (a+b) \\cos t - c \\cos((\\frac{a}{b} + 1)t) \\\\[1.5ex] y \&= (a+b) \\sin t - c \\sin((\\frac{a}{b}+1)t)\\end{aligned}",
    t => {
			let a = 4.5, b = 2, c = 3;
			return { x: (a+b)*Math.cos(t) - c*Math.cos((a/b + 1)*t), y: (a+b)*Math.sin(t) - c*Math.sin((a/b + 1)*t) };
		}, (Math.PI*8+0.1), 0),

	equiangularSpiral: new Polar(
		"Equiangular Spiral",
		"r = a\\exp(\\theta \\cot b)",
		t => {
			let r = 0.1 * Math.exp(t * 0.198912367);
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 7.37),

	foliumOfDescartes: new Parametric(
		"Folium of Descartes",
		"x^3 + y^3 = 3axy",
		t =>  {
			let a = 3,
          s = Math.sin(t),
          c = Math.cos(t),
			    r = (3 * a * s * c) / (s**3 + c**3);
			return { x: (r * c), y: (r * s) };
		}, 5.35, 2.5),

	freethsNephroid: new Polar(
		"Freeth's Nephroid",
		"r = a(1 + 2\\sin(\\frac{\\theta}{2}))",
		t => {
			let r = 3 * (1 + 2 * Math.sin(t/2));
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 4),

	frequencyCurve: new Parametric(
		"Frequency Curve",
		"y = \\sqrt(2\\pi\\exp(\\frac{-x^2}{2}))",
		t => ({ x: t, y: Math.sqrt(2 * Math.PI * Math.exp((t * t)/-2)) }) ),

	hypocycloid: new Parametric(
		"Hypocycloid",
		"\\begin{aligned} x \&= (a-b)\\cos t + b\\cos((\\frac{a}{b}-1)t) \\\\[1.5ex] y \&= (a-b)\\sin t - b\\sin((\\frac{a}{b}-1)t)\\end{aligned}",
		t => {
			let a = 9, b = 5.4;
			return { x: (a-b)*Math.cos(t) + b*Math.cos((a/b-1)*t), y: (a-b)*Math.sin(t) - b*Math.sin((a/b-1)*t) };
		}),

	hypotrochoid: new Parametric(
		"Hypotrochoid",
		"\\begin{aligned} x \&= (a-b)\\cos t + c\\cos((\\frac{a}{b}-1)t) \\\\[1.5ex] y \&= (a-b)\\sin t - c\\cos((\\frac{a}{b}-1)t)\\end{aligned}",
		t => {
			let a = 10, b = 14, c = 4.4;
			return { x: (a-b)*Math.cos(t) + c*Math.cos((a/b - 1)*t), y: (a-b)*Math.sin(t) - c*Math.sin((a/b - 1)*t) };
		}, Math.PI*14+0.1, 0),

	limacon: new Polar(
		"Limaçon",
		"r = a + b\\cos t",
		t => {
			let r = 3 + 6 * Math.cos(t);
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, 2.1),
	parabola: new Parametric("Parabola", "y = ax^2 + bx + c", t => ({ x: t, y: t * t }), 3.2, -3.2)
};

async function getSVGDoc(svg) {
  let txt = await (await fetch(svg)).text();
  let parser = new DOMParser();
  return parser.parseFromString(txt, "text/xml").documentElement;
}

curves.svg = {};

getSVGDoc('parametric.svg').then(d => curves.svg.parametric = d);
getSVGDoc('polar.svg').then(d => curves.svg.polar = d);
/*
curves.meta.astroid.points.forEach((k,v) => curves.points.push(k.x + ' ' + k.y))
// remove the off-grid points!
path.setAttribute("points", curves.points.join(','))
path.getTotalLength()
path.setAttribute("stroke-width", "2")
path.style.transition = 'none';
path.style.strokeDasharray = length + ' ' + length;
path.style.strokeDashoffset = length
path.getBoundingClientRect()
path.style.transition = 'stroke-dashoffset 2s ease-in-out';
path.style.strokeDashoffset = 0
*/

curves.initialize = function initialize() {
  curves.canvas = document.getElementById('canvas');
  curves.cancon = document.getElementById('can');
  curves.eq = document.querySelector('#eq');
  curves.ctx = curves.canvas.getContext('2d');
  curves.points = [];
  curves.raf = '';

  let frag = document.createDocumentFragment();
  Object.entries(this.meta).forEach(([name, obj]) => {
    let p = document.createElement('div');
    p.className = (name == 'astroid') ? 'selected' : 'parent';
    p.textContent = obj.title;
    p.setAttribute('id', name);
    p.addEventListener('click', this.curveClicked.bind(this), false);
    frag.appendChild(p);
  });
  document.getElementById('tiles').appendChild(frag);
  this.cancon.addEventListener('click', this.redraw.bind(this), false);
  document.getElementById('astroid').click();
}

curves.curveClicked = function curveClicked(e) {
  e.stopPropagation();
  if (curves.raf) window.cancelAnimationFrame(curves.raf);
  let item = e.currentTarget;
  let old;
  let prev = document.querySelector('.selected');
  if (prev) { 
    prev.className = 'parent';
    old = prev.id;
  } else {
    old = item.id;
  }
  item.className = 'selected';
  this.reshape(old, item.id)
    .then(this.draw())
    .catch(e => console.warn(item, e));
}

curves.reshape = async function(from, to) {
  let old_radius = (curves.meta[from] instanceof Parametric) ? 0 : '100%';
  let old_back = curves.meta[from].bg;
  
  let new_radius = (curves.meta[to] instanceof Parametric) ? 0 : '100%';
  let new_back = curves.meta[to].bg;

  let old_kf = {borderRadius: old_radius, background: old_back};
  let new_kf = {borderRadius: new_radius, background: new_back};

  curves.ctx.clearRect(0,0,1000,1000);

  if ('animate' in curves.cancon) {  
    return await this.cancon.animate([{borderRadius: new_radius}], {duration: 150, fill: 'forwards'});
    //return await this.cancon.animate([old_kf,new_kf], {duration: 150, fill: 'forwards'});
  } else {
    return new Promise((resolve, reject) => {
      //this.cancon.style.background = new_back;
      this.cancon.style.borderRadius = new_radius;
      resolve();
    });
  }
}


curves.redraw = function redraw() {
  if (curves.raf) window.cancelAnimationFrame(curves.raf);
  let name = document.querySelector('.selected').id;
  let curve = curves.meta[name];
  let cx = curves.ctx;
  let points = curve.points.slice(0);
  cx.save();
  cx.clearRect(0,0,1000,1000);
  cx.strokeStyle = (curve instanceof Parametric) ? 'green' : 'red';
  cx.lineWidth = 1;
  cx.lineCap = 'round'; 
  cx.lineJoin = 'round';
  cx.beginPath();
  let x, y, start = false;
  let pos, tos;

  function step(timestamp) {
    if (points.length > 0) {
      curves.raf = window.requestAnimationFrame(step);
      ({x, y} = points.shift());
      tos = (x>0 && x<1000 && y>0 && y<1000); 
      if (tos || pos) {
        cx.lineTo(x,y);
      } else {
        cx.moveTo(x,y);
      }
      cx.stroke();
      pos = tos;
      if(points.length > 10 && curve.points.length > 500) points.splice(0,5);
    } else {
      cx.shadowColor = cx.strokeStyle;
      cx.shadowBlur = 1;
      cx.lineWidth = 2;
      cx.stroke();
      cx.restore();
      curves.raf = '';
    }
    if (!start) start = timestamp;
  }
  curves.raf = window.requestAnimationFrame(step);
}

curves.draw = async function() {
  let curve = curves.meta[document.querySelector('.selected').id];
  let tos, los, started = false;
  let cx = curves.ctx;
  let cache_empty = (curve.points.length === 0) ? true : false;
  cx.save();

  cx.shadowColor = cx.strokeStyle = (curve instanceof Parametric) ? 'green' : 'red';
  cx.shadowBlur = 1;
  cx.lineWidth = 2;
  cx.lineCap = cx.lineJoin = 'round';

  cx.beginPath();

    for (let s = curve.min, x, y; s <= curve.max; s += 0.01) {
      ({x, y} = curve.draw(s));
      x = Number.parseFloat((((x+10)/20)*1000).toPrecision(5));
      y = Number.parseFloat((((10-y)/20)*1000).toPrecision(5));
      if (!started) {
        started = true;
        cx.moveTo(x,y);
      }
      tos = (x>0 && x<1000 && y>0 && y<1000);
      if (los || tos) {
        cx.lineTo(x,y)
      } else {
        cx.moveTo(x,y)
      }
      if (cache_empty) {
        curve.points.push(x + ' ' + y);
      }
      los = tos;
    }
    cx.stroke();
    cx.restore();

  return new Promise((resolve, reject) => {
    this.eq.style.display = 'block';
    katex.render(curve.equation, eq, {displayMode: false});
    resolve(curve.title);
  });
}

window.onload = function () {
 curves.initialize();
}
