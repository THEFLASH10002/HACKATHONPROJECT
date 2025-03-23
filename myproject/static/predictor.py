import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier


X_train = [
    [80, 120, 80, 98],
    [95, 130, 85, 95],
    [60, 110, 70, 99],
    [55, 150, 90, 92],
    [100, 160, 100, 90],
    [70, 100, 65, 97],
    [90, 125, 82, 93],
    [45, 90, 50, 89],
    [110, 135, 85, 91],
    [88, 122, 78, 96],
]

# Labels: 0=Healthy, 1=Warning, 2=Critical
y_train = [0, 1, 0, 2, 2, 0, 1, 2, 2, 1]

model = RandomForestClassifier()
model.fit(X_train, y_train)
joblib.dump(model, 'risk_model.pkl')
