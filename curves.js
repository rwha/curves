'use strict';

class Curve {
  constructor(o) {
    this.title = o.title;
		this.length = o.length;
    this.equation = o.equation;
    this.draw = o.draw;
    this.points = [];
  }


}

class Polar extends Curve {
  constructor(o) {
    super(o);
    this.type = 'polar';
    this.max = (typeof o.max === 'number') ? (o.max * Math.PI) : (2 * Math.PI);
    this.min = (typeof o.min === 'number') ? o.min : 0;
  }
}

class Parametric extends Curve {
  constructor(o) {
    super(o);
    this.type = 'parametric'
    this.max = (typeof o.max === 'number') ? o.max : 10;
    this.min = (typeof o.min === 'number') ? o.min : -10;
  }
}

const control = {
  initialize() {
	  this.wrapper = document.getElementById('wrapper');
    this.eq = document.querySelector('#eq');
  	this.selected = 'astroid';

    let frag = document.createDocumentFragment();
    Object.entries(curves).forEach(([name, obj]) => {
      let p = document.createElement('div');
      p.className = (name == 'astroid') ? 'selected' : 'parent';
      p.textContent = obj.title;
      p.setAttribute('id', name);
      p.addEventListener('click', this.curveClicked.bind(this), false);
      frag.appendChild(p);
    });
    document.getElementById('tiles').appendChild(frag);
    this.wrapper.addEventListener('click', this.animatePath.bind(this), false);
    this.rewrap()
	    .then(this.draw())
		  .catch(e => console.warn(e));
  },

  curveClicked(e) {
    e.stopPropagation();
    let item = e.currentTarget;
    let prev = document.querySelector('.selected');
    if (prev) { 
      prev.className = 'parent';
    }
    item.className = 'selected';
		this.selected = item.id;
	  this.wrapper.innerHTML = '';
    this.rewrap()
      .then(this.draw())
      .catch(e => console.warn(item, e));
  },

  async rewrap() {
    let type = curves[this.selected].type;
    let radius = (type == 'parametric') ? 0 : '100%';
    this.wrapper.appendChild(Object.getOwnPropertyDescriptor(this, type).value);

    return new Promise((resolve, reject) => {
      this.wrapper.style.borderRadius = radius;
      resolve();
    });
  },

	computeCurve() {
		let curve = curves[this.selected];
    for (let s = curve.min, x, y; s <= curve.max; s += 0.01) {
      ({x, y} = curve.draw(s));
      x = Number.parseFloat((((x+10)/20)*1000).toPrecision(5));
      y = Number.parseFloat((((10-y)/20)*1000).toPrecision(5));
      curve.points.push(x + ' ' + y);
		}
	},

  async draw() {
    let curve = curves[this.selected];
    let path = this.wrapper.firstChild.getElementById('svgcurve');

    // remove the off-grid points!
    if(curve.points.length === 0) {
			this.computeCurve();
    }

    path.setAttribute("points", curve.points.join(','));

    return new Promise((resolve, reject) => {
      this.eq.style.display = 'block';
      katex.render(curve.equation, eq, {displayMode: false});
      this.animatePath();
      resolve(curve.title);
    });
  },

  animatePath() {
    let path = this.wrapper.firstChild.getElementById('svgcurve');
    let length = curves[this.selected].length;   //path.getTotalLength());
    path.setAttribute("stroke-width", "2");
    path.style.transition = 'none';
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 3s ease-in-out';
    path.style.strokeDashoffset = 0;
  }
};

(function(){ 
  function getSVGDoc(svg) {
	  let req = new XMLHttpRequest();
	  req.onload = function(e) {
		  let parser = new DOMParser();
      let svgdoc = parser.parseFromString(req.responseText, "text/xml").documentElement;
		  control[svg] = svgdoc;
	  }
	  req.open("GET", svg + '.svg');
	  req.send();
  }

  getSVGDoc('parametric');
  getSVGDoc('polar');
})();

window.onload = function () {
  control.initialize();
}

/*
options = {
	title: <String>,
	length: <Number>,
	equation: <String> (optional),
	draw: <Function>,
	max: <Number> (optional),
	min: <Number> (optional)
};
*/

