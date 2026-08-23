/**
 * Calculate Weighted Quality Rating Score & Star Rating
 * @param {Array} scores Array of { category, weightPercent, score }
 * @returns {Object} { totalWeightedScore, starRating }
 */
const calculateRating = (scores) => {
    let totalWeightedScore = 0;

    scores.forEach((item) => {
        // Score is 1 to 5, normalized to percentage of its weight
        const categoryContribution = (item.score / 5) * item.weightPercent;
        totalWeightedScore += categoryContribution;
    });

    // Round total score to 2 decimal places
    totalWeightedScore = Math.round(totalWeightedScore * 100) / 100;

    // Star Rating Mapping
    let starRating = 1;
    if (totalWeightedScore >= 90) {
        starRating = 5;
    } else if (totalWeightedScore >= 75) {
        starRating = 4;
    } else if (totalWeightedScore >= 60) {
        starRating = 3;
    } else if (totalWeightedScore >= 45) {
        starRating = 2;
    } else {
        starRating = 1;
    }

    return {
        totalWeightedScore,
        starRating,
    };
};

module.exports = { calculateRating };
