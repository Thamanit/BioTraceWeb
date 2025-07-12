from efficientnet_pytorch import EfficientNet
import torch

# Load model from correct EfficientNet variant
model = EfficientNet.from_name('efficientnet-b4')  # ← change this to match

# If your model was fine-tuned for 5 classes, update the classifier
model._fc = torch.nn.Linear(in_features=1792, out_features=5)

# Load weights
state_dict = torch.load("model/EyeAI.pth", map_location=torch.device("cpu"))
model.load_state_dict(state_dict)

print("✅ Loaded EfficientNet-B4 model with 5 output classes.")
