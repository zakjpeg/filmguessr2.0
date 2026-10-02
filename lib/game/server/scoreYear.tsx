export function scoreYear(guessYear: number | null, correctYear: number | null) {

    if (!correctYear) {
        return 1;
    }

    if (!guessYear) {
        return 0;
    }

    const diff = Math.abs(correctYear - guessYear);

    return Math.max( (1 - (diff/10)) , 0)

}