import sys
import os

# Add the project root directory to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from pymongo.errors import ConnectionFailure
from python_scripts import export_data

class TestExportData(unittest.TestCase):

    @patch("python_scripts.export_data.pymongo.MongoClient")
    def test_export_successful(self, mock_mongo_client):

        mock_collection = MagicMock()
        mock_collection.find.return_value = [
            {"_id": 1, "amount": 100, "category": "Food"},
            {"_id": 2, "amount": 200, "category": "Utilities"}
        ]

        mock_db = MagicMock()
        def db_getitem(name):
            if name == "expenses":
                return mock_collection
            else:
                return MagicMock()
        mock_db.__getitem__.side_effect = db_getitem

        mock_client = MagicMock()
        def client_getitem(name):
            if name == "Finance-tracker":
                return mock_db
            else:
                return MagicMock()
        mock_client.__getitem__.side_effect = client_getitem

        mock_mongo_client.return_value = mock_client

        export_data.main()

        self.assertTrue(os.path.exists("expenses.csv"))

        df = pd.read_csv("expenses.csv")
        self.assertEqual(len(df), 2)
        self.assertListEqual(list(df.columns), ["_id", "amount", "category"])

        os.remove("expenses.csv")

    @patch("python_scripts.export_data.pymongo.MongoClient")
    def test_database_connection_failure(self, mock_mongo_client):
        mock_mongo_client.side_effect = ConnectionFailure("Failed to connect")
        
        with self.assertRaises(SystemExit):
            export_data.main()

if __name__ == "__main__":
    unittest.main()
