
curves.canvas = document.getElementById('canvas');
curves.cancon = document.getElementById('con');
curves.eq = document.getElementById('eq');
curves.ctx = curves.canvas.getContext('2d');
curves.animopts = [ {transform: 'translateX(0)'}, {transform: 'translateX(-120%)'}, {duration: 150, fill: 'forwards'} ];

curves.initializeMenu = function initializeMenu() {
  const tiles = document.getElementById('tiles');
  let frag = document.createDocumentFragment();
  Object.entries(this.meta).forEach(([name, obj]) => {
    let p = document.createElement('div');
    p.textContent = obj.title;
    p.className = 'parent';
    p.setAttribute('id', name);
    p.addEventListener('click', this.curveClicked.bind(this), false);
    frag.appendChild(p);
  });
  tiles.appendChild(frag);
}

curves.curveClicked = function curveClicked(e) {
  e.stopPropagation();
  let item = e.currentTarget;
console.log(item)
  let prev = document.querySelector('.selected');
  if (prev) prev.className = 'parent';
  item.className = 'selected';
  this.slideOut()
    .then(this.drawCurve(curves.meta[item.id]))
    .then(this.slideIn())
    .catch(e => console.warn(item, e);
}

curves.slideOut = async function() {
  //let kf = [{transform: 'translateX(0)'}, {transform: 'translateX(-120%)'}];
  //let opts = {duration: 150, fill: 'forwards'}
  let hide = this.cancon.animate([this.ao[0], this.ao[1]], this.ao[2]);
  return await hide.finished;
}

curves.slideIn = async function() {
  //let kf = [{transform: 'translateX(-120%)'}, {transform: 'translateX(0)'}];
  //let opts = {duration: 150, fill: 'forwards'};
  let show = this.cancon.animate([this.ao[1], this.ao[0]], this.ao[2]);
  return await show.finished
}

curves.drawCurve = async function(curve) {
console.log('drawCurve: ', curve)
  let cx = this.ctx;
  cx.save()
  this.eq.style.display = 'block';
  cx.clearRect(0,0,1000,1000);
  cx.drawImage(curve.bg, 0, 0, 1000, 1000);
  this.cancon.style.borderRadius = (curve instanceof Parametric) ? 0 : '100%';
  this.canvas.style.borderRadius = (curve instanceof Parametric) ? 0 : '100%';
  let tos, los, started = false;
  return new Promise((resolve, reject) => {
    cx.beginPath();
    for (let s = curve.min; s <= curve.max; s += 0.01) {
      let x, y;
      ({x, y} = curve.draw(s));
      x = ((x+10)/20)*1000;
      y = ((10-y)/20)*1000;
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
      los = tos;
    }
    cx.shadowColor = cx.strokeStyle = (curve instanceof Parametric) ? 'green' : 'red';
    cx.lineWidth = 2;
    cx.shadowBlur = 1;
    cx.lineCap = cx.lineJoin = 'round';
    cx.stroke();
    katex.render(curve.equation, eq, {displayMode: false});
    cx.restore();
    resolve(curve.title, x, y);
  }
}

window.onload = function () {
  curves.initializeMenu();
}
