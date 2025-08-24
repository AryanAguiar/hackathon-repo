import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import logging
import os
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("LoanSage")
class FinancialHealthAnalyzer:
    def __init__(self):
        self.health_categories = {
            "excellent": "Your finances are in great shape! You're likely to get the best loan offers.",
            "good": "You're in a good position to apply for loans with favorable terms.",
            "fair": "With some adjustments, you can improve your loan eligibility.",
            "needs_improvement": "Let's work on strengthening your financial profile before applying."
        }
    def calculate_score(self, income, expenses, existing_loans, credit_score, assets):
        """Calculate a simple financial health score"""
        debt_to_income = existing_loans / income if income > 0 else 1
        savings_ratio = (income - expenses) / income if income > 0 else 0
        score = (
            (min(credit_score / 850, 1) * 0.3) + 
            (max(0, 1 - debt_to_income) * 0.4) + 
            (savings_ratio * 0.2) + 
            (min(assets / (income * 6), 1) * 0.1)
        )
        return round(score * 100, 1)
    def get_health_assessment(self, financial_data):
        score = self.calculate_score(**financial_data)
        
        if score >= 80:
            category = "excellent"
        elif score >= 65:
            category = "good"
        elif score >= 50:
            category = "fair"
        else:
            category = "needs_improvement"  
        return {
            "score": score,
            "category": category,
            "message": self.health_categories[category],
            "tips": self.generate_improvement_tips(financial_data, category)
        }
    def generate_improvement_tips(self, financial_data, category):
        tips = []
        income, expenses, existing_loans, credit_score, assets = (
            financial_data['income'], 
            financial_data['expenses'], 
            financial_data['existing_loans'], 
            financial_data['credit_score'], 
            financial_data['assets']
        )
        if existing_loans / income > 0.4 and category in ["fair", "needs_improvement"]:
            tips.append("Consider paying down existing debt before taking new loans. Your debt-to-income ratio is high.")
        if credit_score < 650:
            tips.append("Improving your credit score by paying bills on time can help you get better loan terms.")
        if (income - expenses) / income < 0.2:
            tips.append("Try to increase your savings rate. Even a small increase can improve your loan eligibility.") 
        if not tips:
            tips.append("Keep up the good financial habits! You're on the right track.")  
        return tips
class LoanRecommender:
    def __init__(self, loan_dataset_path):
        self.loan_data = self.load_loan_data(loan_dataset_path)
        self.model = self.train_recommendation_model()
        logger.info("Loan recommender initialized with market data")
    def load_loan_data(self, path):
        try:
            if os.path.exists(path):
                data = pd.read_csv(path)
                logger.info(f"Loaded {len(data)} loan products from dataset")
                return data
            else:
                logger.warning(f"Loan data file not found at {path}")
                return self.create_sample_loan_data()
        except Exception as e:
            logger.error(f"Error loading loan data: {e}")
            return self.create_sample_loan_data()
    def create_sample_loan_data(self):
        logger.info("Creating sample loan data")
        data = {
            'lender': ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'] * 4,
            'loan_type': ['Personal'] * 5 + ['Home'] * 5 + ['Education'] * 5 + ['Car'] * 5,
            'interest_rate': np.random.uniform(8, 15, 20),
            'processing_fee': np.random.uniform(0.5, 2.5, 20),
            'max_tenure': np.random.randint(12, 84, 20),
            'min_income': np.random.randint(300000, 1000000, 20),
            'min_credit_score': [650, 700, 675, 650, 680] * 4,
            'max_amount': np.random.randint(500000, 5000000, 20)
        }
        return pd.DataFrame(data)
    def train_recommendation_model(self):
        np.random.seed(42)  
        n_samples = 1000
        X = pd.DataFrame({
            'user_income': np.random.randint(300000, 3000000, n_samples),
            'user_credit_score': np.random.randint(600, 850, n_samples),
            'loan_amount': np.random.randint(100000, 3000000, n_samples),
            'existing_loans': np.random.randint(0, 1000000, n_samples)  
        })
        with np.errstate(divide='ignore', invalid='ignore'):
            income_ratio = np.where(X['loan_amount'] > 0, X['user_income'] / X['loan_amount'], 0)
            debt_ratio = np.where(X['user_income'] > 0, X['existing_loans'] / X['user_income'], 1)
            y = (
                (np.minimum(income_ratio, 3) * 0.4) +  
                (X['user_credit_score'] / 850 * 0.3) +
                ((1 - np.minimum(debt_ratio, 1)) * 0.3)  
            )
        y = np.nan_to_num(y, nan=0.0, posinf=1.0, neginf=0.0)
        y_class = pd.cut(y, bins=[-1, 0.5, 0.7, 2], labels=[0, 1, 2])
        valid_indices = ~y_class.isna()
        X = X[valid_indices]
        y_class = y_class[valid_indices].astype(int)
        model = RandomForestClassifier(n_estimators=10, random_state=42)
        model.fit(X, y_class)
        return model
    def recommend_loans(self, user_profile, loan_requirements):
        user_income = user_profile['income']
        user_credit = user_profile['credit_score']
        existing_debt = user_profile['existing_loans']
        loan_amount = loan_requirements['amount']
        loan_purpose = loan_requirements['purpose']
        eligible_loans = self.loan_data[
            (self.loan_data['min_income'] <= user_income) &
            (self.loan_data['min_credit_score'] <= user_credit) &
            (self.loan_data['max_amount'] >= loan_amount) &
            (self.loan_data['loan_type'] == loan_purpose)
        ].copy()
        if eligible_loans.empty:
            return {"recommendations": [], "message": "No eligible loans found based on your criteria"}
        suitability_scores = []
        for _, loan in eligible_loans.iterrows():
            features = pd.DataFrame({
                'user_income': [user_income],
                'user_credit_score': [user_credit],
                'loan_amount': [loan_amount],
                'existing_loans': [existing_debt]
            })
            suitability = self.model.predict_proba(features)[0][2] 
            final_score = suitability * 0.7 + (1 - (loan['interest_rate'] / 20)) * 0.3
            suitability_scores.append(final_score)
        eligible_loans['suitability_score'] = suitability_scores
        eligible_loans = eligible_loans.sort_values('suitability_score', ascending=False)
        recommendations = []
        for _, loan in eligible_loans.head(3).iterrows():
            recommendations.append({
                'lender': loan['lender'],
                'loan_type': loan['loan_type'],
                'interest_rate': f"{loan['interest_rate']:.2f}%",
                'processing_fee': f"{loan['processing_fee']:.2f}%",
                'max_tenure': f"{loan['max_tenure']} months",
                'suitability_score': f"{loan['suitability_score'] * 100:.1f}%",
                'key_benefits': self.generate_benefit_description(loan, user_profile)
            })
        return {
            "recommendations": recommendations,
            "message": f"Found {len(eligible_loans)} eligible loans for your {loan_purpose} loan"
        }
    def generate_benefit_description(self, loan, user_profile):
        benefits = []
        if loan['interest_rate'] < 10:
            benefits.append("Low interest rate compared to market average")
        if loan['processing_fee'] < 1:
            benefits.append("Low processing fees") 
        if loan['max_tenure'] > 60:
            benefits.append("Long repayment period for lower EMIs")
        if loan['min_credit_score'] <= user_profile['credit_score'] < 650:
            benefits.append("Accepts applicants with average credit score")   
        return benefits if benefits else ["Competitive terms for your profile"]
