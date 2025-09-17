import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const DateTimePicker = ({ 
  value, 
  onChange, 
  placeholder = "Selecionar data e hora",
  className = "",
  showTime = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const formatDate = (date) => {
    if (!date) return '';
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(showTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const days = [];
    
    // Dias do mês anterior para completar a primeira semana
    const firstDayOfWeek = start.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(start);
      date.setDate(date.getDate() - i - 1);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= end.getDate(); day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Dias do próximo mês para completar a última semana
    const remaining = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 mt-2 left-0"
        >
          <Card className="glassmorphism-card border shadow-lg min-w-[300px]">
            <CardContent className="p-4">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  ‹
                </Button>
                <h3 className="font-semibold text-sm">
                  {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  ›
                </Button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-xs text-slate-400 text-center p-2 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grade do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map(({ date, isCurrentMonth }, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();

                  return (
                    <motion.button
                      key={index}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateChange(date)}
                      className={cn(
                        "p-2 text-xs rounded-md transition-colors",
                        "hover:bg-primary/20",
                        isCurrentMonth 
                          ? "text-slate-200" 
                          : "text-slate-600",
                        isToday && "bg-primary/30 text-primary font-bold",
                        isSelected && "bg-primary text-primary-foreground font-bold",
                        isSelected && isToday && "bg-primary text-primary-foreground"
                      )}
                    >
                      {date.getDate()}
                    </motion.button>
                  );
                })}
              </div>

              {/* Seletor de hora (se habilitado) */}
              {showTime && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <Input
                      type="time"
                      value={selectedDate.toTimeString().slice(0, 5)}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(selectedDate);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setSelectedDate(newDate);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDateChange(selectedDate)}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateTimePicker;
