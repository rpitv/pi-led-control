import Curves from "./Curves";

const sigFig = 5;
// Offset is used because many of these tests are around points of discontinuity.
//  This offset is intentionally larger than the number of sig figs measured.
const offset = 0.001;

/**************
 *   Square   *
 **************/

// 15ms period is considered the minimum, as anything lower isn't necessarily
//  reliable due to how the event loop operates.
const period = 15;
it("Correctly handles square function at period " + period + "ms", () => {
    const square = Curves.Square(period);
    expect(square(0 - offset)).toBeCloseTo(0, sigFig);
    expect(square(offset)).toBeCloseTo(1, sigFig);
    expect(square(period - offset)).toBeCloseTo(1, sigFig);
    expect(square(3 * period + offset)).toBeCloseTo(0, sigFig);
    expect(square(3 * period + offset)).toBeCloseTo(0, sigFig);
});

it("Correctly handles square function at period -" + period + "ms", () => {
    const square = Curves.Square(-period);
    expect(square(period - offset)).toBeCloseTo(0, sigFig);
    expect(square(3 * period + offset)).toBeCloseTo(1, sigFig);
    expect(square(3 * period + offset)).toBeCloseTo(1, sigFig);
});

it("Correctly handles square function at period 0ms", () => {
    expect(() => {
        Curves.Square(0);
    }).toThrow(Error);
});

/****************
 *   Sawtooth   *
 ****************/

it("Correctly handles sawtooth function at period " + period + "ms", () => {
    const sawtooth = Curves.Sawtooth(period);
    expect(sawtooth(0)).toBeCloseTo(0, sigFig);
    expect(sawtooth(offset * period)).toBeCloseTo(offset, sigFig);
    expect(sawtooth((3 - offset) * period)).toBeCloseTo(1 - offset, sigFig);
    expect(sawtooth((3 + offset) * period)).toBeCloseTo(offset, sigFig);
    expect(sawtooth((1000 + offset) * period)).toBeCloseTo(offset, sigFig);
});

it("Correctly handles sawtooth function at period -" + period + "ms", () => {
    const sawtooth = Curves.Sawtooth(-period);
    expect(sawtooth((3 - offset) * period)).toBeCloseTo(1 - offset, sigFig);
    expect(sawtooth((3 + offset) * period)).toBeCloseTo(offset, sigFig);
    expect(sawtooth((1000 + offset) * period)).toBeCloseTo(offset, sigFig);
});

it("Correctly handles sawtooth function at period 0ms", () => {
    expect(() => {
        Curves.Sawtooth(0);
    }).toThrow(Error);
});

/************
 *   Sine   *
 ************/

it("Correctly handles sine function at period " + period + "ms", () => {
    const sine = Curves.Sine(period);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(period / 4)).toBeCloseTo(1, sigFig);
    expect(sine(period * 24.123)).toBeCloseTo(0.849082, sigFig);
    expect(sine(period * 1.75)).toBeCloseTo(0, sigFig);
    expect(sine((1 + offset) * period)).toBeCloseTo(0.503141, sigFig);
});

it("Correctly handles sine function at period -" + period + "ms", () => {
    const sine = Curves.Sine(-period);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(period / 4)).toBeCloseTo(0, sigFig);
    expect(sine(period * 24.123)).toBeCloseTo(0.150917, sigFig);
    expect(sine(period * 1.75)).toBeCloseTo(1, sigFig);
    expect(sine((1 + offset) * period)).toBeCloseTo(0.496858, sigFig);
});

it("Correctly handles sine function at period 0ms", () => {
    expect(() => {
        Curves.Sine(0);
    }).toThrow(Error);
});
