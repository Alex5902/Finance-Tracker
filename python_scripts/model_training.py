import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

def train_model(data):
    data["date"] = pd.to_datetime(data["date"])
    data = data.groupby(pd.Grouper(key="date", freq="M")).sum().reset_index()
    data["month"] = data["date"].dt.month
    data["year"] = data["date"].dt.year
    X = data[["month", "year"]]
    y = data["amount"]

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, "expense_forecast_model.pkl")
    return model

def main():
    data = pd.read_csv("expense_data.csv")
    train_model(data)

if __name__ == "__main__":
    main()
