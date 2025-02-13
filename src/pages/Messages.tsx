import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, MessageSquare, Star, Archive, Settings, Send, Paperclip, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Messages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // Mock data for demonstration
  const chats = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    lastMessage: 'Hey there! How are you?',
    time: '2h ago',
    unread: Math.random() > 0.7,
    online: Math.random() > 0.7,
    avatar: `https://source.unsplash.com/random/100x100?portrait=${i}`
  }));

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-6">
        {/* Chat List */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<Settings className="w-4 h-4" />}
              />
            </div>
            <Input
              placeholder="Search messages..."
              icon={<Search className="w-4 h-4" />}
            />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-3 rounded-lg transition-colors ${
                    selectedChat === chat.id
                      ? 'bg-creator-purple-500/20'
                      : 'hover:bg-purple-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{chat.name}</span>
                        <span className="text-xs text-gray-400">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread && (
                      <span className="w-2 h-2 bg-creator-purple-500 rounded-full" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="flex-1 flex flex-col">
          {selectedChat !== null ? (
            <>
              <CardHeader className="border-b border-purple-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={chats[selectedChat].avatar}
                      alt={chats[selectedChat].name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {chats[selectedChat].name}
                      </h3>
                      {chats[selectedChat].online && (
                        <span className="text-xs text-green-400">Online</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Star className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Archive className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Mock messages */}
                  <div className="flex items-end gap-2">
                    <img
                      src={chats[selectedChat].avatar}
                      alt={chats[selectedChat].name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="bg-purple-900/20 rounded-2xl rounded-bl-none p-3 max-w-md">
                      <p>Hey there! How are you?</p>
                      <span className="text-xs text-gray-400 mt-1">2:30 PM</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <div className="bg-creator-purple-500 rounded-2xl rounded-br-none p-3 max-w-md">
                      <p>I'm good, thanks! How about you?</p>
                      <span className="text-xs text-white/70 mt-1">2:31 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t border-purple-800/30">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Paperclip className="w-4 h-4" />}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Image className="w-4 h-4" />}
                  />
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-4 h-4" />}
                    onClick={() => setMessage('')}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}