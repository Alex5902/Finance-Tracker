import unittest
from unittest.mock import patch
import pandas as pd
import os
import sys

# Add the project root directory to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from python_scripts import model_training  

class TestModelTraining(unittest.TestCase):

    @patch("python_scripts.model_training.joblib.dump")
    def test_model_training_successful(self, mock_joblib_dump):

        mock_data = pd.DataFrame({
            "date": pd.date_range(start="2021-01-01", periods=6, freq="M"),
            "amount": [100, 200, 150, 300, 250, 400]
        })

        model = model_training.train_model(mock_data)

        mock_joblib_dump.assert_called_once()
        args, kwargs = mock_joblib_dump.call_args
        self.assertIsInstance(args[0], model_training.LinearRegression)
        self.assertEqual(args[1], "expense_forecast_model.pkl")

    def test_empty_dataset(self):

        mock_data = pd.DataFrame(columns=["date", "amount"])

        with self.assertRaises(ValueError):
            model_training.train_model(mock_data)

if __name__ == "__main__":
    unittest.main()
