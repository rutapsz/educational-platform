# Use official Python image as base
FROM python:3.8.10

# Set the working directory
WORKDIR /root/backend/

# Copy requirements.txt to the container
COPY requirements.txt /root/backend/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . /root/backend/

# Expose the port for Django
EXPOSE 8000

# Set the environment variable for Django
ENV DJANGO_SETTINGS_MODULE=course.settings

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