const curves = {
	astroid: new Parametric({
    title: "Astroid",
		length: 2700,
    equation: "\\begin{aligned} x \&= a \\cos^3(t) \\\\[1.5ex] y \&= a \\sin^3(t)\\end{aligned}", 
    draw: t => ({ x: (9 * Math.cos(t)**3), y: (9 * Math.sin(t)**3) }), 
		max: (2*Math.PI), 
		min: 0
	}),

	bicorn: new Parametric({
		title: "Bicorn",
		length: 2275,
		equation: "\\begin{aligned} x \&= a \\cos(t) \\\\[1.5ex] y \&= \\frac{\\sin^2(t)}{2 + \\sin(t)}\\end{aligned}",
		draw: t => ({ x: (9 * Math.cos(t)), y: (9 * (Math.sin(t)**2)/(2 + Math.sin(t))) }), 
		max: (2 * Math.PI), 
		min: 0
	}),
	
  cardiod: new Polar({
		title: "Cardiod",
		length: 1722,
		equation: "r = 2a(1+\\cos\\theta)",
		draw: t => { 
      	let r = 4 * (1 + Math.cos(t));
      	return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
    	}, 
		max: 2.1
	}),
	
  catenary: new Parametric({
		title: "Catenary",
		length: 1387,
		equation: "y = a\\cosh(\\frac{x}{a})",
		draw: t =>  ({x: t, y: Math.cosh(t/3)}), 
		max: 9, 
		min: -9
	}),
	
  cayleysSextic: new Polar({
		title: "Cayley's Sextic",
		length: 2007,
		equation: "r = 4a\\cos^3(\\frac{\\theta}{3})",
  	draw: t => {
				let r = 8 * Math.cos(t/3)**3;
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 3.1
	}),
	
  cissoidOfDiocles: new Parametric({
		title: "Cissoid of Diocles",
		length: 1075,
		equation: "r = 2a \\tan\\theta\\sin\\theta",
		draw: t => {
				let r = 2 * Math.tan(t) * Math.sin(t);
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			},
		max: (Math.PI*0.5),
		min: (-Math.PI*0.44)
	}),

	cochleoid: new Polar({
		title: "Cochleoid",
		length: 1819,
		equation: "\\displaystyle r = \\frac{a \\sin\\theta}{\\theta}", 
		draw: t => {
				let r = 9 * Math.sin(t)/t;
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 6, 
		min: 0.0004
	}),

/*	
  conchoid: new Parametric(
		"Conchoid",
		"r = a + b\\sec\\theta",
	  t => {
			let r = 5 + 2/Math.cos(t);
			return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
		}, Math.PI, -Math.PI),
*/

  conchoidOfDeSluze: new Polar({
		title: "Conchoid of DeSluze",
		length: 1800,
		equation: "a(r\\cos\\theta + a) = k^2\\cos^2\\theta",
		draw: t => {
				let	k = 2.5,
          c = Math.cos(t),
				  r = (k**2 * c**2 - 1)/c;
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 1.5, 
		min: (Math.PI*0.53)
	}),

  cycloid: new Parametric({
		title: "Cycloid",
		length: 1262,
		equation: "\\begin{aligned} x \&= t - \\sin t \\\\[1.5ex] y \&= 1 - \\cos t\\end{aligned}",
		draw: t => ({ x: (t - Math.sin(t)), y: (1 - Math.cos(t)) }), 
		max: 9.75, 
		min: -9.72
	}),

	curateCycloid: new Parametric({
		title: "Cycloid (curate)",
		length: 1050,
		equation: "\\begin{aligned} x \&= 2t - \\sin t \\\\[1.5ex] y \&= 2 - \\cos t\\end{aligned}",
		draw: t => ({ x: (2 * t - Math.sin(t)), y: (2 - Math.cos(t)) }), 
		max: 4.5, 
		min: -4.5
	}),

	prolateCycloid: new Parametric({
		title: "Cycloid (prolate)",
		length: 2060,
		equation: "\\begin{aligned} x \&= t - 2\\sin t \\\\[1.5ex] y \&= 1 - 2\\cos t\\end{aligned}",
		draw: t => ({ x: (t - 2 * Math.sin(t)), y: (1 - 2 * Math.cos(t)) }), 
		max: 9.7, 
		min: -9.6
	}),

	doubleFolium: new Polar({
		title: "Double Folium",
		length: 2147,
		equation: "r = 4a\\cos\\theta\\sin^2\\theta",
		draw: t => {
				let r = 24 * Math.cos(t) * Math.sin(t)**2;
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 1
	}),

	ellipse: new Parametric({
		title: "Ellipse",
		length: 2270,
		equation: "\\begin{aligned} x \&= a \\cos(t) \\\\[1.5ex] y \&= b \\sin(t)\\end{aligned}",
		draw: t => ({ x: (9 * Math.cos(t)), y: (5 * Math.sin(t)) }), 
		max: (Math.PI*2+0.1), 
		min: 0
	}),

	epicycloid: new Parametric({
		title: "Epicycloid",
		length: 10400,
		equation: "\\begin{aligned} x \&= (a+b) \\cos t - b \\cos((\\frac{a}{b} + 1)t) \\\\[1.5ex] y \&= (a+b) \\sin t - b \\sin((\\frac{a}{b}+1)t)\\end{aligned}",
		draw: t => {
				let a = 4.5, b = 2;
				return { x: (a+b)*Math.cos(t) - b*Math.cos((a/b + 1)*t), y: (a+b)*Math.sin(t) - b*Math.sin((a/b + 1)*t) };
			}, 
		max: (Math.PI*8), 
		min: 0
	}),

	epitrochoid: new Parametric({
		title: "Epitrochoid",
		length: 13673,
		equation: "\\begin{aligned} x \&= (a+b) \\cos t - c \\cos((\\frac{a}{b} + 1)t) \\\\[1.5ex] y \&= (a+b) \\sin t - c \\sin((\\frac{a}{b}+1)t)\\end{aligned}",
    draw: t => {
				let a = 4.5, b = 2, c = 3;
				return { x: (a+b)*Math.cos(t) - c*Math.cos((a/b + 1)*t), y: (a+b)*Math.sin(t) - c*Math.sin((a/b + 1)*t) };
			}, 
		max: (Math.PI*8+0.1), 
		min: 0
	}),

	equiangularSpiral: new Polar({
		title: "Equiangular Spiral",
		length: 2536,
		equation: "r = a\\exp(\\theta \\cot b)",
		draw: t => {
				let r = 0.1 * Math.exp(t * 0.198912367);
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 7.37
	}),

	foliumOfDescartes: new Parametric({
		title: "Folium of Descartes",
		length: 2184,
		equation: "x^3 + y^3 = 3axy",
		draw: t =>  {
				let a = 3,
          s = Math.sin(t),
          c = Math.cos(t),
			    r = (3 * a * s * c) / (s**3 + c**3);
				return { x: (r * c), y: (r * s) };
			}, 
		max: 5.35, 
		min: 2.5
	}),

	freethsNephroid: new Polar({
		title: "Freeth's Nephroid",
		length: 3179,
		equation: "r = a(1 + 2\\sin(\\frac{\\theta}{2}))",
		draw: t => {
				let r = 3 * (1 + 2 * Math.sin(t/2));
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 4
	}),

	frequencyCurve: new Parametric({
		title: "Frequency Curve",
		length: 1084,
		equation: "y = \\sqrt(2\\pi\\exp(\\frac{-x^2}{2}))",
		draw: t => ({ x: t, y: Math.sqrt(2 * Math.PI * Math.exp((t * t)/-2)) })
	}),

	hypocycloid: new Parametric({
		title: "Hypocycloid",
		length: 4320,
		equation: "\\begin{aligned} x \&= (a-b)\\cos t + b\\cos((\\frac{a}{b}-1)t) \\\\[1.5ex] y \&= (a-b)\\sin t - b\\sin((\\frac{a}{b}-1)t)\\end{aligned}",
		draw: t => {
				let a = 9, b = 5.4;
				return { x: (a-b)*Math.cos(t) + b*Math.cos((a/b-1)*t), y: (a-b)*Math.sin(t) - b*Math.sin((a/b-1)*t) };
			}, 
		max: Math.PI*6, 
		min: 0
	}),

	hypotrochoid: new Parametric({
		title: "Hypotrochoid",
		length: 9028,
		equation: "\\begin{aligned} x \&= (a-b)\\cos t + c\\cos((\\frac{a}{b}-1)t) \\\\[1.5ex] y \&= (a-b)\\sin t - c\\cos((\\frac{a}{b}-1)t)\\end{aligned}",
		draw: t => {
				let a = 10, b = 14, c = 4.4;
				return { x: (a-b)*Math.cos(t) + c*Math.cos((a/b - 1)*t), y: (a-b)*Math.sin(t) - c*Math.sin((a/b - 1)*t) };
			}, 
		max: Math.PI*14+0.1, 
		min: 0
	}),

	limacon: new Polar({
		title: "Limaçon",
		length: 2142,
		equation: "r = a + b\\cos t",
		draw: t => {
				let r = 3 + 6 * Math.cos(t);
				return { x: (r * Math.cos(t)), y: (r * Math.sin(t)) };
			}, 
		max: 2.1
	}),

	serpentine: new Parametric({
		title: "Serpentine",
		length: 1497,
		equation: "x^2y + aby - a^2x = 0, ab > 0",
		draw: x => {
				let a = 9, b = 3;
				return {x: x, y: (a * a * x)/(x * x + a * b)}
			}
		}),

	parabola: new Parametric({
		title: "Parabola",
		length: 1400, 
		equation: "y = ax^2 + bx + c", 
		draw: t => ({ x: t, y: 0.5 * t * t }), 
		max: 4.5, 
		min: -4.5
	})
};

