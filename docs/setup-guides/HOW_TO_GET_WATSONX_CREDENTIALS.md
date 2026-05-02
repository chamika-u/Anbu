# How to Get Correct IBM WatsonX.ai Credentials

## The Problem

The error you're seeing indicates that the Project ID provided is for **Cloud Object Storage**, not for **WatsonX.ai**:

```
"project_id c41f5293-add5-43fe-96f0-2fd71939e625 is not associated with a WML instance"
```

## What You Need

You need credentials specifically for **IBM WatsonX.ai** (Watson Machine Learning), not Cloud Object Storage.

## Steps to Get the Correct Credentials

### 1. Go to IBM Cloud WatsonX.ai
- Visit: https://cloud.ibm.com/watsonx
- Log in with your IBM Cloud account

### 2. Create or Access a WatsonX.ai Project
- Click on "Projects" in the left sidebar
- Either:
  - **Create a new project** for WatsonX.ai
  - **Open an existing WatsonX.ai project**

### 3. Get Your Project ID
- Once in your project, look at the URL or project settings
- The Project ID should be in the format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Important**: This must be a WatsonX.ai project, not a Cloud Object Storage project

### 4. Get Your API Key
- Go to: https://cloud.ibm.com/iam/apikeys
- Click "Create an IBM Cloud API key"
- Give it a name like "watsonx-api-key"
- **Copy and save the API key** (you won't be able to see it again)

### 5. Verify Your WatsonX.ai Service
- Go to: https://cloud.ibm.com/resources
- Look for "Watson Machine Learning" or "WatsonX.ai" in your resource list
- Make sure you have an active WatsonX.ai service instance
- If not, you need to create one:
  - Go to: https://cloud.ibm.com/catalog/services/watson-machine-learning
  - Create a Watson Machine Learning service
  - Associate it with your project

### 6. Update Your Credentials

Once you have the correct credentials, update `backend/.env`:

```env
IBM_WATSONX_API_KEY=your-new-api-key-here
IBM_WATSONX_PROJECT_ID=your-watsonx-project-id-here
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

## Alternative: Use the Credentials You Already Have

The credentials you provided appear to be for **Cloud Object Storage**. If you want to use WatsonX.ai, you need to:

1. **Create a Watson Machine Learning service** in IBM Cloud
2. **Create a WatsonX.ai project** and associate it with the WML service
3. **Get the new Project ID** from that WatsonX.ai project
4. **Use your IBM Cloud API key** (the one you provided should work if it has the right permissions)

## Check Your IBM Cloud Account

Make sure your IBM Cloud account has:
- ✅ Watson Machine Learning service provisioned
- ✅ WatsonX.ai access enabled
- ✅ A WatsonX.ai project created (not just Cloud Object Storage)

## Need Help?

If you're unsure about any of these steps:
1. Check your IBM Cloud dashboard: https://cloud.ibm.com/
2. Look for "Watson Machine Learning" or "WatsonX.ai" services
3. Verify you have an active WatsonX.ai subscription/trial

## Current Status

Your application code is **working correctly**. The issue is with the credentials - you need WatsonX.ai credentials, not Cloud Object Storage credentials.

Once you provide the correct WatsonX.ai Project ID, the application will work with AI-powered documentation generation!