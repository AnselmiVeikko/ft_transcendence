import { useTranslation } from "react-i18next";
interface FriendRequestProps {
  name: string;
  avatarUrl: string;
  onAccept: () => void;
  onDecline: () => void;
  status?: 'ONLINE' | 'OFFLINE';
}

const FriendRequest = ({
  avatarUrl,
  name,
  onAccept,
  onDecline,
  status
}: FriendRequestProps) => {
  const {t} = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium shrink-0">
          <img src={avatarUrl} alt={`${name} avatar`} />
        </div>
        {status && (
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              role="status"
              aria-label={status === 'ONLINE' ? 'Online' : 'Offline'}
            />
          )}
        </div>
        <span className="font-medium text-gray-900 dark:text-white truncate">{name}</span>
      </div>

      <div className="flex gap-2 shrink-0 sm:ml-0 ml-[60px]">
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer whitespace-nowrap"
        >
          {t('accept')}
        </button>
        <button
          onClick={onDecline}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 cursor-pointer whitespace-nowrap"
        >
          {t('decline')}
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
