import json
import random
import string
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Define the set of allowed symbols
allowed_symbols = "!@#$&*"

def generate_valid_email():
    """Generate a random valid email address."""
    domain = random.choice(["gmail.com", "example.com", "company.org", "business.net"])
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
    """Generate a user record with a valid email, password, and confirm password (different)."""
    password = generate_password()
    confirm_password = generate_password()  # Generate a different confirm password
    return {
        "emailAddress": generate_valid_email(),
        "password": password,
        "confirmPassword": confirm_password  # Different password for confirmation
    }

# Generate 1000 records
data = [generate_user_record() for _ in range(20)]

# Save to a JSON file
with open("unmatched_password_data.json", "w") as file:
    json.dump(data, file, indent=4)

print("1000 user records with valid emails and different passwords have been written to 'Registration_data.json'.")
