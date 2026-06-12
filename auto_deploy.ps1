$env:PATH += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
$ErrorActionPreference = "Stop"

$PROJECT_ID = "carbontrace-app-$(Get-Random -Minimum 10000 -Maximum 99999)"
$BILLING_ACCOUNT = "01945D-EEA5C7-F2648B"
$REGION = "us-central1"
$APP_NAME = "carbontrace"
$IMAGE_URL = "gcr.io/$PROJECT_ID/$APP_NAME"

Write-Host "Creating project $PROJECT_ID..."
gcloud projects create $PROJECT_ID --name="CarbonTrace App"

Write-Host "Linking billing account..."
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT

Write-Host "Setting project as default..."
gcloud config set project $PROJECT_ID

Write-Host "Enabling APIs (this can take a moment)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com

Write-Host "Building Docker image via Cloud Build..."
gcloud builds submit --tag $IMAGE_URL .

Write-Host "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME `
  --image $IMAGE_URL `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080 `
  --format="value(status.url)" > deploy_url.txt

$URL = Get-Content deploy_url.txt
Write-Host ""
Write-Host "========================================="
Write-Host "SUCCESS! Live URL: $URL"
Write-Host "========================================="
