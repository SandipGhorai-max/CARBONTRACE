$env:PATH += ";C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
$ErrorActionPreference = "Continue"

# Try a few of your existing projects that likely already have billing enabled
$PROJECTS = @("virtual-promptwar-492913", "promptathon-by-amd", "track-1-project-491913", "new-ai-agent-492715", "build-project-494309", "boxwood-chassis-461615-u6")
$APP_NAME = "carbontrace"
$REGION = "us-central1"
$SUCCESS_URL = ""

foreach ($PROJ in $PROJECTS) {
    Write-Host "============================================="
    Write-Host "Trying existing project: $PROJ"
    Write-Host "============================================="
    
    gcloud config set project $PROJ
    
    # Try enabling APIs
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "APIs enabled successfully! Billing is active on $PROJ."
        $IMAGE_URL = "gcr.io/$PROJ/$APP_NAME"
        
        Write-Host "Building Docker image..."
        gcloud builds submit --tag $IMAGE_URL .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Deploying to Cloud Run..."
            gcloud run deploy $APP_NAME `
              --image $IMAGE_URL `
              --platform managed `
              --region $REGION `
              --allow-unauthenticated `
              --port 8080 `
              --format="value(status.url)" > deploy_url.txt
              
            if ($LASTEXITCODE -eq 0) {
                $SUCCESS_URL = Get-Content deploy_url.txt
                break
            }
        }
    } else {
        Write-Host "Failed to enable APIs on $PROJ (likely no billing). Skipping..."
    }
}

Write-Host ""
if ($SUCCESS_URL) {
    Write-Host "========================================="
    Write-Host "SUCCESS! Live URL: $SUCCESS_URL"
    Write-Host "Deployed to project: $PROJ"
    Write-Host "========================================="
} else {
    Write-Host "All fallback projects failed."
}
