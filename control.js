'use strict';

const control = {
  initialize() {
    this.eq = document.getElementById('eq');
    this.polar = document.getElementById("polar");
    this.parametric = document.getElementById("parametric");
    this.spath = document.getElementById("curve");
    this.selected = 'astroid';

    let wrapper = document.getElementById('wrapper');
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
    wrapper.addEventListener('click', this.animatePath.bind(this), false);

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
    let type = curves[this.selected].type;
    let color = (type == 'parametric') ? 'green' : 'red';
		this.polar.style.opacity = 0;
		this.parametric.style.opacity = 0;
		this[type].style.opacity = 1;
		this.spath.setAttribute("stroke", color)
    return new Promise((resolve, reject) => {
    	resolve();
    });
  },

	computeCurve(curve) {
		let points = [];
    let OOB = false;
    let prevOOB = 0;
    let started = false;

    for (let s = curve.min, x, y; s <= curve.max; s += 0.01) {
      ({x, y} = curve.draw(s));
      x = Number.parseFloat((((x+10)/20)*1000).toPrecision(5));
      y = Number.parseFloat((((10-y)/20)*1000).toPrecision(5));

      OOB = (x > 1000 || x < 0 || y > 1000 || y < 0);

      if (!started) {
        points.push('M' + x + ' ' + y);
        started = true;
        continue;
      }

      if (prevOOB && OOB) {
        points.push('M' + x + ' ' + y);
      } else {
        points.push('L' + x + ' ' + y);
      }

      prevOOB = OOB;
		}

		return points;
	},

  draw() {
		return new Promise((resolve, reject) => {
			let curve = curves[this.selected];

			let points = this.computeCurve(curve);
      this.spath.setAttribute("d", points.join(' '));
      this.eq.style.display = 'block';
      katex.render(curve.equation, eq, {displayMode: false});
      this.animatePath();
      resolve();
    });
  },

  animatePath() {
    let length = this.spath.getTotalLength();
    this.spath.setAttribute("stroke-width", "2");
    this.spath.style.transition = 'none';
    this.spath.style.strokeDasharray = length + ' ' + length;
    this.spath.style.strokeDashoffset = length;
    this.spath.getBoundingClientRect();
    this.spath.style.transition = 'stroke-dashoffset 3s ease-in-out';
    this.spath.style.strokeDashoffset = 0;
  }
};

window.onload = function () {
  control.initialize();
  //console.log(control);
}

