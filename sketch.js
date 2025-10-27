/*
By Okazz
*/
let colors = ['#f71735', '#067bc2', '#FFC247', '#3BD89F', '#81cfe5', '#f654a9', '#2F0A30'];
let ctx;
let centerX, centerY;
let strollers = [];
// 新增：隱藏選單變數
let menuDiv, menuButton;
let menuOpen = false;

function setup() {
    createCanvas(900, 900);
    rectMode(CENTER);
    colorMode(HSB, 360, 100, 100, 100);
    ctx = drawingContext;
    centerX = width / 2;
    centerY = height / 2;
    for (let i = 0; i < 21; i++) {
        let x = random(width);
        let y = random(width);
        strollers.push(new Wisp(x, y, width * random(0.05, 0.09), colors[i % colors.length]));
    }

    // 新增：建立左側隱藏式選單
    menuDiv = createDiv();
    menuDiv.style('position', 'fixed');
    menuDiv.style('top', '0');
    menuDiv.style('left', '-280px'); // 隱藏在畫面外
    menuDiv.style('width', '260px');
    menuDiv.style('height', '100vh');
    menuDiv.style('background', 'rgba(20,20,30,0.95)');
    menuDiv.style('color', '#fff');
    menuDiv.style('padding', '24px 16px');
    menuDiv.style('box-shadow', '2px 0 10px rgba(0,0,0,0.5)');
    menuDiv.style('z-index', '1000');
    menuDiv.style('transition', 'left 0.28s ease');

    let title = createElement('h3', '選單');
    title.parent(menuDiv);
    title.style('margin', '0 0 12px 0');
    title.style('padding', '0');
    title.style('font-family', 'sans-serif');
    title.style('color', '#fff');

    let items = [
        { label: '第一單元的作品', href: '#works' },
        { label: '第一單元講義', href: '#notes' },
        { label: '測驗系統', href: '#quiz' },
        { label: '回到首頁', href: '/' }
    ];

    for (let it of items) {
        let el = createElement('div', it.label);
        el.parent(menuDiv);
        el.style('padding', '10px 8px');
        el.style('margin', '6px 0');
        el.style('cursor', 'pointer');
        el.style('border-radius', '6px');
        el.style('font-family', 'sans-serif');
        el.style('background', 'transparent');
        el.style('transition', 'background 0.15s');
        el.mouseOver(() => el.style('background', 'rgba(255,255,255,0.06)'));
        el.mouseOut(() => el.style('background', 'transparent'));
        el.mousePressed(() => {
            // 預設行為：導向 href（可依需求改為實際頁面）
            window.location.href = it.href;
        });
    }

    // 新增：漢堡按鈕（頂端左側）
    menuButton = createDiv('☰');
    menuButton.style('position', 'fixed');
    menuButton.style('top', '12px');
    menuButton.style('left', '12px');
    menuButton.style('width', '44px');
    menuButton.style('height', '44px');
    menuButton.style('line-height', '44px');
    menuButton.style('text-align', 'center');
    menuButton.style('background', 'rgba(255,255,255,0.9)');
    menuButton.style('color', '#111');
    menuButton.style('border-radius', '6px');
    menuButton.style('cursor', 'pointer');
    menuButton.style('z-index', '1001');
    menuButton.style('font-size', '20px');
    menuButton.style('box-shadow', '0 2px 6px rgba(0,0,0,0.25)');
    menuButton.mousePressed(toggleMenu);
}

function draw() {
	background('#fafaff');


	for (let s of strollers) {
		s.run();
	}


	for (let i = 0; i < strollers.length; i++) {
		let c1 = strollers[i];
		for (let j = i + 1; j < strollers.length; j++) {
			let c2 = strollers[j];
			let dx = c2.x - c1.x;
			let dy = c2.y - c1.y;
			let distance = sqrt(dx * dx + dy * dy);
			let minDist = c1.d + c2.d;

			if (distance < minDist && distance > 0) {
				let force = (minDist - distance) * 0.001;
				let nx = dx / distance;
				let ny = dy / distance;
				c1.vx -= force * nx;
				c1.vy -= force * ny;
				c2.vx += force * nx;
				c2.vy += force * ny;
			}
		}
	}


}