class RepaymentAdvisor:
    def __init__(self):
        logger.info("Repayment advisor initialized")
    def calculate_emi(self, principal, annual_rate, tenure_months):
        monthly_rate = annual_rate / 12 / 100
        emi = (principal * monthly_rate * (1 + monthly_rate) ** tenure_months) / ((1 + monthly_rate) ** tenure_months - 1)
        return emi
    def generate_repayment_plan(self, loan_amount, interest_rate, tenure):
        emi = self.calculate_emi(loan_amount, interest_rate, tenure)
        monthly_rate = interest_rate / 12 / 100
        balance = loan_amount
        plan = []
        total_interest = 0
        for month in range(1, tenure + 1):
            interest_component = balance * monthly_rate
            principal_component = emi - interest_component
            balance -= principal_component
            total_interest += interest_component
            
            plan.append({
                "month": month,
                "emi": round(emi, 2),
                "principal": round(principal_component, 2),
                "interest": round(interest_component, 2),
                "balance": round(balance, 2) if balance > 0 else 0
            })
        
        return {
            "emi": round(emi, 2),
            "total_interest": round(total_interest, 2),
            "total_payment": round(loan_amount + total_interest, 2),
            "monthly_plan": plan
        }


class LoanBABA:
    def __init__(self, loan_data_path="data/loan_products.csv"):
        self.health_analyzer = FinancialHealthAnalyzer()
        self.loan_recommender = LoanRecommender(loan_data_path)
        self.repayment_advisor = RepaymentAdvisor()
        logger.info("LoanBABA AI initialized ready to provide personalized loan guidance")
    
    def get_financial_health(self, user_data):
        return self.health_analyzer.get_health_assessment(user_data)
    
    def get_loan_recommendations(self, user_profile, loan_requirements):
        return self.loan_recommender.recommend_loans(user_profile, loan_requirements)
    
    def get_repayment_analysis(self, user_profile, loan_amount, interest_rate, tenure):
        plan = self.repayment_advisor.generate_repayment_plan(loan_amount, interest_rate, tenure)
        return {"repayment_plan": plan}
if __name__ == "__main__":
    loan_baba = LoanBABA()
    user_data = {
        'income': 900000,
        'expenses': 600000,
        'existing_loans': 1500000,
        'credit_score': 720,
        'assets': 500000
    }
    loan_needs = {
        'purpose': 'Home',
        'amount': 2500000
    }
    print(" LoanBABA Demo \n")
    health = loan_baba.get_financial_health(user_data)
    print(f"Financial Health Score: {health['score']}/100 ({health['category']})")
    print(f"Assessment: {health['message']}")
    print("Tips:")
    for tip in health['tips']:
        print(f"- {tip}")
    print()
    recommendations = loan_baba.get_loan_recommendations(user_data, loan_needs)
    print(f"Loan Recommendations: {recommendations['message']}")
    for i, loan in enumerate(recommendations['recommendations'], 1):
        print(f"{i}. {loan['lender']} - {loan['loan_type']} Loan at {loan['interest_rate']}")
        print(f"   Suitability: {loan['suitability_score']}")
        print(f"   Key benefits: {', '.join(loan['key_benefits'])}")
    print()
    repayment = loan_baba.get_repayment_analysis(user_data, 2500000, 8.5, 60)
    print(f"Repayment Analysis for 2,500,000 INR loan at 8.5% for 60 months:")
    print(f"Monthly EMI: {repayment['repayment_plan']['emi']:,.2f} INR")
    print(f"Total interest payable: {repayment['repayment_plan']['total_interest']:,.2f} INR")