# 🚀 AI Chatbot Deployment Rehberi

Bu rehber, Claude AI chatbot'unuzu Netlify'da yayınlamak için gereken tüm adımları içerir.

## 📋 Ön Hazırlık

### 1. Claude API Key Alın

1. [console.anthropic.com](https://console.anthropic.com) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. Sol menüden **API Keys** seçin
4. **Create Key** butonuna tıklayın
5. Oluşan key'i kopyalayın ve güvenli bir yere kaydedin

💡 **Not**: Claude API kullanımı ücretlidir ama ilk $5 kredi ücretsiz verilir. Kişisel portfolio için aylık maliyetiniz genelde $1-3 arasında olur.

### 2. Netlify Hesabı Oluşturun

1. [netlify.com](https://netlify.com) adresine gidin
2. GitHub hesabınızla giriş yapın (önerilen)

## 🔧 Deployment Adımları

### Adım 1: Projeyi GitHub'a Yükleyin

```bash
# Terminal'de proje klasörüne gidin
cd /Users/scincin/selahattincincin.github.io

# Değişiklikleri commit edin
git add .
git commit -m "Add Claude AI chatbot"
git push origin main
```

### Adım 2: Netlify'da Proje Oluşturun

1. Netlify dashboard'a gidin
2. **Add new site** → **Import an existing project** tıklayın
3. **GitHub** seçin
4. Repository'nizi seçin: `selahattincincin.github.io`
5. Build settings otomatik olarak algılanacak (netlify.toml sayesinde)
6. **Deploy site** butonuna tıklayın

### Adım 3: Environment Variables Ekleyin

Deploy başladıktan sonra:

1. Site dashboard'da **Site settings** → **Environment variables** gidin
2. **Add a variable** tıklayın
3. Şu bilgileri girin:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: [Aldığınız Claude API key]
   - **Scopes**: Tümünü seçili bırakın
4. **Create variable** tıklayın

### Adım 4: Site'i Yeniden Deploy Edin

Environment variable ekledikten sonra:

1. **Deploys** sekmesine gidin
2. **Trigger deploy** → **Clear cache and deploy site** tıklayın
3. Deploy tamamlanana kadar bekleyin (~1-2 dakika)

## ✅ Test Edin

Deploy tamamlandığında:

1. Netlify'ın verdiği URL'e gidin (örn: `https://your-site-name.netlify.app`)
2. Sağ alttaki mor chat butonuna tıklayın
3. Chatbot ile konuşmayı deneyin

### Test Mesajları:
- "Merhaba"
- "Yazılım yetenekleri nedir?"
- "Hangi projeler var?"
- "İletişim bilgileri"

## 🎨 Özel Domain (Opsiyonel)

Kendi domain'inizi bağlamak için:

1. Netlify dashboard → **Domain settings**
2. **Add custom domain** tıklayın
3. Domain'inizi girin
4. DNS ayarlarını domain sağlayıcınızda yapılandırın

## 🔍 Sorun Giderme

### Chatbot çalışmıyor

1. Browser Console'u açın (F12)
2. Hata mesajlarını kontrol edin
3. Netlify Functions loglarını kontrol edin:
   - Netlify dashboard → **Functions** → **chat** → **Logs**

### "API key not configured" hatası

- Environment variable'ı doğru ekledğinizden emin olun
- Variable isminin tam olarak `ANTHROPIC_API_KEY` olduğunu kontrol edin
- Site'i yeniden deploy edin

### Function timeout hatası

- Claude API key'inizin geçerli olduğunu kontrol edin
- API key'inizde yeterli kredi olduğunu kontrol edin

## 💰 Maliyet Tahmini

**Netlify (Ücretsiz Tier):**
- ✅ 100 GB bandwidth
- ✅ 125,000 function invocations/ay
- ✅ Sınırsız site

**Claude API:**
- ~$3 / 1M input token (Claude Sonnet 3.5)
- ~$15 / 1M output token
- İlk $5 ücretsiz kredi

**Örnek**: Ayda 1000 chat mesajı = ~$0.50-1.00

## 📊 Monitoring

Netlify dashboard'da şunları izleyebilirsiniz:

1. **Analytics**: Ziyaretçi sayısı, sayfa görüntülemeleri
2. **Functions**: Function çağrı sayısı, hatalar
3. **Logs**: Gerçek zamanlı loglar

## 🔄 Güncelleme

Chatbot'u güncellemek için:

```bash
# Değişikliklerinizi yapın
# Örn: netlify/functions/chat.js içindeki SYSTEM_PROMPT

# Commit ve push
git add .
git commit -m "Update chatbot"
git push origin main

# Netlify otomatik olarak deploy edecek
```

## 🎯 İleri Seviye

### Rate Limiting Ekleyin

Netlify Functions'da built-in rate limiting yok. Bunun için:
- Cloudflare kullanın
- Upstash Rate Limit kullanın

### Analytics Ekleyin

```javascript
// netlify/functions/chat.js içine
// Log her conversation
console.log('Chat request:', { timestamp: new Date(), message: messages[0] });
```

### Custom Domain SSL

Netlify otomatik olarak SSL sertifikası sağlar (Let's Encrypt).

## 📞 Destek

Sorularınız için:
- Email: selahattincincin@gmail.com
- GitHub Issues: [Repository Issues](https://github.com/selahattincincin/selahattincincin.github.io/issues)

---

✨ Başarılar! Artık AI-powered bir portfolio'nuz var!