function aetherLink(x1, y1, d1, x2, y2, d2, dst) {
	let r = dst / 2;
	let r1 = d1 / 2;
	let r2 = d2 / 2;
	let R1 = r1 + r;
	let R2 = r2 + r;
	let dx = x2 - x1;
	let dy = y2 - y1;
	let d = sqrt(dx * dx + dy * dy);
	if (d > R1 + R2) {
		return;
	}
	let dirX = dx / d;
	let dirY = dy / d;
	let a = (R1 * R1 - R2 * R2 + d * d) / (2 * d);
	let underRoot = R1 * R1 - a * a;
	if (underRoot < 0) return;
	let h = sqrt(underRoot);
	let midX = x1 + dirX * a;
	let midY = y1 + dirY * a;
	let perpX = -dirY * h;
	let perpY = dirX * h;
	let cx1 = midX + perpX;
	let cy1 = midY + perpY;
	let cx2 = midX - perpX;
	let cy2 = midY - perpY;

	if (dist(cx1, cy1, cx2, cy2) < r * 2) {
		return;
	}

	let ang1 = atan2(y1 - cy1, x1 - cx1);
	let ang2 = atan2(y2 - cy1, x2 - cx1);
	let ang3 = atan2(y2 - cy2, x2 - cx2);
	let ang4 = atan2(y1 - cy2, x1 - cx2);

	if (ang2 < ang1) {
		ang2 += TAU;
	}

	beginShape();
	for (let i = ang1; i < ang2; i += TAU / 180) {
		vertex(cx1 + r * cos(i), cy1 + r * sin(i));
	}

	if (ang4 < ang3) {
		ang4 += TAU;
	}
	for (let i = ang3; i < ang4; i += TAU / 180) {
		vertex(cx2 + r * cos(i), cy2 + r * sin(i));
	}
	endShape(CLOSE);
}

class Wisp {
	constructor(x, y, d, c) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.vx = random(-1, 1) * width * 0.001;
		this.vy = random(-1, 1) * width * 0.001;
		this.ang = 0;
		this.rnd = random(10000);
		this.circles = [];
		this.timer = 0;
		this.color = c;
		this.angle = 0;
		this.pp = createVector(this.x, this.y);
	}

	show() {
		noStroke();
		fill(this.color);
		for (let c of this.circles) {
			c.run();
		}
		for (let i = 0; i < this.circles.length; i++) {
			let c = this.circles[i];
			if (c.isDead) {
				this.circles.splice(0, 1);
			}
			aetherLink(this.x, this.y, this.d, c.x, c.y, c.d, this.d * 0.2);
			for (let j = 0; j < this.circles.length; j++) {
			}
		}



		push();
		translate(this.x, this.y);
		rotate(this.angle);
		circle(0, 0, this.d);

		translate(this.d * 0.15, 0);
		rotate(-this.angle);
		fill('#ffffff');
		ellipse(-this.d * 0.22, -this.d * 0.02, this.d * 0.125, this.d * 0.15);
		ellipse(this.d * 0.22, -this.d * 0.02, this.d * 0.125, this.d * 0.15);
		ellipse(0, this.d * 0.05, this.d * 0.07, this.d * 0.09);
		
		pop();
	}

	update() {


		this.x += this.vx;
		this.y += this.vy;

		let r = this.d / 2
		if (this.x <= r || width - r <= this.x) {
			this.vx *= -1;
		}
		if (this.y <= r || height - r <= this.y) {
			this.vy *= -1;
		}

		this.x = constrain(this.x, r, width - r);
		this.y = constrain(this.y, r, height - r);


		if ((this.timer % 30) == 0) {
			this.circles.push(new Circle(this.x, this.y, this.d))
		}

		this.timer++;

		this.angle = atan2(this.y - this.pp.y, this.x - this.pp.x);
		this.pp = createVector(this.x, this.y);
	}

	run() {
		this.show();
		this.update();
	}
}


class Circle {
	constructor(x, y, d) {
		this.x = x;
		this.y = y;
		this.d = d;
		this.decrease = width * 0.0015;
		this.isDead = false;
		this.vx = random(-1, 1) * width * 0.0008;
		this.vy = random(-1, 1) * width * 0.0008;
	}

	show() {
		circle(this.x, this.y, this.d);
	}

	update() {
		this.d -= this.decrease;
		if (this.d < 0) {
			this.isDead = true;
		}
		this.d = constrain(this.d, 0, width);
		this.x += this.vx;
		this.y += this.vy;
	}

	run() {
		this.show();
		this.update();
	}
}

// 新增：切換選單顯示狀態
function toggleMenu() {
    if (menuOpen) {
        menuDiv.style('left', '-280px');
        menuOpen = false;
    } else {
        menuDiv.style('left', '0px');
        menuOpen = true;
    }
}