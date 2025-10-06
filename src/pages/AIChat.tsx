import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface Message {
  role: "user" | "assistant";
  content: string;
}
export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hello! I'm Houston, your NASA Bioscience AI assistant. Ask me anything about the research publications, experiments, or biological systems in our database."
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      role: "user",
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [...messages, userMessage]
        }
      });
      if (error) {
        throw error;
      }
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error:", error);
      let description = "Failed to get AI response. Please try again.";
      if (error.message?.includes("Rate limit")) {
        description = "Rate limit exceeded. Please try again later.";
      } else if (error.message?.includes("credits")) {
        description = "AI credits depleted. Please add credits to continue.";
      }
      toast({
        title: "Error",
        description,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Houston, your AI Research Assistant
        </h1>
        
      </div>

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col bg-gradient-card border-border">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>)}
          {isLoading && <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }} placeholder="Ask about experiments, organisms, or research outcomes..." className="flex-1 min-h-[60px] max-h-[120px] bg-muted border-border resize-none" disabled={isLoading} />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-6">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
        </div>
      </Card>
    </div>;
};