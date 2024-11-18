import json
from faker import Faker
import random

# Initialize Faker instance
fake = Faker()

def generate_phone_number():
    """Generate a random 10-digit phone number in the format XXX-XXX-XXXX."""
    return f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"

def generate_work_experience():
    """Generate a single work experience entry."""
    return {
        "JobTitle": fake.job(),
        "organizationName": fake.company(),
        "startDate": fake.date_between(start_date="-10y", end_date="-2y").strftime("%Y-%m-%d"),
        "endDate": fake.date_between(start_date="-2y", end_date="today").strftime("%Y-%m-%d"),
        "description": "Worked as a " + fake.job()
    }

def generate_random_record():
    area_of_study = random.choice(["Computer Science", "Engineering", "Business", "Mathematics", "Physics", "Biology", "Psychology"])
    degree = random.choice(["Bachelor of Science", "Bachelor of Arts", "Master of Science", "Master of Arts", "PhD"])
    
    # Randomly decide the number of work experiences (1 to 3)
    work_experiences = [generate_work_experience() for _ in range(random.randint(1, 3))]

    return {
        # "firstName": fake.first_name(),
        # "lastName": fake.last_name(),
        # "phoneNumber": generate_phone_number(),
        # "emailAddress": fake.email(),
        # "status": random.choice(["Employed", "Unemployed", "Student"]),
        "workExperience": work_experiences,
        "Education": [
            {
                "SchoolName": fake.company() + " University",
                "startDate": fake.date_between(start_date="-15y", end_date="-10y").strftime("%Y-%m-%d"),
                "endDate": fake.date_between(start_date="-10y", end_date="-5y").strftime("%Y-%m-%d"),
                "AreaOfStudy": area_of_study,
                "description": f"{degree} in {area_of_study}"
            }
        ]
    }

# Generate thousands of records
data = [generate_random_record() for _ in range(10)]

# Save to a JSON file
with open("Profile.json", "w") as file:
    json.dump(data, file, indent=4)
