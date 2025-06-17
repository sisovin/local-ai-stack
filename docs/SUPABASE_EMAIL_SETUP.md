# 📧 Supabase Email Configuration Guide

## The Issue

You're seeing "Check your email for verification link!" but not receiving the emails. This is a common issue with new Supabase projects.

## 🔧 Solutions

### Option 1: Configure Custom SMTP (Recommended for Production)

1. **Go to Supabase Auth Settings:**
   ```
   https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/auth
   ```

2. **Scroll to "SMTP Settings"**

3. **Configure your email provider:** 
   - **Gmail/Google Workspace:**
     - Host: `smtp.gmail.com`
     - Port: `587`
     - Username: Your Gmail address
     - Password: App-specific password (not your regular password)
   
   - **SendGrid:**
     - Host: `smtp.sendgrid.net`
     - Port: `587`
     - Username: `apikey`
     - Password: Your SendGrid API key
   
   - **Mailgun:**
     - Host: `smtp.mailgun.org`
     - Port: `587`
     - Username: Your Mailgun SMTP username
     - Password: Your Mailgun SMTP password

### Option 2: Enable Development Mode (Quick Fix)

1. **Go to Auth Settings:**
   ```
   https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/auth
   ```

2. **Find "Email Confirmation" section**

3. **Disable "Enable email confirmations"** (temporarily for development)

4. **Save changes**

⚠️ **Warning:** This allows users to sign up without email verification. Only use for development!

### Option 3: Use Supabase's Default Email (Limited)

Supabase provides limited email sending for development. If you're not receiving emails:

1. **Check your spam folder**
2. **Wait 5-10 minutes** (emails can be delayed)
3. **Try a different email provider** (Gmail, Outlook, etc.)
4. **Use the "Resend Verification" feature** in your app

## 🚀 Recommended Setup for Production

### 1. Set up SendGrid (Free tier: 100 emails/day)

```bash
# Sign up at https://sendgrid.com
# Create API key with "Mail Send" permissions
# Configure in Supabase SMTP settings
```

### 2. Configure Email Templates

In Supabase Auth Settings, customize:
- **Confirm signup** template
- **Magic link** template  
- **Change email address** template
- **Reset password** template

### 3. Set Redirect URLs

Configure these URLs in Auth Settings:
- **Site URL:** `http://localhost:3001` (development)
- **Redirect URLs:** 
  - `http://localhost:3001/auth/callback`
  - `https://yourdomain.com/auth/callback` (production)

## 🔍 Testing Your Configuration

1. **Use the Email Verification Helper** in your app
2. **Check browser console** for detailed error messages
3. **Monitor Supabase logs** in the dashboard
4. **Test with different email providers**

## 📋 Checklist

- [ ] SMTP configured or email confirmations disabled
- [ ] Site URL and redirect URLs set correctly
- [ ] Email templates configured
- [ ] Testing with the verification helper
- [ ] Checking spam folders
- [ ] Browser console checked for errors

## 🆘 Still Having Issues?

1. **Check Supabase logs:** `Dashboard > Logs > Auth logs`
2. **Verify your email configuration** in Auth settings
3. **Test with a fresh email address**
4. **Contact Supabase support** if using a paid plan

---

**Quick Commands for Testing:**

```javascript
// In browser console - test email sending
supabase.auth.signUp({
  email: 'test@example.com', 
  password: 'password123'
})
```
