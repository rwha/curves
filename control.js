'use strict';

const control = {
  initialize() {
	  this.wrapper = document.getElementById('wrapper');
    this.eq = document.getElementById('eq');
  	this.selected = 'astroid';
		this.polar = document.getElementById("polar"); 
		this.parametric = document.getElementById("parametric"); 
		this.path = document.getElementById("svgcurve");

		let tiles = document.getElementById('tiles');
    let frag = document.createDocumentFragment();
    Object.entries(curves).forEach(([name, obj]) => {
      let p = document.createElement('div');
      p.className = (name == 'astroid') ? 'selected' : 'parent';
      p.textContent = obj.title;
      p.setAttribute('id', name);
      frag.appendChild(p);
    });
    tiles.appendChild(frag);
		tiles.addEventListener('click', this.curveClicked.bind(this));

    this.wrapper.addEventListener('click', this.animatePath.bind(this), false);
		this.rewrap().then(this.draw());
  },

  curveClicked(e) {
    let item = e.target;
    let prev = document.querySelector('.selected');
    if (prev) { 
      prev.className = 'parent';
    }
    item.className = 'selected';
		this.selected = item.id;
    this.rewrap()
      .then(this.draw())
      .catch(e => console.warn(item, e));
  },

  rewrap() {
    return new Promise((resolve, reject) => {
    	let type = curves[this.selected].type;
    	let color = (type == 'parametric') ? 'green' : 'red';
			this.polar.style.opacity = 0;
			this.parametric.style.opacity = 0;
			this[type].style.opacity = 1;
			this.path.setAttribute("stroke", color)
    	resolve();
    });
  },

	computeCurve(curve) {
		let points = [];
    for (let s = curve.min, x, y; s <= curve.max; s += 0.01) {
      ({x, y} = curve.draw(s));
      x = Number.parseFloat((((x+10)/20)*1000).toPrecision(5));
      y = Number.parseFloat((((10-y)/20)*1000).toPrecision(5));
			points.push(x + ' ' + y);
		}
		return points;
	},

  draw() {
		return new Promise((resolve, reject) => {
			let curve = curves[this.selected];

			let points = this.computeCurve(curve);
    	this.path.setAttribute("points", points.join(','));

      this.eq.style.display = 'block';
      katex.render(curve.equation, eq, {displayMode: false});
      this.animatePath();
      resolve();
    });
  },

  animatePath() {
    let length = curves[this.selected].length; 
    this.path.setAttribute("stroke-width", "2");
    this.path.style.transition = 'none';
    this.path.style.strokeDasharray = length + ' ' + length;
    this.path.style.strokeDashoffset = length;
    this.path.getBoundingClientRect();
    this.path.style.transition = 'stroke-dashoffset 3s ease-in-out';
    this.path.style.strokeDashoffset = 0;
  }
};

window.onload = function () {
  control.initialize();
}

