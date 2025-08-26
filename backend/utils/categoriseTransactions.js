export function categoriseTransactions(description, type) {
    const desc = description.toLowerCase();

    // income
    if (desc.includes("salary") || desc.includes("payroll") || desc.includes("credited")) {
        return "salary";
    }
    if (desc.includes("refund")) {
        return "refund";
    }

    // expenses
    if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("prime")) {
        return "subscriptions";
    }
    if (desc.includes("zomato") || desc.includes("swiggy") || desc.includes("pizza") || desc.includes("restaurant")) {
        return "food & dining";
    }
    if (desc.includes("uber") || desc.includes("ola") || desc.includes("cab") || desc.includes("fuel") || desc.includes("train") || desc.includes("metro") || desc.includes("IRCTC")) {
        return "transport";
    }
    if (desc.includes("bookmyshow") || desc.includes("PVR Cinemas") || desc.includes("INOX") || desc.includes("Cinepolis") || desc.includes("Multiplex")) {
        return "entertainment";
    }
    if (desc.includes("amazon") || desc.includes("flipkart") || desc.includes("myntra") || desc.includes("store") || desc.includes("shopping")) {
        return "shopping";
    }
    if (desc.includes("apollo") || desc.includes("pharmacy") || desc.includes("medicine") || desc.includes("hospital") || desc.includes("clinic")) {
        return "healthcare";
    }
    if (desc.includes("electricity") || desc.includes("water") || desc.includes("gas") || desc.includes("bill")) {
        return "utilities";
    }
    if (desc.includes("loan") || desc.includes("emi")) {
        return "loan repayment";
    }
    if (desc.includes("insurance")) {
        return "insurance";
    }

    // fallback
    return type === "CREDIT" ? "income (other)" : "other";
}
