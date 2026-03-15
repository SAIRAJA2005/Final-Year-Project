# import os
# import numpy as np
# import matplotlib.pyplot as plt
# import logging
# import tensorflow as tf

# # =============================
# # Environment & TensorFlow setup
# # =============================

# os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
# os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
# logging.getLogger("tensorflow").setLevel(logging.FATAL)

# tf.keras.backend.set_image_data_format("channels_last")

# # =============================
# # Project imports
# # =============================

# from model import unet_model

# # =============================
# # Configuration
# # =============================

# img_size = 120
# num_epoch = 30          # 🔥 increased
# batch_size = 16

# data_root = r"E:\FInal_Year_Project\BraTS_small\processed"
# weights_root = r"E:/Final_Year_Project/BraTS_small/weights"
# os.makedirs(weights_root, exist_ok=True)

# # =============================
# # Load dataset
# # =============================

# print("Loading dataset...")

# train_X = np.load(os.path.join(data_root, f"x_{img_size}.npy"))
# train_Y = np.load(os.path.join(data_root, f"y_{img_size}.npy"))

# print("X min/max:", train_X.min(), train_X.max())
# print("Y unique values:", np.unique(train_Y))

# print("Dataset loaded")
# print("Original X shape:", train_X.shape)
# print("Original Y shape:", train_Y.shape)

# # =============================
# # Convert channels_first → channels_last
# # =============================

# if train_X.shape[1] == 1:
#     train_X = np.transpose(train_X, (0, 2, 3, 1))
#     train_Y = np.transpose(train_Y, (0, 2, 3, 1))

# print("Converted X shape:", train_X.shape)
# print("Converted Y shape:", train_Y.shape)

# # =============================
# # Safety checks
# # =============================

# assert train_X.shape == train_Y.shape
# assert train_X.ndim == 4
# assert train_X.shape[-1] == 1

# # =============================
# # Normalize data (IMPORTANT)
# # =============================

# train_X = train_X.astype("float32")
# train_X /= np.max(train_X)

# train_Y = train_Y.astype("float32")

# # =============================
# # Load model
# # =============================

# print("Loading the model...")
# model = unet_model(input_size=(img_size, img_size, 1))
# model.summary()
# print("The model loaded")

# # =============================
# # Train the model
# # =============================

# print("Starting training...")

# history = model.fit(
#     train_X,
#     train_Y,
#     validation_split=0.25,
#     batch_size=batch_size,
#     epochs=num_epoch,
#     shuffle=True,
#     verbose=1,
# )

# # =============================
# # Plot Dice coefficient
# # =============================

# if "dice_coef" in history.history:
#     plt.figure()
#     plt.plot(history.history["dice_coef"], label="Train Dice")
#     plt.plot(history.history["val_dice_coef"], label="Val Dice")
#     plt.title("Model Dice Coefficient")
#     plt.ylabel("Dice Coef")
#     plt.xlabel("Epoch")
#     plt.legend()
#     plt.grid(True)
#     plt.show()

# # =============================
# # Plot loss
# # =============================

# plt.figure()
# plt.plot(history.history["loss"], label="Train Loss")
# plt.plot(history.history["val_loss"], label="Val Loss")
# plt.title("Model Loss")
# plt.ylabel("Loss")
# plt.xlabel("Epoch")
# plt.legend()
# plt.grid(True)
# plt.show()

# # =============================
# # Save model weights
# # =============================

# weights_path = os.path.join(
#     weights_root, f"dice_weights_{img_size}_{num_epoch}.h5"
# )
# model.save_weights(weights_path)

# print("Model weights saved to:", weights_path)

import os
import numpy as np
import matplotlib.pyplot as plt
import logging
import tensorflow as tf

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
logging.getLogger("tensorflow").setLevel(logging.FATAL)
tf.keras.backend.set_image_data_format("channels_last")

from model import unet_model

# Configuration
img_size = 120
num_epoch = 30
batch_size = 16
data_root = r"E:\FInal_Year_Project\BraTS_small\processed"
weights_root = r"E:/Final_Year_Project/BraTS_small/weights"

