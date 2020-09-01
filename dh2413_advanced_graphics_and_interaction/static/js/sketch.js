let time     = 0;
let path     = [];
let signalX  = [];
let signalY  = [];
let drawing  = [];
let signal   = [];

let fourierX;
let fourierY;
let fourierC;

const DRAWING_STATE = 0;
const RENDER_STATE  = 1;
let state = RENDER_STATE;

const ONE_AXIS_STATE = 0;
const TWO_AXIS_STATE = 1;
let axis_state = TWO_AXIS_STATE;


function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
}


function createFourierSeries(drawing) {
    if (axis_state === ONE_AXIS_STATE) {
        for (var i = 0; i < drawing.length; i++) {
            const re = drawing[i].x;
            const im = drawing[i].y;
            signal[i] = new Complex(re, im);
        }

        fourierC = dft2(signal);
        fourierC.sort((a, b) => b.amplitude - a.amplitude);
    } else {
        for (var i = 0; i < drawing.length; i++) {
            signalX[i] = drawing[i].x;
            signalY[i] = drawing[i].y;
        }

        fourierX = dft(signalX);
        fourierY = dft(signalY);
        fourierX.sort((a, b) => b.amplitude - a.amplitude);
        fourierY.sort((a, b) => b.amplitude - a.amplitude);
    }
}


function mousePressed() {
    if (0 <= mouseX && mouseX <= windowWidth &&
        0 <= mouseY && mouseY <= windowHeight) {
        time    = 0;
        state   = DRAWING_STATE;
        signalX = [];
        signalY = [];
        signal  = [];
        path    = [];
        drawing = [];
    }
}

function mouseReleased() {
    state = RENDER_STATE;
    createFourierSeries(drawing);
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    textSize(14);

    createFourierSeries([{x: windowWidth/10.0, y: windowHeight/10.0}]);
}


function drawEpicycles(x, y, rotation, fourier, samples = Infinity) {
    stroke(255, 100);
    noFill();

    samples = min(fourier.length, samples);

    for (let i = 0; i < samples; i++) {
        const x0 = x;
        const y0 = y;

        const frequency = fourier[i].frequency;
        const amplitude = fourier[i].amplitude;
        const phase = fourier[i].phase;

        x += amplitude * cos(frequency * time + phase + rotation);
        y += amplitude * sin(frequency * time + phase + rotation);

        // Orbital path.
        ellipse(x0, y0, amplitude * 2);

        // Line from center to point.
        line(x0, y0, x, y);
    }

    return createVector(x, y);
}


function drawTwoScalarFourier(posX, posY, fourierX, fourierY, samples) {
    const v0 = drawEpicycles(posX.x, posX.y, 0, fourierX, samples);
    const x0 = v0.x;
    const y0 = v0.y;

    const v1 = drawEpicycles(posY.x, posY.y, HALF_PI, fourierY, samples);
    const x1 = v1.x;
    const y1 = v1.y;

    stroke(255);
    line(x0, y0, x0, y1);
    line(x1, y1, x0, y1);

    return createVector(x0, y1);
}


function drawPath(path, v, maxSize) {
    stroke(255);
    path.unshift(v);

    noFill();
    beginShape();
    for (let i = 0; i < path.length; i++) {
        const v = path[i];
        vertex(v.x, v.y);
    }
    endShape();

    while (path.length > maxSize) {
        path.pop();
    }
}


function draw() {
    background(0);

    const epiCycle1Offset = windowWidth  / 2;
    const epiCycle2Offset = windowHeight / 2;

    if (state === DRAWING_STATE) {
        drawing.push(createVector(mouseX - epiCycle1Offset, mouseY - epiCycle2Offset));

        noFill();
        stroke(255);
        beginShape();
        for (let v of drawing) {
            vertex(v.x + epiCycle1Offset, v.y + epiCycle2Offset);
        }
        endShape();

    } else if (state === RENDER_STATE) {

        let v;
        let count;
        if (axis_state === ONE_AXIS_STATE) {
            count = fourierC.length;
            v = drawEpicycles(epiCycle1Offset, epiCycle2Offset, 0, fourierC);
        } else {
            count = fourierX.length;
            posX = createVector(epiCycle1Offset, 100);
            posY = createVector(100, epiCycle2Offset);
            v = drawTwoScalarFourier(posX, posY, fourierX, fourierY);
        }

        drawPath(path, v, count);

        const dt = TWO_PI / count;
        time += dt;
    }
}
