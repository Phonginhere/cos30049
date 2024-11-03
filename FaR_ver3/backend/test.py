def check_input_type(user_input):
    """
    Check if the input is numeric (int or float) or a string.

    Parameters:
    user_input (str): The input string from the user.

    Returns:
    str: 'numeric' if input is int or float, 'string' otherwise.
    """
    try:
        # Attempt to convert to float
        numeric_value = float(user_input)
        print(f"The input '{user_input}' is numeric: {numeric_value}")
        return "numeric"
    except ValueError:
        # If conversion fails, it's a string
        print(f"The input '{user_input}' is a string.")
        return "string"

def main():
    user_input = input("Please enter something: ")  # Get user input
    input_type = check_input_type(user_input)       # Check the type of input

if __name__ == "__main__":
    main()
