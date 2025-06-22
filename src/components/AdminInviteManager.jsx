import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/adminService';
import { 
  Plus, 
  Copy, 
  Calendar, 
  Users, 
  Eye, 
  Trash2, 
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

const AdminInviteManager = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newInvite, setNewInvite] = useState({
    maxUses: 1,
    validityDays: 30
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      setLoading(true);
      console.log('Loading invites...');
      const data = await adminService.getAllInviteCodes();
      console.log('Invites loaded:', data);
      setInvites(data || []);
    } catch (error) {
      console.error('Error loading invites:', error);
      toast({
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar a lista de convites.",
        variant: "destructive"
      });
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  const generateInvite = async () => {
    try {
      setGenerating(true);
      
      const invite = await adminService.createInviteCode(user.id, {
        maxUses: newInvite.maxUses,
        validityDays: newInvite.validityDays
      });

      setInvites(prev => [invite, ...prev]);
      
      toast({
        title: "Convite gerado! 🎉",
        description: `Código: ${invite.code}`,
        variant: "default"
      });

      // Reset form
      setNewInvite({ maxUses: 1, validityDays: 30 });
      
    } catch (error) {
      console.error('Error generating invite:', error);
      toast({
        title: "Erro ao gerar convite",
        description: "Não foi possível gerar o convite.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: `Código ${code} copiado para a área de transferência.`,
      variant: "default"
    });
  };
  const deactivateInvite = async (inviteId) => {
    try {
      const result = await adminService.deactivateInviteCode(inviteId);
      
      if (result.success) {
        setInvites(prev => 
          prev.map(invite => 
            invite.id === inviteId 
              ? { ...invite, is_active: false }
              : invite
          )
        );

        toast({
          title: "Convite desativado",
          description: "O convite foi desativado com sucesso.",
          variant: "default"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deactivating invite:', error);
      toast({
        title: "Erro ao desativar",
        description: "Não foi possível desativar o convite.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gerar Novo Convite */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Gerar Novo Convite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxUses" className="text-slate-300">
                Máximo de Usos
              </Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                max="1000"
                value={newInvite.maxUses}
                onChange={(e) => setNewInvite(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="validityDays" className="text-slate-300">
                Validade (dias)
              </Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                max="365"
                value={newInvite.validityDays}
                onChange={(e) => setNewInvite(prev => ({ ...prev, validityDays: parseInt(e.target.value) }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button
            onClick={generateInvite}
            disabled={generating}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {generating ? 'Gerando...' : 'Gerar Convite'}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Convites */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Convites Criados ({invites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum convite encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="border border-slate-600 rounded-lg p-4 bg-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <code className="bg-slate-900 px-3 py-1 rounded text-blue-400 font-mono">
                        {invite.code}
                      </code>
                      <div className="flex items-center space-x-1">
                        {invite.is_active && !isExpired(invite.expires_at) ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          invite.is_active && !isExpired(invite.expires_at) 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {invite.is_active && !isExpired(invite.expires_at) ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      {invite.type === 'demo' && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                          DEMO
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(invite.code)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {invite.type !== 'demo' && invite.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateInvite(invite.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                    <div>
                      <span className="block text-slate-500">Usos:</span>
                      <span className="text-white">
                        {invite.used_count}/{invite.max_uses}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Criado:</span>
                      <span className="text-white">
                        {formatDate(invite.created_at)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Expira:</span>
                      <span className={`${isExpired(invite.expires_at) ? 'text-red-400' : 'text-white'}`}>
                        {formatDate(invite.expires_at)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">Status:</span>
                      <span className="text-white">
                        {invite.used_count >= invite.max_uses ? 'Esgotado' : 
                         isExpired(invite.expires_at) ? 'Expirado' : 
                         !invite.is_active ? 'Desativado' : 'Disponível'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-400 space-y-2">
          <p>📋 <strong>Códigos Demo:</strong> DEMO2024 e BETA2024 estão pré-configurados</p>
          <p>🔗 <strong>Link de convite:</strong> {window.location.origin}/invite</p>
          <p>⚙️ <strong>MVP:</strong> Sistema de convites funcional, integração com banco será implementada</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInviteManager;
