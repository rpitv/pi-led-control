import Curves from "./Curves";

const sigFig = 5;
// Offset is used because many of these tests are around points of discontinuity.
//  This offset is intentionally larger than the number of sig figs measured.
const offset = 0.001;

/**************
 *   Square   *
 **************/

it("Correctly handles square function at frequency == 1", () => {
    const square = Curves.Square(1);
    expect(square(0)).toBeCloseTo(0, sigFig);
    expect(square(offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI - offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI + offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI + offset)).toBeCloseTo(0, sigFig);
});

it("Correctly handles square function at frequency > 1", () => {
    const square = Curves.Square(3);
    expect(square(0)).toBeCloseTo(0, sigFig);
    expect(square(offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI / 3 - offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI / 3 + offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI / 3 + offset)).toBeCloseTo(0, sigFig);
});

it("Correctly handles square function at 0 < frequency < 1", () => {
    const square = Curves.Square(1 / 60);
    expect(square(0)).toBeCloseTo(0, sigFig);
    expect(square(offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI * 60 - offset)).toBeCloseTo(1, sigFig);
    expect(square(Math.PI * 60 + offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI * 60 + offset)).toBeCloseTo(0, sigFig);
});

it("Correctly handles square function at frequency == 0", () => {
    const square = Curves.Square(0);
    expect(square(0)).toBeCloseTo(0, sigFig);
    expect(square(offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI - offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI + offset)).toBeCloseTo(0, sigFig);
    expect(square(Math.PI + offset)).toBeCloseTo(0, sigFig);
});

/****************
 *   Sawtooth   *
 ****************/

it("Correctly handles sawtooth function at frequency == 1", () => {
    const sawtooth = Curves.Sawtooth(1);
    expect(sawtooth(0)).toBeCloseTo(0, sigFig);
    expect(sawtooth(offset)).toBeCloseTo(offset, sigFig);
    expect(sawtooth(3 - offset)).toBeCloseTo(1 - offset, sigFig);
    expect(sawtooth(3 + offset)).toBeCloseTo(offset, sigFig);
    expect(sawtooth(1000 + offset)).toBeCloseTo(offset, sigFig);
});

it("Correctly handles sawtooth function at frequency > 1", () => {
    const sawtooth = Curves.Sawtooth(4);
    expect(sawtooth(0)).toBeCloseTo(0, sigFig);
    expect(sawtooth(offset)).toBeCloseTo(offset * 4, sigFig);
    expect(sawtooth(3 - offset)).toBeCloseTo(1 - offset * 4, sigFig);
    expect(sawtooth(3 + offset)).toBeCloseTo(offset * 4, sigFig);
    expect(sawtooth(1000 + offset)).toBeCloseTo(offset * 4, sigFig);
});

it("Correctly handles sawtooth function at 0 < frequency < 1", () => {
    const sawtooth = Curves.Sawtooth(1 / 4);
    expect(sawtooth(0)).toBeCloseTo(0, sigFig);
    expect(sawtooth(offset)).toBeCloseTo(offset / 4, sigFig);
    expect(sawtooth(3 - offset)).toBeCloseTo(3 / 4 - offset / 4, sigFig);
    expect(sawtooth(3 + offset)).toBeCloseTo(3 / 4 + offset / 4, sigFig);
    expect(sawtooth(6 + offset)).toBeCloseTo(1 / 2 + offset / 4, sigFig);
});

it("Correctly handles sawtooth function at frequency == 0", () => {
    const sawtooth = Curves.Sawtooth(0);
    expect(sawtooth(0)).toBeCloseTo(0, sigFig);
    expect(sawtooth(offset)).toBeCloseTo(0, sigFig);
    expect(sawtooth(3 - offset)).toBeCloseTo(0, sigFig);
    expect(sawtooth(3 + offset)).toBeCloseTo(0, sigFig);
    expect(sawtooth(1000 + offset)).toBeCloseTo(0, sigFig);
});

/************
 *   Sine   *
 ************/

it("Correctly handles sine function at frequency == 1", () => {
    const sine = Curves.Sine(1);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(Math.PI / 2)).toBeCloseTo(1, sigFig);
    expect(sine(40)).toBeCloseTo(0.872556, sigFig);
    expect(sine((3 / 2) * Math.PI)).toBeCloseTo(0, sigFig);
    expect(sine(Math.PI + offset)).toBeCloseTo(0.4995, sigFig);
});

it("Correctly handles sine function at frequency > 1", () => {
    const sine = Curves.Sine(5);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(Math.PI / 2)).toBeCloseTo(1, sigFig);
    expect(sine(40)).toBeCloseTo(0.063351, sigFig);
    expect(sine((3 / 2) * Math.PI)).toBeCloseTo(0, sigFig);
    expect(sine(Math.PI + offset)).toBeCloseTo(0.4975, sigFig);
});

it("Correctly handles sine function at 0 < frequency < 1", () => {
    const sine = Curves.Sine(1 / 11);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(Math.PI / 2)).toBeCloseTo(0.571157, sigFig);
    expect(sine(40)).toBeCloseTo(0.262584, sigFig);
    expect(sine((3 / 2) * Math.PI)).toBeCloseTo(0.707707, sigFig);
    expect(sine(Math.PI + offset)).toBeCloseTo(0.640909, sigFig);
});

it("Correctly handles sine function at frequency == 0", () => {
    const sine = Curves.Sine(0);
    expect(sine(0)).toBeCloseTo(0.5, sigFig);
    expect(sine(Math.PI / 2)).toBeCloseTo(0.5, sigFig);
    expect(sine(40)).toBeCloseTo(0.5, sigFig);
    expect(sine((3 / 2) * Math.PI)).toBeCloseTo(0.5, sigFig);
    expect(sine(Math.PI + offset)).toBeCloseTo(0.5, sigFig);
});
