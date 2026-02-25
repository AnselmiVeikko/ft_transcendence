import { useTranslation } from "react-i18next";
interface FriendSuggestionProps {
  avatarUrl: string;
  name: string;
  onAddFriend: () => void;
  status?: 'ONLINE' | 'OFFLINE';
}

const FriendSuggestion = ({
  avatarUrl,
  name,
  onAddFriend,
  status
}: FriendSuggestionProps) => {
  const {t} = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
        <div className="w-11 h-11 flex items-center justify-center text-white font-thin text-xs">
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
      <button
        onClick={onAddFriend}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer shrink-0"
      >
        {t('add')}
      </button>
    </div>
  );
};

export default FriendSuggestion;
