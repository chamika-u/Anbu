# WatsonX.ai Troubleshooting Guide

## The Error You're Seeing

```
"project_id c41f5293-add5-43fe-96f0-2fd71939e625 is not associated with a WML instance"
```

This error means your WatsonX.ai project exists, but it's **not associated with a Watson Machine Learning (WML) service instance**.

## Solution: Associate Your Project with WML Service

### Step 1: Check Your Watson Machine Learning Service

1. Go to IBM Cloud Resources: https://cloud.ibm.com/resources
2. Look for "Watson Machine Learning" in your resource list
3. If you don't see it, you need to create one:
   - Go to: https://cloud.ibm.com/catalog/services/watson-machine-learning
   - Click "Create"
   - Choose a plan (Lite/Free or Paid)
   - Create the service

### Step 2: Associate WML with Your WatsonX.ai Project

1. Go to your WatsonX.ai project: https://dataplatform.cloud.ibm.com/projects/
2. Open your project (ID: `c41f5293-add5-43fe-96f0-2fd71939e625`)
3. Go to **"Manage"** tab → **"Services & integrations"**
4. Click **"Associate service"**
5. Select your **Watson Machine Learning** service
6. Click **"Associate"**

### Step 3: Verify the Association

1. In your project, go to **"Manage"** → **"Services & integrations"**
2. You should see "Watson Machine Learning" listed
3. Make sure it shows as "Active" or "Associated"

### Step 4: Get the Correct Credentials

After associating the WML service:

1. **Project ID**: Use the same one you have: `c41f5293-add5-43fe-96f0-2fd71939e625`
2. **API Key**: Your IBM Cloud API key: `s6MP6hc0MdmpO9uaHeHhhyrKT00sJQ-Dl8HOYbIv2ODc`
3. **URL**: Keep as `https://us-south.ml.cloud.ibm.com` (or your region's URL)

### Step 5: Restart Your Application

After associating the WML service:
1. Stop the backend server (Ctrl+C)
2. Start it again: `python backend/run.py`
3. Test by analyzing a repository

## Alternative: Create a New WatsonX.ai Project

If the above doesn't work, create a fresh project:

1. Go to: https://dataplatform.cloud.ibm.com/projects/
2. Click **"New project"**
3. Choose **"Create an empty project"**
4. Give it a name
5. **Important**: When creating, make sure to select/associate a Watson Machine Learning service
6. Get the new Project ID from the project settings
7. Update your `backend/.env` with the new Project ID

## Check Your IBM Cloud Account Permissions

Make sure your IBM Cloud account has:
- ✅ Watson Machine Learning service created
- ✅ WatsonX.ai access enabled
- ✅ Proper IAM permissions for WML
- ✅ Active subscription (Lite/Free or Paid plan)

## Verify Your Setup

Run this checklist:

1. **Do you have a Watson Machine Learning service?**
   - Check: https://cloud.ibm.com/resources
   - Look for "Watson Machine Learning"

2. **Is your WatsonX.ai project associated with WML?**
   - Open your project
   - Go to Manage → Services & integrations
   - WML should be listed

3. **Is your API key valid?**
   - Go to: https://cloud.ibm.com/iam/apikeys
   - Verify your API key exists and has proper permissions

4. **Is your project in the correct region?**
   - Your URL is set to `us-south`
   - Make sure your project and WML service are in the same region

## Still Not Working?

If you've done all the above and it still doesn't work:

1. **Check IBM Cloud Status**: https://cloud.ibm.com/status
2. **Verify WatsonX.ai is available in your region**
3. **Check your IBM Cloud account has active WatsonX.ai access**
4. **Try creating a completely new project with WML pre-associated**

## Contact IBM Support

If nothing works, you may need to contact IBM Cloud support:
- https://cloud.ibm.com/unifiedsupport/supportcenter

Provide them with:
- Your Project ID: `c41f5293-add5-43fe-96f0-2fd71939e625`
- The error message about "not associated with a WML instance"
- Your IBM Cloud account ID

---

**Note**: The application code is working correctly. This is purely a configuration issue with your IBM Cloud WatsonX.ai setup.