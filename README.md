# Mobile App for Personal Expense Management

This project aims to develop a mobile application using React-Native for Android devices, enabling users to manage their personal expenses efficiently. By leveraging the Firebase API for data persistence and user authentication, the app provides a secure and reliable platform for users to track and control their spending.

## Features

### User Authentication
- Users can register, login, and logout using Firebase authentication services.

### Expense Listing
- View all registered expenses, including their descriptions, amounts, and categories.

### Add Expense
- Users can add new expenses by specifying the description, amount, and selecting a predefined category.
- Input validation is enforced; all fields are mandatory with the amount being strictly greater than R$0,00.

### Edit Expense
- Existing expense records can be edited, allowing changes to descriptions, amounts, and categories.

### Remove Expense
- Users have the option to delete unnecessary expenses from their records.

### Category Listing
- Access a list of predefined categories to classify expenses, improving organization and analysis.
- The app includes a static table of categories, with functionalities to add and edit new categories.
- Three initial categories are set and cannot be modified by the user.

### Drawer Navigation
- Users can search for expenses using keywords or specific terms.

### Expense Filtering and Search
- Filter expenses based on various criteria like category, time period, or amount.
- Search for expenses using keywords or specific terms.

### Statistics Screen
- The app features a statistics screen displaying information such as total expenses, average spending by category, and graphical analysis of spending over time.

### Data Visualization
- Display data using at least two different types of graphs.

## Data Persistence and User Authentication
- The app utilizes Firebase services for all operations related to data persistence and user authentication, ensuring security and reliability.

## Notes
- Each functionality contributes 1.0 points towards the average grade for the first semester.
- For students engaged in integrated projects, scoring extends from item 1 to item 7 in the feature list.
