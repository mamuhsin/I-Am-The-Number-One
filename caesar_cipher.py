def caesar_cipher(text, shift, mode='encrypt'):
    result = ""
    shift = shift % 26  # Ensure the shift is within the range of 0-25

    if mode == 'decrypt':
        shift = -shift

    for char in text:
        # Check if the character is an uppercase letter
        if char.isupper():
            result += chr((ord(char) + shift - 65) % 26 + 65)
        # Check if it's a lowercase letter
        elif char.islower():
            result += chr((ord(char) + shift - 97) % 26 + 97)
        # If it's neither, just add the character as is
        else:
            result += char

    return result

# Get input from the user
message = input("Enter the message: ")
shift_value = int(input("Enter the shift value: "))
operation = input("Would you like to 'encrypt' or 'decrypt' the message? ")

# Perform the operation
output = caesar_cipher(message, shift_value, operation.lower())
print(f"Result: {output}")

