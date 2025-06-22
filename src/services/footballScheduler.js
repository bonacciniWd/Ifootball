// Sistema de agendamento para atualização automática dos dados da API
// Atualiza os dados 2 vezes por dia (12h e 00h) para otimizar o uso da API

class FootballDataScheduler {
  constructor() {
    this.isSchedulerActive = false;
    this.schedulerInterval = null;
    this.SCHEDULE_TIMES = ['00:00', '12:00']; // Horários de atualização
    this.CHECK_INTERVAL = 60000; // Verifica a cada minuto
  }

  // Inicia o agendador
  start() {
    if (this.isSchedulerActive) {
      console.log('Agendador já está ativo');
      return;
    }

    this.isSchedulerActive = true;
    this.schedulerInterval = setInterval(() => {
      this.checkSchedule();
    }, this.CHECK_INTERVAL);

    console.log('Agendador de atualização automática iniciado');
    console.log('Próximas atualizações:', this.getNextUpdateTimes());
  }

  // Para o agendador
  stop() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isSchedulerActive = false;
    console.log('Agendador de atualização automática parado');
  }

  // Verifica se é hora de atualizar
  checkSchedule() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Verifica se é um dos horários programados
    if (this.SCHEDULE_TIMES.includes(currentTime)) {
      console.log(`Iniciando atualização automática às ${currentTime}`);
      this.executeUpdate();
    }
  }

  // Executa a atualização
  async executeUpdate() {
    try {
      // Importa o serviço dinamicamente para evitar problemas de dependência circular
      const { gameService } = await import('../services/gameService');
      
      console.log('Iniciando atualização automática dos dados...');
      
      // Força atualização do cache
      const result = await gameService.forceUpdateCache();
      
      console.log('Atualização automática concluída com sucesso:', result);
      
      // Salva log da atualização
      this.logUpdate(true);
      
      // Notifica outros componentes sobre a atualização
      this.notifyUpdate();
      
    } catch (error) {
      console.error('Erro na atualização automática:', error);
      this.logUpdate(false, error.message);
    }
  }

  // Registra log da atualização
  logUpdate(success, error = null) {
    const updateLog = {
      timestamp: new Date().toISOString(),
      success,
      error
    };

    try {
      // Mantém apenas os últimos 10 logs
      const logs = this.getUpdateLogs();
      logs.unshift(updateLog);
      const recentLogs = logs.slice(0, 10);
      
      localStorage.setItem('football_update_logs', JSON.stringify(recentLogs));
    } catch (err) {
      console.error('Erro ao salvar log:', err);
    }
  }

  // Obtém logs de atualização
  getUpdateLogs() {
    try {
      const logs = localStorage.getItem('football_update_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  // Notifica outros componentes sobre a atualização
  notifyUpdate() {
    // Dispara evento customizado
    window.dispatchEvent(new CustomEvent('footballDataUpdated', {
      detail: {
        timestamp: new Date().toISOString(),
        type: 'scheduled'
      }
    }));
  }

  // Calcula próximos horários de atualização
  getNextUpdateTimes() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextTimes = [];

    this.SCHEDULE_TIMES.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      
      // Hoje
      const todayTime = new Date(today);
      todayTime.setHours(hours, minutes, 0, 0);
      
      // Amanhã
      const tomorrowTime = new Date(tomorrow);
      tomorrowTime.setHours(hours, minutes, 0, 0);
      
      // Se ainda não passou hoje, adiciona
      if (todayTime > now) {
        nextTimes.push(todayTime);
      }
      
      // Sempre adiciona amanhã
      nextTimes.push(tomorrowTime);
    });

    return nextTimes
      .sort((a, b) => a - b)
      .slice(0, 4) // Próximos 4 horários
      .map(time => time.toLocaleString('pt-BR'));
  }

  // Força uma atualização manual
  async forceUpdate() {
    console.log('Atualização manual solicitada');
    await this.executeUpdate();
  }

  // Verifica se o agendador está ativo
  isActive() {
    return this.isSchedulerActive;
  }

  // Obtém status do agendador
  getStatus() {
    const logs = this.getUpdateLogs();
    const lastUpdate = logs.length > 0 ? logs[0] : null;
    
    return {
      active: this.isSchedulerActive,
      schedules: this.SCHEDULE_TIMES,
      nextUpdates: this.getNextUpdateTimes(),
      lastUpdate: lastUpdate ? {
        time: new Date(lastUpdate.timestamp).toLocaleString('pt-BR'),
        success: lastUpdate.success,
        error: lastUpdate.error
      } : null,
      totalUpdates: logs.length,
      successfulUpdates: logs.filter(log => log.success).length
    };
  }
}

// Instância singleton
export const footballScheduler = new FootballDataScheduler();

// Auto-start quando o módulo é carregado (apenas no cliente)
if (typeof window !== 'undefined') {
  // Inicia automaticamente após 5 segundos
  setTimeout(() => {
    footballScheduler.start();
  }, 5000);

  // Para o agendador quando a página é fechada
  window.addEventListener('beforeunload', () => {
    footballScheduler.stop();
  });
}
