import pandas as pd

data = pd.read_csv('Daily_Spending.csv')
data['Date'] = pd.to_datetime(data['Date'], format='%d-%m-%Y')

daily_spending = data.groupby('Date')['Amount'].sum()
# print(daily_spending)

input_date = input("Enter a date (DD-MM-YYYY): ")
input_date = pd.to_datetime(input_date, format='%d-%m-%Y')
metric = input("Enter a metric (daily/weekly): ").strip().lower()

if input_date in daily_spending.index:
    if metric == 'daily':
        # Daily spending for the input date
        print(f"Spending on {input_date.date()}: {daily_spending[input_date]}")
    elif metric == 'weekly':
        # Weekly spending for the input date
        start_date = input_date - pd.Timedelta(days=6)
        last_7_days = daily_spending[start_date:input_date]
        total_weekly = last_7_days.sum()
        print(f"Total spending from {start_date.date()} to {input_date.date()}: {total_weekly}")    
    else:
        print("Invalid metric. Please enter 'daily' or 'weekly'.")
else:
    print(f"No spending recorded on {input_date.date()}.")


month = int(input("Enter a month (1-12): "))
if month in daily_spending.index.month:
    monthly_spending = daily_spending[daily_spending.index.month == month].sum()
    print(f"Total spending for month {month}: {monthly_spending}")
else:
    print(f"No spending recorded for month {month}.")