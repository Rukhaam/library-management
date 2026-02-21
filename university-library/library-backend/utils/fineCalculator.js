// utils/fineCalculator.js

/**
 * Calculates the late fee based on the due date.
 * @param {Date|string} dueDate - The date the book was due.
 * @param {number} ratePerDay - The fine amount per day (default is 5).
 * @returns {number} - The total calculated fine.
 */
export const calculateFine = (dueDate, ratePerDay = 5) => {
    let fine = 0;
    
    // Convert to Date objects and strip the time so we only compare the exact day
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If today is past the due date, calculate the difference
    if (today > due) {
        const diffTime = today - due; // Time difference in milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
        fine = diffDays * ratePerDay;
    }

    return fine;
};