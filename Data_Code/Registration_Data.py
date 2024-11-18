import json
import random
import string
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Define the set of allowed symbols
allowed_symbols = "!@#$&*"

def generate_email():
    """Generate a random email address with either Gmail or an organization domain."""
    domain = random.choice(["gmail.com", "example.com", "company.org", "business.net", "ucalgary.ca"])
    username = fake.user_name()
    return f"{username}@{domain}"

def generate_password(length=10):
    """Generate a password with at least one letter, one number, and one allowed symbol."""
    if length < 4:  # Ensure length is sufficient for the required characters
        length = 4

    # Start with one character from each required category
    password = [
        random.choice(string.ascii_letters),  # At least one letter
        random.choice(string.digits),         # At least one digit
        random.choice(allowed_symbols)        # At least one allowed symbol
    ]

    # Fill the rest of the password length with a mix of letters, numbers, and allowed symbols
    all_characters = string.ascii_letters + string.digits + allowed_symbols
    password += random.choices(all_characters, k=length - 3)

    # Shuffle the result to avoid predictable patterns
    random.shuffle(password)
    return ''.join(password)

def generate_user_record():
    """Generate a user record with email, password, first name, last name, and phone number."""
    password = generate_password()
    return {
        "firstName": fake.first_name(),
        "lastName": fake.last_name(),
        "phoneNumber": fake.phone_number(),
        "emailAddress": generate_email(),
        "password": password,
        "confirmPassword": password  # Same password entered twice for verification
    }

# Generate records
data = [generate_user_record() for _ in range(25)]

# Save to a JSON file
with open("Registration_data.json", "w") as file:
    json.dump(data, file, indent=4)
