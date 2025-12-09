'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useCollection, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { Message } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function MessagingPage() {
  const { firebaseUser, user } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesCollection = useMemo(
    () => firestore ? collection(firestore, 'team-chat') : null,
    [firestore]
  );
  const messagesQuery = useMemo(
    () => messagesCollection ? query(messagesCollection, orderBy('timestamp', 'asc')) : null,
    [messagesCollection]
  );
  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !firebaseUser || !newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      userId: firebaseUser.uid,
      userName: user?.displayName || firebaseUser.email,
      timestamp: serverTimestamp(),
    };

    const collectionRef = collection(firestore, 'team-chat');
    addDoc(collectionRef, messageData)
        .then(() => {
            setNewMessage('');
        })
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: collectionRef.path,
                    operation: 'create',
                    requestResourceData: messageData,
                })
            )
        })
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <PageHeader
        title="Team Chat"
        description="Real-time messaging for instructors and managers."
        className="text-left px-0"
      />
      <Card className="mt-8 flex-1 flex flex-col">
        <CardContent className="pt-6 flex-1 flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-4">
            {isLoading && <p>Loading messages...</p>}
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-start gap-3',
                  msg.userId === firebaseUser?.uid && 'flex-row-reverse'
                )}
              >
                <Avatar className="h-8 w-8">
                   <AvatarFallback>{msg.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-sm',
                    msg.userId === firebaseUser?.uid
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm font-bold">{msg.userName}</p>
                  <p className="text-sm">{msg.text}</p>
                   <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp ? format(msg.timestamp.toDate(), 'p') : 'sending...'}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 border-t pt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
