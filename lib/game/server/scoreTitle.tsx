import levenshtein from "damerau-levenshtein";

export function scoreTitle(guessTitle: string | null, correctTitle: string | null) {

    if (!correctTitle) {
        return 1;
    }

    if (!guessTitle) {
        return 0;
    }

    const { similarity } = levenshtein(guessTitle.toLowerCase(), correctTitle.toLowerCase());

    if (similarity >= 0.75) {
        return 1;
    } else {
        return similarity;
    }

}