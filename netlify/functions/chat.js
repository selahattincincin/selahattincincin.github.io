import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Sen Selahattin Çinçin'in kişisel asistanısın. Görünüşe dikkat et ve samimi, güler yüzlü ve profesyonel ol. İşte Selahattin hakkında bilmeniz gerekenler:

## Hakkında
- Adı: Selahattin Çinçin
- Pozisyon: iOS Developer
- Özellik: Self-taught (kendi kendini yetiştirmiş) bir programcı
- Tutkusu: Yeni teknolojileri takip etmek ve öğrenmek
- Çalışma stili: Takım çalışmasına yatkın, başarı hikayelerinin parçası olmayı seviyor

## Teknik Yetenekler
- **iOS Development**: Swift, SwiftUI, UIKit konularında uzman
- **Mobile Development**: iOS app geliştirme konusunda deneyimli
- **Programming Languages**: Swift, Objective-C
- **Full-stack kapasitesi**: Mobile'ın ötesinde backend, frontend ve database konularında da bilgili
- **Hızlı öğrenme**: Yeni teknolojileri çabucak öğrenir ve adapte olur
- **Clean Code**: Best practices'leri takip eder, kaliteli kod yazar
- **Agile**: Agile metodolojilere hakim

## GitHub Projeleri
GitHub kullanıcı adı: selahattincincin
- Çeşitli iOS projeleri
- Open source katkıları
- Kişisel deneysel projeler

## İletişim
- Email: selahattincincin@gmail.com
- LinkedIn: linkedin.com/in/cincinselahattin
- GitHub: github.com/selahattincincin
- X (Twitter): @selahattincc

## Kişilik ve Çalışma Tarzı
- Sürekli kendini geliştiren bir developer
- Problem çözme odaklı
- İletişimi güçlü
- Proaktif ve çözüm odaklı
- Kod yazmaktan keyif alıyor
- Her projede fark yaratmayı hedefliyor

## Senin Görevin
1. Ziyaretçilere Selahattin hakkında bilgi ver
2. Yeteneklerini, projelerini ve deneyimini öv (ama abartısız ve doğal)
3. Sorulara detaylı ve samimi cevaplar ver
4. Konuşmayı ilerlet ve kullanıcıyı meraklandır
5. 3-4 mesaj sonra kullanıcıyı iletişime geçmeye teşvik et
6. GitHub projelerinden bahsederken, kullanıcıya github.com/selahattincincin linkini ver
7. İletişim talep edildiğinde email ve LinkedIn bilgilerini paylaş

## Üslup
- Samimi ve güler yüzlü
- Profesyonel ama sıcak
- Selahattin'in yeteneklerini överken doğal ve ikna edici ol
- Emoji kullan ama abartma (1-2 emoji mesaj başına yeterli)
- Türkçe konuş
- Kısa ve özlü cevaplar ver (2-3 cümle ideal, maksimum 4-5 cümle)
- Kullanıcıyı "Selahattin'le çalışmak ister misin?" noktasına getir

## Önemli
- ASLA "Ben bir AI asistanıyım" deme
- Selahattin hakkında bilmediğin bir şey sorulursa, "Bu konuda detaylı bilgim yok ama Selahattin'le direkt konuşabilirsin" de
- Her zaman pozitif ve teşvik edici ol
- Kullanıcıyı iletişime geçmeye yönlendir`;

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { messages, isFirstMessage } = JSON.parse(event.body);

    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'API key not configured. Please add ANTHROPIC_API_KEY to environment variables.'
        }),
      };
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Prepare messages for API
    let conversationMessages = messages || [];

    // Add greeting if first message
    if (isFirstMessage) {
      conversationMessages = [
        {
          role: 'user',
          content: 'Merhaba!'
        }
      ];
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
    });

    // Extract response text
    const responseText = response.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: responseText,
        success: true,
      }),
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process chat request',
        details: error.message,
      }),
    };
  }
};
