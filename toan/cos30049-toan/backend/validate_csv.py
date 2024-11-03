import csv
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Path to the CSV file
CSV_FILE_PATH = "./backend/data/air_quality_health_2.csv"

def validate_csv(file_path):
    with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader, None)
        if header is None:
            logger.error("CSV file is empty.")
            sys.exit(1)
        #if found, show the header
        logger.info(f"CSV Header: {header}")
        sys.exit(1)


if __name__ == "__main__":
    validate_csv(CSV_FILE_PATH)
