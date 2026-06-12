# Configuration
$PROJECT_ID = "your-gcp-project-id"
$APP_NAME = "carbontrace"
$REGION = "us-central1"
$IMAGE_URL = "gcr.io/$PROJECT_ID/$APP_NAME"

Write-Host "Starting deployment for $APP_NAME..."

# 1. Authenticate with Google Cloud (Uncomment if needed)
# gcloud auth login
# gcloud config set project $PROJECT_ID

# 2. Enable necessary APIs
Write-Host "Enabling Cloud Run and Container Registry APIs..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 3. Build the Docker container using Google Cloud Build
Write-Host "Building the Docker image via Cloud Build..."
gcloud builds submit --tag $IMAGE_URL .

# 4. Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME `
  --image $IMAGE_URL `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080

Write-Host "Deployment complete!"
