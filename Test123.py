class SimpleFinancialHealthAnalyzer:
    def calculate_score(self, income, expenses, existing_loans, credit_score, assets):
        debt_ratio = min(existing_loans / max(income, 1), 1)
        savings = max(income - expenses, 0) / max(income, 1)
        
        score = (
            (credit_score / 850 * 0.3) + 
            ((1 - debt_ratio) * 0.4) + 
            (savings * 0.2) + 
            (min(assets / max(income * 6, 1), 1) * 0.1)
        )
        return round(score * 100, 1)
    
    def get_health_assessment(self, financial_data):
        score = self.calculate_score(**financial_data)
        
        if score >= 80: category = "excellent"
        elif score >= 65: category = "good"
        elif score >= 50: category = "fair"
        else: category = "needs_improvement"
        
        messages = {
            "excellent": "🎉 Your finances are in great shape! You're likely to get the best loan offers.",
            "good": "👍 You're in a good position to apply for loans with favorable terms.",
            "fair": "⚠️ With some adjustments, you can improve your loan eligibility.",
            "needs_improvement": "🔧 Let's work on strengthening your financial profile before applying."
        }
        
        return {"score": score, "category": category, "message": messages[category]}

class SimpleLoanAdvisor:
    def __init__(self):
        self.loans = [
            {"lender": "HDFC Bank", "type": "Personal", "rate": 10.5, "min_income": 500000, "min_credit": 650},
            {"lender": "SBI", "type": "Home", "rate": 8.75, "min_income": 600000, "min_credit": 700},
            {"lender": "ICICI Bank", "type": "Personal", "rate": 11.25, "min_income": 450000, "min_credit": 650},
            {"lender": "Axis Bank", "type": "Car", "rate": 9.25, "min_income": 550000, "min_credit": 675},
            {"lender": "Kotak Mahindra", "type": "Home", "rate": 9.5, "min_income": 680000, "min_credit": 690},
        ]
    
    def find_loans(self, income, credit_score, loan_type):
        eligible = []
        for loan in self.loans:
            if (loan["min_income"] <= income and 
                loan["min_credit"] <= credit_score and
                loan["type"] == loan_type):
                eligible.append(loan)
        return eligible
    
    def calculate_emi(self, principal, rate, tenure):
        """Simple EMI calculation"""
        monthly_rate = rate / 12 / 100
        emi = (principal * monthly_rate * (1 + monthly_rate) ** tenure) / ((1 + monthly_rate) ** tenure - 1)
        return round(emi, 2)

def main():
    print("=" * 50)
    print("       LOANSAGE AI - MUMBAIHACKS 2025")
    print("       Agentic AI Loan Advisor")
    print("=" * 50)
    print()
    
    analyzer = SimpleFinancialHealthAnalyzer()
    advisor = SimpleLoanAdvisor()
    
    # Sample user data
    user_data = {
        'income': 900000,
        'expenses': 600000,
        'existing_loans': 1500000,
        'credit_score': 720,
        'assets': 500000
    }
    print("📊 FINANCIAL HEALTH ANALYSIS")
    print("-" * 30)
    health = analyzer.get_health_assessment(user_data)
    print(f"Score: {health['score']}/100")
    print(f"Category: {health['category'].upper()}")
    print(f"Assessment: {health['message']}")
    print()
    print("🏦 LOAN RECOMMENDATIONS")
    print("-" * 30)
    loan_type = "Home"
    loan_amount = 2500000
    eligible_loans = advisor.find_loans(user_data['income'], user_data['credit_score'], loan_type)
    
    if eligible_loans:
        print(f"Found {len(eligible_loans)} eligible {loan_type} loans:")
        print()
        for i, loan in enumerate(eligible_loans, 1):
            emi = advisor.calculate_emi(loan_amount, loan["rate"], 60)
            print(f"{i}. {loan['lender']}")
            print(f"   Interest Rate: {loan['rate']}%")
            print(f"   Estimated EMI (60 months): ₹{emi:,.2f}")
            print()
    else:
        print("No eligible loans found for your profile")
    print()
    print("💡 FINANCIAL TIPS")
    print("-" * 30)
    tips = [
        "Maintain a credit score above 750 for better interest rates",
        "Keep your debt-to-income ratio below 40% for loan eligibility",
        "Consider a longer loan tenure for lower EMIs",
        "Compare processing fees across lenders before applying",
        "Maintain 6 months of expenses as emergency fund"
    ]
    
    for i, tip in enumerate(tips, 1):
        print(f"{i}. {tip}")
    
    print()
    print("=" * 50)
    print("Thank you for using LoanSage AI! 💰")
    print("=" * 50)

if __name__ == "__main__":
    main()
