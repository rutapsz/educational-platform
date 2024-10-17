# Use official Python image as base
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements.txt to the container
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . /app/

# Expose the port for Django
EXPOSE 8000

# Set the environment variable for Django
ENV DJANGO_SETTINGS_MODULE=myproject.settings

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
