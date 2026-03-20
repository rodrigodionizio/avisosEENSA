// components/ui/PushButton.tsx
'use client';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Icons } from './Icons';

export function PushButton() {
  const { status, subscribe, unsubscribe } = usePushNotifications();

  if (status === 'unsupported') return null;

  const isDisabled = status === 'loading' || status === 'denied';
  const isSubscribed = status === 'subscribed';

  const handleClick = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  const buttonContent = () => {
    switch (status) {
      case 'idle':
        return (
          <>
            <Icons.Bell size={16} />
            <span className="hidden sm:inline">Receber notificações</span>
            <span className="sm:hidden">Ativar</span>
          </>
        );
      case 'loading':
        return (
          <>
            <Icons.Loader size={16} className="animate-spin" />
            <span>Aguarde...</span>
          </>
        );
      case 'subscribed':
        return (
          <>
            <Icons.BellOff size={16} />
            <span className="hidden sm:inline">Cancelar notificações</span>
            <span className="sm:hidden">Desativar</span>
          </>
        );
      case 'denied':
        return (
          <>
            <Icons.BellOff size={16} />
            <span className="text-xs">Bloqueadas</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={
        status === 'denied'
          ? 'Notificações bloqueadas. Desbloqueie nas configurações do navegador.'
          : isSubscribed
          ? 'Clique para cancelar notificações'
          : 'Clique para receber notificações de avisos urgentes'
      }
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
        font-display font-bold text-xs sm:text-sm border-2 
        transition-all duration-200 min-h-[44px]
        ${
          isSubscribed
            ? 'bg-eensa-red-lt text-eensa-red border-[#f5c5b8] hover:bg-[#fde5df]'
            : 'bg-eensa-teal-lt text-eensa-teal border-eensa-teal-border hover:bg-[#B0E5F3]'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-px hover:shadow-sm cursor-pointer'}
      `}
    >
      {buttonContent()}
    </button>
  );
}
