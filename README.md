# Selahattin Çinçin - Personal Portfolio

Personal portfolio website with AI-powered chatbot using Claude API.

🌐 **Live Site**: http://selahattincincin.github.io/

## Features

- 🎨 Modern, responsive design
- 🤖 AI-powered chatbot (Claude API)
- 📱 GitHub projects integration
- ⚡ Fast and lightweight
- 🌐 Netlify deployment ready

## AI Chatbot

The chatbot uses Claude AI to answer questions about Selahattin's skills, experience, and projects in a natural, conversational way.

### How it works:
1. Frontend chat interface (js/chat.js)
2. Netlify serverless function (netlify/functions/chat.js)
3. Claude API for intelligent responses
4. GitHub API for real-time project listing

## Deployment to Netlify

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set up Netlify

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add AI chatbot"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select this repository
   - Build settings are already configured in `netlify.toml`

### Step 3: Add Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add the following variable:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Claude API key (get it from [console.anthropic.com](https://console.anthropic.com))

### Step 4: Deploy

Click "Deploy site" - Netlify will automatically:
- Build your site
- Deploy the serverless functions
- Provide you with a live URL

## Getting Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to Netlify environment variables

## Local Development

To test locally with Netlify Dev:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Create .env file
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env

# Run local dev server
netlify dev
```

The site will be available at `http://localhost:8888`

## Project Structure

```
.
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Styles including chat widget
├── js/
│   └── chat.js            # Frontend chat logic
├── netlify/
│   └── functions/
│       └── chat.js        # Claude API integration
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Technologies Used

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **AI**: Claude API (Anthropic)
- **Hosting**: Netlify
- **Functions**: Netlify Serverless Functions
- **APIs**: GitHub API, Claude API

## Customization

### Modify AI Personality

Edit the `SYSTEM_PROMPT` in `netlify/functions/chat.js` to customize how the AI responds.

### Change Chat Appearance

Edit `css/style.css` in the "Chat Widget Styles" section.

## Cost Considerations

- **Netlify**: Free tier includes 125k function invocations/month
- **Claude API**: Pay-as-you-go pricing, ~$3 per 1M input tokens for Claude Sonnet
- **GitHub API**: Free (rate limited to 60 requests/hour unauthenticated)

For a personal portfolio, costs should be minimal (likely < $5/month even with regular traffic).

## Support

For issues or questions:
- Email: selahattincincin@gmail.com
- GitHub: [@selahattincincin](https://github.com/selahattincincin)

## License

MIT License - feel free to use this for your own portfolio!

---

Made with ☕ by Selahattin Çinçin