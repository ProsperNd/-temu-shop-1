# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Firebase Project**: Set up a Firebase project at https://console.firebase.google.com/
2. **Netlify Account**: Create an account at https://netlify.com/
3. **Domain** (optional): Purchase a domain or use the provided Netlify subdomain

## Environment Setup

1. **Copy Environment File**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Firebase**:
   - Go to your Firebase project settings
   - Navigate to "General" tab
   - Scroll down to "Your apps" section
   - Click "Add app" and select Web (</>) option
   - Copy the configuration values to your `.env.local` file

3. **Configure NextAuth**:
   - Generate a secure secret for `NEXTAUTH_SECRET`:
     ```bash
     openssl rand -base64 32
     ```
   - Update `NEXTAUTH_URL` to your production domain

## Deployment Steps

### Option 1: Netlify (Recommended)

1. **Connect Repository**:
   - Log into Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository (GitHub/GitLab/Bitbucket)

2. **Configure Build Settings**:
   - **Base directory**: `.` (root)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

3. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add all variables from your `.env.local` file

4. **Deploy**:
   - Netlify will automatically trigger a build
   - Once complete, your site will be live

### Option 2: Vercel

1. **Connect Repository**:
   - Log into Vercel
   - Click "Import Project"
   - Connect your Git repository

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (root)

3. **Environment Variables**:
   - Go to Project settings → Environment Variables
   - Add all variables from your `.env.local` file

4. **Deploy**:
   - Vercel will automatically deploy your site

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test service booking functionality
- [ ] Check Firebase authentication
- [ ] Verify contact forms work
- [ ] Test responsive design on mobile devices
- [ ] Check all links and navigation
- [ ] Verify WhatsApp integration works
- [ ] Test search and filtering features

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check environment variables are set correctly
   - Ensure all dependencies are installed: `npm install`
   - Check for TypeScript errors: `npm run lint`

2. **Firebase Connection Issues**:
   - Verify API keys are correct
   - Check Firebase project is enabled
   - Ensure Firestore/Database rules are configured

3. **Authentication Not Working**:
   - Check NextAuth configuration
   - Verify NEXTAUTH_SECRET is set
   - Ensure NEXTAUTH_URL matches your domain

4. **Images Not Loading**:
   - Verify images are in `/public` directory
   - Check image file names match references in code
   - Ensure proper file permissions

## Performance Optimization

The app includes several optimizations:

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting by route
- **Caching**: Proper cache headers for static assets
- **Bundle Optimization**: Tree shaking and bundle analysis

## Monitoring

- **Firebase Console**: Monitor authentication and database usage
- **Netlify Analytics**: Track site performance and usage
- **Web Vitals**: Monitor Core Web Vitals in Google Search Console

## Security

- Environment variables are properly configured
- Security headers are set in `netlify.toml`
- Firebase security rules should be configured
- HTTPS is enforced by default

## Support

For deployment issues:
1. Check the build logs in Netlify/Vercel dashboard
2. Verify environment variables are correctly set
3. Test locally first: `npm run build && npm start`
4. Check Firebase project configuration