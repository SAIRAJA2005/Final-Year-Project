"""
The build/compilations setup

>> pip install -r requirements.txt
>> python setup.py install
"""
import logging

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

def _read_requirements(path):
    try:
        with open(path, "r") as f:
            return [line.strip() for line in f if line.strip() and not line.startswith("#")]
    except Exception:
        logging.warning("Fail load requirements file, so using default ones.")
        return []

install_reqs = _read_requirements("requirements.txt")

setup(
    name='mask-rcnn',
    version='2.1',
    url='https://github.com/matterport/Mask_RCNN',
    author='Matterport',
    author_email='waleed.abdulla@gmail.com',
    license='MIT',
    description='Mask R-CNN for object detection and instance segmentation',
    packages=["mrcnn"],
    install_requires=install_reqs,
    include_package_data=True,
    python_requires='>=3.4',
    long_description="""This is an implementation of Mask R-CNN on Python 3, Keras, and TensorFlow. 
The model generates bounding boxes and segmentation masks for each instance of an object in the image. 
It's based on Feature Pyramid Network (FPN) and a ResNet101 backbone.""",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Console",
        "Intended Audience :: Developers",
        "Intended Audience :: Information Technology",
        "Intended Audience :: Education",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Scientific/Engineering :: Image Recognition",
        "Topic :: Scientific/Engineering :: Visualization",
        "Topic :: Scientific/Engineering :: Image Segmentation",
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
    ],
    keywords="image instance segmentation object detection mask rcnn r-cnn tensorflow keras",
)
