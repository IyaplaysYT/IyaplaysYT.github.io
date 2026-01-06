const BACKGROUND_COLOR = 'grey';
const POINT_COLOR = 'white';

const FIELD_WIDTH = 600;
const FIELD_HEIGHT = 600;

const field = document.getElementById('field');

const positionXInput = document.getElementById('position_x');
const positionYInput = document.getElementById('position_y');
const positionZInput = document.getElementById('position_z');

const rotationXInput = document.getElementById('rotation_x');
const rotationYInput = document.getElementById('rotation_y');
const rotationZInput = document.getElementById('rotation_z');

const dropbox = document.getElementById('shape_type');


let positionX = parseFloat(document.getElementById('position_x').valueAsNumber);
let positionY = parseFloat(document.getElementById('position_y').valueAsNumber);
let positionZ = parseFloat(document.getElementById('position_z').valueAsNumber);

let rotationX = parseFloat(document.getElementById('rotation_x').valueAsNumber * Math.PI / 180);
let rotationY = parseFloat(document.getElementById('rotation_y').valueAsNumber * Math.PI / 180);
let rotationZ = parseFloat(document.getElementById('rotation_z').valueAsNumber * Math.PI / 180);

const fields = [positionXInput, positionYInput, positionZInput, rotationXInput, rotationYInput, rotationZInput];

for (const f of fields) {
	f.addEventListener('input', () => {
		positionX = parseFloat(positionXInput.valueAsNumber);
		positionY = parseFloat(positionYInput.valueAsNumber);
		positionZ = parseFloat(positionZInput.valueAsNumber);
		rotationX = parseFloat(rotationXInput.valueAsNumber * Math.PI / 180);
		rotationY = parseFloat(rotationYInput.valueAsNumber * Math.PI / 180);
		rotationZ = parseFloat(rotationZInput.valueAsNumber * Math.PI / 180);
	});
}

console.log(field);
field.width = FIELD_WIDTH;
field.height = FIELD_HEIGHT;
const ctx = field.getContext('2d');
console.log(ctx);

function point({x, y}) {
	const s = 5;
	ctx.fillStyle = POINT_COLOR;
	ctx.fillRect(x - s/2, y - s/2, s, s);
}

function line(p1, p2) {
	ctx.strokeStyle = POINT_COLOR;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

function screen(p) {
	// this function converts from normalized device coordinates to screen coordinates
	return {
		x: (p.x + 1) / 2 * field.width,
		y: (1 - (p.y + 1) / 2) * field.height,
	}
}

function project({x, y, z}) {
	const near = 0.01;
	const zz = Math.max(z, near);
	return {
		x: x/zz,
		y: y/zz,
	}
}

function clear() {
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, field.width, field.height);
}

const cube_verts = [
	{x: 0.5, y: 0.5, z: 0.5},
	{x: -0.5, y: 0.5, z: 0.5},
	{x: -0.5, y: -0.5, z: 0.5},
	{x: 0.5, y: -0.5, z: 0.5},
	
	{x: 0.5, y: 0.5, z: -0.5},
	{x: -0.5, y: 0.5, z: -0.5},
	{x: -0.5, y: -0.5, z: -0.5},
	{x: 0.5, y: -0.5, z: -0.5},
];

const cube_faces = [
	[0, 1, 2, 3],
	[4, 5, 6, 7],
	[0, 1, 5, 4],
	[2, 3, 7, 6],
	[1, 2, 6, 5],
	[0, 3, 7, 4],
];

const pyramid_verts = [
	{x: 0.5, y: -0.5, z: 0.5},
	{x: 0.5, y: -0.5, z: -0.5},
	{x: -0.5, y: -0.5, z: -0.5},
	{x: -0.5, y: -0.5, z: 0.5},
	
	{x: 0, y: 0.5, z: 0},
];

const pyramid_faces = [
	[0, 1, 2, 3],
	[0, 1, 4],
	[1, 2, 4],
	[2, 3, 4],
	[3, 0, 4],
];

var vertices = pyramid_verts;
var faces = pyramid_faces;

if (dropbox) {
	dropbox.addEventListener('change', () => {
		const shapeType = dropbox.value;
		if (shapeType === 'cube') {
			vertices = cube_verts;
			faces = cube_faces;
		} else if (shapeType === 'pyramid') {
			vertices = pyramid_verts;
			faces = pyramid_faces;
		}
	});
}

function translate({x, y, z}, {dx, dy, dz}) {
	return {x: x + dx, y: y + dy, z: z + dz};
}

function rotateX({x, y, z}, angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: x,
		y: y * cos - z * sin,
		z: y * sin + z * cos
	};
}

function rotateY({x, y, z}, angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: x * cos - z * sin,
		y: y,
		z: x * sin + z * cos
	};
}

function rotateZ({x, y, z}, angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		x: x * cos - y * sin,
		y: x * sin + y * cos,
		z: z
	};
}

function rotate({x, y, z}, {anglex, angley, anglez}) {
	let p = {x, y, z};
	p = rotateX(p, anglex);
	p = rotateY(p, angley);
	p = rotateZ(p, anglez);
	return p;
}

let anglex = 0;
let angley = 0;
let anglez = 0;
let lastTime = 0;

function frame(time) {
	const dt = (time - lastTime) / 1000 || 0;
	lastTime = time;

	anglex += rotationX * dt;
	angley += rotationY * dt;
	anglez += rotationZ * dt;

	clear();


	for (const v of vertices) {
		point(screen(project(translate(rotate(v, {anglex: anglex, angley: angley, anglez: anglez}), {dx: positionX, dy: positionY, dz: positionZ}))));
	}
	for (const f of faces) {
		for (let i = 0; i < f.length; i++) {
			const v1 = vertices[f[i]];
			const v2 = vertices[f[(i + 1) % f.length]];
			line(
				screen(project(translate(rotate(v1, {anglex: anglex, angley: angley, anglez: anglez}), {dx: positionX, dy: positionY, dz: positionZ}))),
				screen(project(translate(rotate(v2, {anglex: anglex, angley: angley, anglez: anglez}), {dx: positionX, dy: positionY, dz: positionZ})))
			);
		}
	}

	requestAnimationFrame(frame);
}
requestAnimationFrame(frame);