# GitHub Repository Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `DATC-AgroShop` (or any name you prefer)
3. Description: "ERP System for Deepak Agriculture and Trading Company"
4. Choose **Public** or **Private** (as per your preference)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in your terminal:

```bash
cd "C:\Users\KUBER SINGH\OneDrive\Documents\Desktop\DATC AGRO SHOP"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/Kubersingh123/DATC-AgroShop.git

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:Kubersingh123/DATC-AgroShop.git
git push -u origin main
```

## Step 3: Verify

After pushing, visit: https://github.com/Kubersingh123/DATC-AgroShop

You should see all your project files there!

## Troubleshooting

If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Generate token at: https://github.com/settings/tokens
3. Use token as password when prompted

If branch name is different:
```bash
git branch -M main
git push -u origin main
```

