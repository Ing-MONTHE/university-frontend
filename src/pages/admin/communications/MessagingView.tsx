import { useEffect, useState, useRef } from 'react';
import { Send, Paperclip, Search, MoreVertical, X, UserPlus } from 'lucide-react';
import { useCommunications } from '@/hooks/useCommunications';
import type { Conversation, Message, MessageFormData } from '@/types/communications.types';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '@/store';

export default function MessagingView() {
  const user = useAuthStore((state) => state.user);
  const {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessagesConversation,
    handleSendMessage,
    handleMarquerMessageLu,
    clearError,
  } = useCommunications();

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number; username: string; email: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessagesConversation(selectedConversation.interlocuteur.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom quand nouveaux messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Marquer comme lu quand on ouvre une conversation
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      messages
        .filter(m => !m.est_lu && m.destinataire.id === user?.id)
        .forEach(m => handleMarquerMessageLu(m.id));
    }
  }, [messages, selectedConversation]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
  };

  const handleSend = async () => {
    if (!selectedConversation || (!messageText.trim() && !attachment)) return;

    const formData: MessageFormData = {
      destinataire_id: selectedConversation.interlocuteur.id,
      sujet: 'Message', // Sujet par défaut pour messagerie instantanée
      corps: messageText,
      piece_jointe: attachment,
    };

    try {
      await handleSendMessage(formData);
      setMessageText('');
      setAttachment(null);
    } catch (err) {
      console.error('Erreur envoi message:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSearchUsers = async () => {
    if (userSearchQuery.trim()) {
      const results = await handleSearchUsers(userSearchQuery);
      setSearchResults(results);
    }
  };

  const handleStartNewChat = (userId: number, username: string, email: string) => {
    const newConv: Conversation = {
      interlocuteur: { id: userId, username, email },
      dernier_message: {} as Message,
      messages_non_lus: 0,
    };
    setSelectedConversation(newConv);
    setShowNewChat(false);
    setUserSearchQuery('');
    setSearchResults([]);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.interlocuteur.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.interlocuteur.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex overflow-hidden">
        {/* Sidebar - Liste des conversations */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          {/* Header sidebar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <Button
                size="sm"
                onClick={() => setShowNewChat(true)}
                className="flex items-center gap-1"
                title="Nouvelle conversation"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading && !selectedConversation ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="md" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Aucune conversation
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.interlocuteur.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation?.interlocuteur.id === conv.interlocuteur.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <Avatar name={conv.interlocuteur.username} size="md" />

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">
                        {conv.interlocuteur.username}
                      </span>
                      {conv.dernier_message?.created_at && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(conv.dernier_message.created_at), 'HH:mm', { locale: fr })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 truncate flex-1">
                        {conv.dernier_message?.corps || 'Nouvelle conversation'}
                      </p>
                      {conv.messages_non_lus > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs ml-2">
                          {conv.messages_non_lus}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone principale - Messages */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Header chat */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selectedConversation.interlocuteur.username} size="md" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.interlocuteur.username}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedConversation.interlocuteur.email}</p>
                </div>
              </div>

              <Button size="sm" variant="outline">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner size="md" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-gray-500 text-sm">Aucun message pour le moment</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.expediteur?.id === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.corps}</p>

                        {message.piece_jointe && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <a
                              href={message.piece_jointe}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs underline flex items-center gap-1"
                            >
                              <Paperclip className="w-3 h-3" />
                              {message.piece_jointe.split('/').pop()}
                            </a>
                          </div>
                        )}

                        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
                          {isOwn && message.est_lu && ' · Lu'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearError} className="text-red-700 hover:text-red-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input zone */}
            <div className="bg-white p-4 border-t border-gray-200">
              {attachment && (
                <div className="mb-2 bg-gray-100 p-2 rounded flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    {attachment.name}
                  </span>
                  <button onClick={() => setAttachment(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <Input
                  type="text"
                  placeholder="Tapez votre message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="flex-1"
                />

                <Button
                  onClick={handleSend}
                  disabled={!messageText.trim() && !attachment}
                  className="flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Sélectionnez une conversation pour commencer</p>
              <Button onClick={() => setShowNewChat(true)} className="flex items-center gap-2 mx-auto">
                <UserPlus className="w-4 h-4" />
                Nouvelle conversation
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal nouvelle conversation */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Nouvelle conversation</h3>
              <button onClick={() => setShowNewChat(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
                  className="flex-1"
                />
                <Button onClick={handleSearchUsers}>Rechercher</Button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((userResult) => (
                    <button
                      key={userResult.id}
                      onClick={() => handleStartNewChat(userResult.id, userResult.username, userResult.email)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Avatar name={userResult.username} size="sm" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900 text-sm">{userResult.username}</p>
                        <p className="text-xs text-gray-500">{userResult.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}