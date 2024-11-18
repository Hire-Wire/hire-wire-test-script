import json
import random
import string
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Define the set of allowed symbols
allowed_symbols = "!@#$&*"

def generate_invalid_email():
    """Generate a random invalid email address."""
    invalid_patterns = [
        fake.user_name() + "example.com",  # Missing '@'
        fake.user_name() + "@",  # Missing domain
        fake.user_name() + "@domain",  # Missing TLD
        fake.user_name() + "!@example.com",  # Invalid characters
        fake.user_name() + "@example#domain.com",  # Invalid character in domain
        fake.user_name() + "@example@example.com",  # Multiple '@' symbols
        " " + fake.user_name() + "@example.com",  # Whitespace before email
        fake.user_name() + "@example .com",  # Whitespace in domain
        "u@d.c",  # Too short email
        fake.user_name() + "@domain" * 20 + ".com",  # Too long email
        fake.user_name() + "@domain..com",  # Double dot in domain
        fake.user_name() + "@domain.x",  # Invalid TLD
        fake.user_name() + "@ex_ample.com",  # Underscore in domain
        fake.user_name() + "@exa mple.com",  # Space in domain
        "@example.com",  # Empty local part
        fake.user_name() + "@.com",  # Empty domain part
    ]
    
    return random.choice(invalid_patterns)

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
    """Generate a user record with just email and password (entered twice)."""
    password = generate_password()
    return {
        "emailAddress": generate_invalid_email(),
        "password": password,
        "confirmPassword": password  # Same password entered twice for verification
    }

# Generate 1000 records
data = [generate_user_record() for _ in range(20)]

# Save to a JSON file
with open("invalid_email_data.json", "w") as file:
    json.dump(data, file, indent=4)

print("1000 invalid email records have been written to 'Registration_data.json'.")
