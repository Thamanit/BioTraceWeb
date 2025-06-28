from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from efficientnet_pytorch import EfficientNet
import numpy as np
import requests
import json
import tensorflow as tf
print("[DEBUG] Model path:", os.path.abspath("model/EyeAI.pth"))
