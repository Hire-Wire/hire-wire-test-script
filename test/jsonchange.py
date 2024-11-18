import json

# Load the JSON data from the file
with open('C:\Users\talla\OneDrive\Desktop\Laxmi\MEng\ENSF608\project\selenium-test-project\test\Experience_Data.json', 'r') as file:
    data = json.load(file)

# Replace the keys if they exist
if 'School Name' in data:
    data['SchoolName'] = data.pop('School Name')

if 'Area of Study' in data:
    data['SchoolAreaOfStudy'] = data.pop('Area of Study')

# Print the updated JSON (optional)
print(json.dumps(data, indent=4))

# Save the updated JSON back to the file
with open('./Experience_Data.json', 'w') as file:
    json.dump(data, file, indent=4)
