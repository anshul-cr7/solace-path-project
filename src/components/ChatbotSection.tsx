
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, Heart } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'exercise' | 'resource';
}

const ChatbotSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. I'm here to provide support, coping strategies, and a safe space to share your feelings. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMood, setUserMood] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAdvancedBotResponse = (userMessage: string): { content: string; type: 'text' | 'exercise' | 'resource' } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect emotional states with more nuance
    if (lowerMessage.includes('suicidal') || lowerMessage.includes('hurt myself') || lowerMessage.includes('end it all')) {
      return {
        content: "I'm really concerned about you right now. Please know that you're not alone and there is help available. Consider reaching out to:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYour life has value, and there are people who want to help you through this difficult time.",
        type: 'resource'
      };
    }

    if (lowerMessage.includes('panic') || lowerMessage.includes('panic attack') || lowerMessage.includes('can\'t breathe')) {
      return {
        content: "It sounds like you might be experiencing panic. Let's try a grounding technique right now:\n\n🌟 5-4-3-2-1 Technique:\n• Name 5 things you can see\n• 4 things you can touch\n• 3 things you can hear\n• 2 things you can smell\n• 1 thing you can taste\n\nBreathe slowly: In for 4, hold for 4, out for 6. You're safe, and this feeling will pass.",
        type: 'exercise'
      };
    }

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      setUserMood('anxious');
      return {
        content: "I understand you're feeling anxious. Anxiety is your mind's way of trying to protect you, but sometimes it can feel overwhelming. Here's a quick technique:\n\n🧘 Box Breathing:\n• Inhale for 4 counts\n• Hold for 4 counts\n• Exhale for 4 counts\n• Hold empty for 4 counts\n\nRepeat 4-6 times. What specific thoughts are contributing to your anxiety right now?",
        type: 'exercise'
      };
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hopeless')) {
      setUserMood('sad');
      return {
        content: "I hear that you're feeling sad, and I want you to know that it's completely valid to feel this way. Depression can make everything feel heavy. Remember:\n\n💙 Your feelings are temporary, even when they don't feel like it\n💙 Small steps count as progress\n💙 You don't have to carry this alone\n\nCan you tell me about one small thing that brought you even a tiny bit of comfort recently?",
        type: 'text'
      };
    }

    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad') || lowerMessage.includes('rage')) {
      return {
        content: "Anger is a valid emotion, and it often signals that something important to you has been threatened or violated. Let's work with this energy constructively:\n\n🔥 Quick Anger Reset:\n• Take 10 deep breaths\n• Clench and release your fists 5 times\n• Name what you're really angry about\n\nWhat's underneath this anger? Sometimes anger protects other feelings like hurt or fear.",
        type: 'exercise'
      };
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return {
        content: "Sleep issues can really impact our mental health. Here are some gentle techniques:\n\n🌙 Sleep Hygiene Tips:\n• No screens 1 hour before bed\n• Try progressive muscle relaxation\n• Write down 3 things you're grateful for\n• Keep your room cool and dark\n\n✨ If your mind is racing, try the 'worry window' - set aside 10 minutes earlier in the day to write down worries, then remind yourself you'll address them tomorrow.",
        type: 'exercise'
      };
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return {
        content: "Loneliness can be one of the most painful experiences. Please know that feeling lonely doesn't mean you're alone in the world.\n\n🤝 Connection Ideas:\n• Reach out to one person you haven't talked to in a while\n• Join a community group or online forum\n• Volunteer for a cause you care about\n• Practice self-compassion - be the friend to yourself that you'd be to others\n\nRemember: I'm here with you right now, and your feelings matter.",
        type: 'text'
      };
    }

    if (lowerMessage.includes('overwhelm') || lowerMessage.includes('too much') || lowerMessage.includes('can\'t cope')) {
      return {
        content: "When everything feels like too much, let's break it down:\n\n📋 The STOP Technique:\n• **S**top what you're doing\n• **T**ake a deep breath\n• **O**bserve your thoughts and feelings\n• **P**roceed with one small, manageable step\n\nWhat's the smallest possible step you could take right now? Sometimes we just need to focus on the next five minutes.",
        type: 'exercise'
      };
    }

    if (lowerMessage.includes('better') || lowerMessage.includes('good') || lowerMessage.includes('happy') || lowerMessage.includes('great')) {
      return {
        content: "I'm so glad to hear you're feeling better! 🌟 It's important to acknowledge and celebrate these positive moments. They're evidence of your resilience.\n\n✨ Let's anchor this feeling:\n• What specifically is contributing to feeling good?\n• How does your body feel right now?\n• What would you tell someone else who helped you feel this way?\n\nRemember this moment for times when things feel harder.",
        type: 'text'
      };
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('helped') || lowerMessage.includes('appreciate')) {
      return {
        content: "You're so welcome! 💜 It takes courage to reach out and work on your mental health. The fact that you're here, engaging with these tools and being open about your feelings, shows incredible strength.\n\nRemember: healing isn't linear, and you're doing better than you think. I'm always here when you need support.",
        type: 'text'
      };
    }

    if (lowerMessage.includes('meditation') || lowerMessage.includes('mindfulness') || lowerMessage.includes('breathing')) {
      return {
        content: "Mindfulness and meditation are powerful tools for mental health! Here's a simple practice:\n\n🧘‍♀️ 3-Minute Mindful Breathing:\n• Sit comfortably and close your eyes\n• Focus on your natural breath\n• When your mind wanders (it will!), gently return to your breath\n• Notice: Am I breathing into my chest or belly?\n• End by taking three deeper breaths\n\nEven 3 minutes can reset your nervous system. How did that feel?",
        type: 'exercise'
      };
    }

    // More empathetic general responses
    const supportiveResponses = [
      "Thank you for sharing that with me. Your feelings are completely valid, and it takes courage to express them. What feels most important for you to focus on right now?",
      "I hear you, and I want you to know that what you're experiencing matters. Sometimes just putting our feelings into words can be the first step toward feeling better. How long have you been feeling this way?",
      "It sounds like you're going through something challenging. You don't have to figure everything out at once. What's one small thing that might bring you a bit of comfort today?",
      "Your experience is unique and important. I'm here to listen and support you however I can. Is there a particular area of your mental health you'd like to focus on together?"
    ];

    return {
      content: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      type: 'text'
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate more realistic AI thinking time
    setTimeout(() => {
      const response = getAdvancedBotResponse(inputMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // More realistic response time
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-700">
          <Heart className="h-6 w-6 text-purple-500" />
          <span>AI Mental Health Companion</span>
        </CardTitle>
        <p className="text-slate-500 text-sm">Your personal AI therapist for emotional support and coping strategies</p>
        {userMood && (
          <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full w-fit">
            Mood detected: {userMood} - I'm here to help 💜
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 bg-white/70 rounded-lg p-4 overflow-y-auto max-h-80 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Heart className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'exercise'
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-slate-700'
                      : message.type === 'resource'
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-slate-700'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  {message.type === 'exercise' && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      💡 Try this exercise
                    </div>
                  )}
                  {message.type === 'resource' && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      🆘 Important resources
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <div className="text-xs text-purple-500 mt-1">Thinking with care...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Share what's on your mind... I'm here to listen 💜"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-slate-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Button 
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-slate-500 text-center">
          💜 This AI provides support but isn't a replacement for professional therapy
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotSection;
