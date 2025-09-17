import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ImageCropper } from '@/components/ui/image-cropper';
import { 
  Loader2, User, Mail, Calendar, Shield, Settings, 
  Key, Bell, Lock, Upload, Camera, Trophy, Activity,
  Clock, Star, AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    name: '',
    avatar_url: ''
  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      // Primeiro tenta carregar o perfil existente
      let { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, username, name, avatar_url')
        .eq('id', user.id)
        .limit(1)
        .single();

      // Se não encontrar o perfil, cria um novo
      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert([
            { 
              id: user.id,
              full_name: '',
              username: '',
              name: '',
              avatar_url: ''
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        data = newProfile;
      } else if (error) {
        throw error;
      }

      setFormData({
        full_name: data?.full_name || '',
        username: data?.username || '',
        email: user.email || '',
        name: data?.name || '',
        avatar_url: data?.avatar_url || ''
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus dados.',
        variant: 'destructive'
      });
    }
  };

  // Estatísticas simuladas do usuário
  const userStats = {
    gamesAnalyzed: 128,
    successfulPredictions: 75,
    activeDays: 45,
    favoriteTeams: ['Manchester City', 'Real Madrid'],
    recentActivity: [
      { type: 'analysis', game: 'Liverpool vs Chelsea', date: '2025-08-24' },
      { type: 'prediction', game: 'PSG vs Bayern', date: '2025-08-23' },
      { type: 'alert', game: 'Barcelona vs Real Madrid', date: '2025-08-22' }
    ]
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar o arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione uma imagem.',
          variant: 'destructive'
        });
        return;
      }

      // Criar URL para preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      setCropModalOpen(true);
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar a imagem.',
        variant: 'destructive'
      });
    }
  };

  const handleCropComplete = async (croppedFile) => {
    try {
      setImageLoading(true);
      setCropModalOpen(false);

      // Upload para o Supabase Storage
      const timestamp = Date.now();
      const fileName = `avatar-${timestamp}.jpg`;

      // Upload do novo avatar
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedFile);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil com nova URL
      await updateUserProfile({
        ...formData,
        avatar_url: publicUrl
      });

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      toast({
        title: 'Sucesso',
        description: 'Foto de perfil atualizada!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload da imagem.',
        variant: 'destructive'
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          name: formData.name,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar suas informações.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header com Avatar e Informações Principais */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <div className="relative group">
            <Avatar className="h-32 w-32 cursor-pointer" onClick={handleAvatarClick}>
              {imageLoading ? (
                <AvatarFallback>
                  <Loader2 className="h-16 w-16 animate-spin" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <button 
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {cropModalOpen && selectedFile && (
              <ImageCropper
                image={selectedFile}
                onCropComplete={handleCropComplete}
                onCancel={() => {
                  setCropModalOpen(false);
                  setSelectedFile(null);
                }}
              />
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {formData.name || 'Usuário iFootball'}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {user?.is_admin && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Pro
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {userStats.gamesAnalyzed} análises
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Membro desde {new Date(user?.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[400px] mb-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Aba de Perfil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e configurações da conta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome de Exibição</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Como quer ser chamado"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Estatísticas */}
        <TabsContent value="stats">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cards de Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      {activity.type === 'analysis' ? (
                        <Activity className="h-5 w-5 text-primary" />
                      ) : activity.type === 'prediction' ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{activity.game}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métricas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <h3 className="text-3xl font-bold text-primary">
                        {userStats.gamesAnalyzed}
                      </h3>
                      <p className="text-sm text-muted-foreground">Jogos Analisados</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <h3 className="text-3xl font-bold text-green-500">
                        {userStats.successfulPredictions}%
                      </h3>
                      <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Times Favoritos</h4>
                    <div className="flex gap-2">
                      {userStats.favoriteTeams.map((team, index) => (
                        <Badge key={index} variant="secondary">
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Configurações */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Personalize sua experiência no iFootball.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notificações</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Adicionar toggles de notificações aqui */}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Visualização</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Adicionar configurações de visualização aqui */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Mantenha sua conta segura alterando regularmente suas credenciais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full md:w-auto">
                  <Key className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Sessões Ativas</h3>
                {/* Lista de sessões ativas aqui */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