print(f"📁 Data: {data_root}")
print(f"💾 Weights: {weights_root}")
os.makedirs(weights_root, exist_ok=True)

# Load dataset
print("\n🔄 Loading dataset...")
train_X = np.load(os.path.join(data_root, f"x_{img_size}.npy"))
train_Y = np.load(os.path.join(data_root, f"y_{img_size}.npy"))

print(f"X: {train_X.shape}, Y: {train_Y.shape}")
print(f"Y unique: {np.unique(train_Y)[:5]}...{np.unique(train_Y)[-5:]}")  # Sample

# 🔥 FIX 1: Convert channels + BINARY MASKS
if train_X.shape[1] == 1:
    train_X = np.transpose(train_X, (0, 2, 3, 1))
    train_Y = np.transpose(train_Y, (0, 2, 3, 1))

# 🔥 FIX 2: FORCE BINARY LABELS (CRITICAL!)
train_Y = (train_Y > 0.5).astype("float32")  # 0 or 1 only
print(f"✅ FIXED Y unique: {np.unique(train_Y)}")  # MUST show [0. 1.]

train_X = train_X.astype("float32") / np.max(np.abs(train_X))
print(f"✅ Shapes: X{train_X.shape} Y{train_Y.shape}")

# Model
print("\n🤖 Creating model...")
model = unet_model(input_size=(img_size, img_size, 1))

# Train
print("🚀 Training...")
history = model.fit(train_X, train_Y, validation_split=0.25, batch_size=batch_size, 
                   epochs=num_epoch, shuffle=True, verbose=1)
print("✅ Training done!")

# 🔥 FIX 3: NON-BLOCKING PLOTS
plt.figure(figsize=(12, 4))
plt.subplot(121)
plt.plot(history.history["dice_coef"], 'b-', label="Train Dice", linewidth=2)
if "val_dice_coef" in history.history:
    plt.plot(history.history["val_dice_coef"], 'r-', label="Val Dice", linewidth=2)
plt.title("Dice Coefficient")
plt.legend(); plt.grid()

plt.subplot(122)
plt.plot(history.history["loss"], 'b-', label="Train Loss", linewidth=2)
plt.plot(history.history["val_loss"], 'r-', label="Val Loss", linewidth=2)
plt.title("Loss")
plt.legend(); plt.grid()
plt.savefig("training_results.png")  # SAVE TO FILE
plt.show(block=False)  # NON-BLOCKING
plt.close()
print("📈 Plots saved!")

# 🔥 FIX 4: SAVE FIRST IN CURRENT DIRECTORY (GUARANTEED)
print("\n💾 SAVING WEIGHTS...")
current_dir = "."
save_paths = []

# 1. CURRENT DIRECTORY (99.9% success)
try:
    path1 = f"dice_weights_{img_size}_{num_epoch}.h5"
    model.save_weights(path1)
    save_paths.append(path1)
    print(f"✅1 {path1} ({os.path.getsize(path1)/1e6:.1f} MB)")
except Exception as e:
    print(f"❌1 {e}")

# 2. WEIGHTS FOLDER
try:
    path2 = os.path.join(weights_root, f"dice_weights_{img_size}_{num_epoch}.h5")
    model.save_weights(path2)
    save_paths.append(path2)
    print(f"✅2 {path2}")
except Exception as e:
    print(f"❌2 {e}")

# 3. SIMPLE NAME
try:
    path3 = "FINAL_unet_weights.h5"
    model.save_weights(path3)
    save_paths.append(path3)
    print(f"✅3 {path3} ({os.path.getsize(path3)/1e6:.1f} MB)")
except Exception as e:
    print(f"❌3 {e}")

print(f"\n🎉 FILES SAVED: {save_paths}")
print("📂 Check: dir *.h5")
print("\n🔥 NOW RUN PREDICT.PY with: weights_root = '.'")
input("Press Enter to exit...")
