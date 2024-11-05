# bmi_model.py
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

# Generate some simple data for BMI categories
# Format: [height (cm), weight (kg)]
data = np.array([
    [160, 50], [165, 55], [170, 70], [175, 80], [180, 90],
    [150, 45], [155, 49], [160, 60], [165, 85], [170, 95]
])

# Labels for the categories: 0 = underweight, 1 = normal, 2 = overweight
labels = np.array([0, 0, 1, 1, 2, 0, 0, 1, 2, 2])

# Split the data
X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)

# Train the model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Evaluate the model
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy:.2f}")

# Save the model to a file
joblib.dump(model, "bmi_classifier.pkl")
