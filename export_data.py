import pymongo
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

client = pymongo.MongoClient(mongo_uri)

db = client["Finance-tracker"]

expenses_collection = db["expenses"]

expenses = list(expenses_collection.find())

df = pd.DataFrame(expenses)
df.to_csv("expenses.csv", index=False)

