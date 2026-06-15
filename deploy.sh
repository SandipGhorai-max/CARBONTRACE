#!/bin/bash
set -e

# Deploy script for Google Cloud Run
# Ensure you have gcloud CLI installed and authenticated

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "Error: No Google Cloud Project configured. Run 'gcloud config set project [YOUR-PROJECT-ID]'"
    exit 1
fi

echo "========================================="
echo "Building and Deploying to Google Cloud Run"
echo "Project: $PROJECT_ID"
echo "Service: carbontrace"
echo "Region: us-central1"
echo "========================================="

# Submit build to Cloud Build
echo "Submitting build to Cloud Build..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/carbontrace .

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy carbontrace \
  --image gcr.io/$PROJECT_ID/carbontrace \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

echo "========================================="
echo "SUCCESS! Deployment completed."
echo "========================================="
