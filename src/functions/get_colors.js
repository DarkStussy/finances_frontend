export function generateColors(steps) {
    if(steps === 1)
        return ["rgba(255, 74, 74, 0.7)"]

    const start = [255, 74, 74, 0.7];
    const end = [74, 255, 128,  0.7];
    const stepFactor = 1 / (steps - 1);
    const colors = [];

    for (let i = 0; i < steps; i++) {
        const rgb = start.map((value, index) =>
            Math.round(value + (end[index] - value) * (stepFactor * i))
        );
        colors.push(`rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`);
    }

    return colors;
}