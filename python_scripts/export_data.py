import pymongo
import pandas as pd
import os
from dotenv import load_dotenv
import sys

def main():
    load_dotenv()

    mongo_uri = os.getenv("MONGO_URI")

    try:
        client = pymongo.MongoClient(mongo_uri)
        db = client["Finance-tracker"]
        expenses_collection = db["expenses"]

        expenses = list(expenses_collection.find())

        df = pd.DataFrame(expenses)
        df.to_csv("expenses.csv", index=False)
        print("Data export successful.")

    except pymongo.errors.ConnectionFailure as e:
        print(f"Database connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

