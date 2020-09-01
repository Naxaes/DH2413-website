class Complex {
	constructor(re, im) {
		this.re = re;
		this.im = im;
	}

	mul(other) {
		const re = this.re * other.re - this.im * other.im;
		const im = this.re * other.im + this.im * other.re;

		return new Complex(re, im);
	}

	add(other) {
		const re = this.re + other.re;
		const im = this.im + other.im;

		return new Complex(re, im);
	}
}



/**
Discrete Fourier Transform:
	x : Complex number signal of size N
	k : Frequency

	X_k = ∑ {N-1, n = 0} x_n * [cos(2πkn / N) - i * sin(2πkn / N)]
*/
function dft2(signal) {
	let X = [];

	const N = signal.length;
	
	for (var k = 0; k < N; k++) {

		let sum = new Complex(0, 0);

		for (var n = 0; n < N; n++) {
			const phi = (TWO_PI * k * n) / N;

			const c = new Complex(cos(phi), -sin(phi));

			sum = sum.add(signal[n].mul(c));
		}

		sum.re = sum.re / N;
		sum.im = sum.im / N;

		const frequency = k;
		const amplitude = sqrt(sum.re*sum.re + sum.im*sum.im);
		const phase 	= atan2(sum.im, sum.re);

		X[k] = { re: sum.re, im: sum.im, frequency, amplitude, phase};
	}

	return X;
}


/**
Discrete Fourier Transform:
	x : Scalar signal of size N
	k : Frequency

	X_k = ∑ {N-1, n = 0} x_n * [cos(2πkn / N) - i * sin(2πkn / N)]

*/
function dft(signal) {
	let X = [];

	const N = signal.length;
	
	for (var k = 0; k < N; k++) {

		let re = 0;
		let im = 0;

		for (var n = 0; n < N; n++) {
			let phi = (TWO_PI * k * n) / N;

			re += signal[n] * cos(phi);
			im -= signal[n] * sin(phi);
		}

		re = re / N;
		im = im / N;

		const frequency = k;
		const amplitude = sqrt(re*re + im*im);
		const phase = atan2(im, re);

		X[k] = {re, im, frequency, amplitude, phase};
	}

	return X;
}