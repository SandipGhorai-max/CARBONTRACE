# Deploying CarbonTrace to Google Cloud Run

This guide provides the exact commands needed to deploy your CarbonTrace application to Google Cloud Run in under 5 minutes.

## Prerequisites
1. A Google Cloud Platform (GCP) account with billing enabled.
2. The Google Cloud CLI (`gcloud`) installed on your machine.
3. Your GCP Project ID.

## Deployment Steps

Run these 5 commands in your terminal from the root directory of the CarbonTrace project. 

> **Important**: Replace `YOUR_PROJECT_ID` with your actual GCP project ID before running.

### Step 1: Authenticate and Set Project
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable Required APIs
```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com
```

### Step 3: Build the Container Image
We will use Cloud Build so you don't even need Docker installed locally!
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/carbontrace .
```

### Step 4: Deploy to Cloud Run
```bash
gcloud run deploy carbontrace \
  --image gcr.io/YOUR_PROJECT_ID/carbontrace \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

Once the deployment finishes, the terminal will output your live HTTPS Service URL!
