const BACKGROUND_COLOR = 'grey';
const POINT_COLOR = 'white';

const FIELD_WIDTH = 600;
const FIELD_HEIGHT = 600;

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
	return {
		x: x/z,
		y: y/z,
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

const vertices = pyramid_verts;
const faces = pyramid_faces;


function translate({x, y, z}, {dx, dy, dz}) {
	return {x: x + dx, y: y + dy, z: z + dz};
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

const FPS = 60;
let dz = 2;
let angle = 0;

function frame() {
	const dt = 1/FPS;
	// dz += 1*dt;
	angle += Math.PI/2 * dt;
	clear();


	for (const v of vertices) {
		point(screen(project(translate(rotateY(v, angle), {dx: 0, dy: Math.sin(angle*2)/4, dz: dz}))));
	}
	for (const f of faces) {
		for (let i = 0; i < f.length; i++) {
			const v1 = vertices[f[i]];
			const v2 = vertices[f[(i + 1) % f.length]];
			line(
				screen(project(translate(rotateY(v1, angle), {dx: 0, dy: Math.sin(angle*2)/4, dz: dz}))),
				screen(project(translate(rotateY(v2, angle), {dx: 0, dy: Math.sin(angle*2)/4, dz: dz})))
			);
		}
	}

	setTimeout(frame, 1000/FPS);
}
setTimeout(frame, 1000/FPS);